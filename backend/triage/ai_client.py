import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

SYSTEM_PROMPT = """
You are NepalCare, a medical triage assistant for rural Nepal providing detailed, actionable medical advice.

RISK LEVEL DETERMINATION - APPLY STRICTLY:
**HIGH RISK CONDITIONS** (MUST assign HIGH):
- Chest pain, heart attack, severe chest discomfort
- Heavy/severe bleeding, uncontrolled bleeding
- Loss of consciousness, fainting, difficulty breathing
- Severe poisoning, overdose, severe allergic reaction
- Acute stroke symptoms (facial drooping, arm weakness, speech difficulty)
- Severe trauma, accidents, major injuries
- Acute severe abdominal pain, internal bleeding signs
- Difficulty breathing, shortness of breath

**MEDIUM RISK CONDITIONS**:
- Moderate fever (38-39°C), persistent cough lasting weeks
- Moderate to severe pain, severe headache with fever
- Nausea/vomiting lasting hours, moderate diarrhea
- Mild dehydration, skin infections, fractures, sprains
- Persistent fatigue, joint swelling

**LOW RISK CONDITIONS**:
- Mild cough, mild headache, minor cuts/bruises
- Mild fever (under 38°C), indigestion, mild fatigue
- Common cold symptoms, minor aches, minor skin issues

Respond ONLY in this exact JSON format:
{"risk":"HIGH|MEDIUM|LOW","brief_advice":"Clear instruction. 2-3 sentences.","detailed_advice":"Detailed guidance. 3-4 sentences with specifics.","food_eat":"Foods to eat (comma-separated).","food_avoid":"Foods to avoid (comma-separated).","dos":"Do these things (comma-separated).","donts":"Do NOT do these (comma-separated).","nepali_advice":"2-3 words in Nepali."}

STRICT RULES:
- risk MUST be exactly HIGH, MEDIUM, or LOW
- If ANY high-risk keyword appears (bleeding, heart attack, chest pain, difficulty breathing, fainting, severe): assign HIGH immediately
- Never default or hedge on HIGH risk - be direct
- Provide REAL, SPECIFIC food and activity advice
- Use | pairs for multiple items in food/dos/donts fields
- No markdown, no backticks, valid JSON only

EXAMPLE HIGH RISK:
{"risk":"HIGH","brief_advice":"Seek emergency medical care immediately. Call ambulance or go to nearest hospital now.","detailed_advice":"Heavy bleeding or chest pain requires immediate professional medical evaluation. Do not wait. Transport to hospital as fast as possible.","food_eat":"After stabilization: rice water, light broth","food_avoid":"Fatty foods, spicy foods, alcohol","dos":"Keep patient calm|Lie patient flat|Get emergency help","donts":"Do not move patient unnecessarily|Do not give heavy food","nepali_advice":"तुरुन्त अस्पताल जानुहोस्"}

EXAMPLE MEDIUM RISK:
{"risk":"MEDIUM","brief_advice":"Visit health post or clinic within 24 hours for evaluation and treatment.","detailed_advice":"Moderate symptoms need professional assessment. Get checked by health worker. If worsening before 24h, go sooner. Rest and stay hydrated.","food_eat":"Rice, banana, light soup, ginger tea, honey","food_avoid":"Spicy food, fried food, cold water, heavy meat","dos":"Rest adequately|Drink plenty of water|Keep clean|Monitor temperature","donts":"Do not work hard|Do not skip sleep|Do not ignore worsening","nepali_advice":"स्वास्थ्य चौकी जानुहोस्"}

EXAMPLE LOW RISK:
{"risk":"LOW","brief_advice":"Manage at home with rest and fluids. Monitor for worsening signs.","detailed_advice":"Mild symptoms usually improve with self care in 3-5 days. Drink plenty of clean water. Rest. If symptoms persist or worsen, visit health post.","food_eat":"Rice, dal, leafy greens, fruits, warm milk","food_avoid":"Cold drinks, very spicy food, oily snacks","dos":"Drink warm water|Physical rest|Stay warm|Eat regularly","donts":"Do not ignore persistent symptoms|Do not overexert","nepali_advice":"घरमा आराम गर्नुहोस्"}
"""


def analyze_symptoms(symptoms: str) -> dict:
    # ── Try Groq first ─────────────────────────────
    result = _try_groq(symptoms)
    if result:
        return result

    # ── Fallback to Gemini ─────────────────────────
    result = _try_gemini(symptoms)
    if result:
        return result

    # ── Final fallback ─────────────────────────────
    return _fallback_response()


def _try_groq(symptoms: str) -> dict | None:
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Patient symptoms: {symptoms}"
                }
            ],
            temperature=0.2,
            max_tokens=1024,
        )

        text = response.choices[0].message.content.strip()
        print(f"🤖 Groq raw response: {text}")

        return _parse_response(text, "Groq")

    except Exception as e:
        print(f"❌ Groq error: {e}")
        return None


def _try_gemini(symptoms: str) -> dict | None:
    try:
        from google import genai

        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"{SYSTEM_PROMPT}\n\nPatient symptoms: {symptoms}",
            config={
                "temperature": 0.3,
                "max_output_tokens": 1024,
            }
        )

        text = response.text.strip()
        print(f"🤖 Gemini raw response: {text}")

        return _parse_response(text, "Gemini")

    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return None


def _parse_response(text: str, source: str) -> dict | None:
    try:
        # Clean markdown fences if present
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]

        text = text.strip().replace("\n", " ")

        result = json.loads(text)

        # Validate required fields
        required_fields = ["risk", "brief_advice", "detailed_advice", "food_eat", "food_avoid", "dos", "donts", "nepali_advice"]
        for field in required_fields:
            if field not in result:
                raise ValueError(f"Missing field: {field}")

        if result["risk"] not in ["HIGH", "MEDIUM", "LOW"]:
            raise ValueError(f"Invalid risk: {result['risk']}")

        print(f"✅ {source} triage result: {result['risk']}")
        return result

    except json.JSONDecodeError as e:
        print(f"❌ {source} JSON parse error: {e}")
        print(f"❌ Raw text was: {text}")
        return None

    except Exception as e:
        print(f"❌ {source} parse error: {e}")
        return None


def _fallback_response():
    return {
        "risk": "MEDIUM",
        "brief_advice": "Visit a health post or clinic for evaluation",
        "detailed_advice": "Please consult with a trained health worker who can properly assess your condition and provide appropriate treatment",
        "food_eat": "Rice, dal, vegetables, fruits",
        "food_avoid": "Spicy food, fried food, alcohol",
        "dos": "Rest|Drink water|Take prescribed medicine",
        "donts": "Do not self-medicate|Do not delay seeking care",
        "nepali_advice": "स्वास्थ्य चौकी जानुहोस्"
    }
