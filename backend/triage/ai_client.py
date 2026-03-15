import json
import os
import random
import threading
import time
from collections import deque
import requests
from dotenv import load_dotenv
from .chromadb import ChromaDBManager

load_dotenv()

SYSTEM_PROMPT = """
You are NepalCare, a medical triage assistant for rural Nepal providing detailed, actionable medical advice.

LANGUAGE DETECTION - VERY IMPORTANT:
- Carefully detect the language of the patient's symptoms input
- If symptoms are written in Nepali script (देवनागरी) → ALL text fields (brief_advice, detailed_advice, food_eat, food_avoid, dos, donts) MUST be in Nepali language
- If symptoms are written in English → ALL text fields MUST be in English language
- nepali_advice field is ALWAYS in Nepali script regardless of input language
- Never mix languages — if input is Nepali respond fully in Nepali, if English respond fully in English

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
- Nepali equivalents: छाती दुख्छ, रगत बग्छ, सास फेर्न गाह्रो, बेहोस, गम्भीर चोट

**MEDIUM RISK CONDITIONS**:
- Moderate fever (38-39°C), persistent cough lasting weeks
- Moderate to severe pain, severe headache with fever
- Nausea/vomiting lasting hours, moderate diarrhea
- Mild dehydration, skin infections, fractures, sprains
- Persistent fatigue, joint swelling
- Nepali equivalents: ज्वरो, खोकी, बान्ता, पखाला, टाउको दुख्छ

**LOW RISK CONDITIONS**:
- Mild cough, mild headache, minor cuts/bruises
- Mild fever (under 38°C), indigestion, mild fatigue
- Common cold symptoms, minor aches, minor skin issues
- Nepali equivalents: हल्का खोकी, हल्का टाउको दुखाइ, सामान्य रुघाखोकी

Respond ONLY in this exact JSON format. No extra text. No markdown. No backticks:
{"risk":"HIGH|MEDIUM|LOW","brief_advice":"2-3 sentences in detected language","detailed_advice":"3-4 sentences in detected language","food_eat":"foods in detected language","food_avoid":"foods in detected language","dos":"actions in detected language","donts":"actions in detected language","nepali_advice":"ALWAYS in Nepali script"}

STRICT RULES:
- risk MUST be exactly HIGH, MEDIUM, or LOW
- If ANY high-risk keyword appears assign HIGH immediately
- Never default or hedge on HIGH risk — be direct
- ALL fields except nepali_advice must be in the SAME language as the input
- Use | to separate multiple items in food/dos/donts fields
- No markdown, no backticks, valid JSON only

EXAMPLE — English input:
{"risk":"HIGH","brief_advice":"Seek emergency medical care immediately. Call ambulance or go to nearest hospital now.","detailed_advice":"Heavy bleeding or chest pain requires immediate professional medical evaluation. Do not wait at home. Transport to hospital as fast as possible. Every minute matters.","food_eat":"After stabilization: rice water, light broth","food_avoid":"Fatty foods, spicy foods, alcohol","dos":"Keep patient calm|Lie patient flat|Call 102 ambulance|Get emergency help immediately","donts":"Do not move patient unnecessarily|Do not give heavy food|Do not delay","nepali_advice":"तुरुन्त अस्पताल जानुहोस्"}

EXAMPLE — Nepali input (मलाई ज्वरो र टाउको दुख्छ):
{"risk":"MEDIUM","brief_advice":"तपाईंका लक्षणहरू मध्यम जोखिमका छन्। २४ घण्टाभित्र स्वास्थ्य चौकी वा क्लिनिकमा जानुहोस्।","detailed_advice":"ज्वरो र टाउको दुखाइ संक्रमणको संकेत हुन सक्छ। स्वास्थ्यकर्मीबाट जाँच गराउनु आवश्यक छ। लक्षण बढेमा तुरुन्त जानुहोस्। आराम गर्नुहोस् र प्रशस्त पानी पिउनुहोस्।","food_eat":"भात, केरा, हल्का सूप, अदुवा चिया, मह","food_avoid":"पिरो खाना, तारेको खाना, चिसो पानी, मासु","dos":"पर्याप्त आराम गर्नुहोस्|प्रशस्त पानी पिउनुहोस्|सरसफाइ राख्नुहोस्|तापक्रम नाप्नुहोस्","donts":"कडा काम नगर्नुहोस्|निद्रा नछोड्नुहोस्|लक्षण बढे नजरअन्दाज नगर्नुहोस्","nepali_advice":"स्वास्थ्य चौकी जानुहोस्"}

EXAMPLE — English LOW risk:
{"risk":"LOW","brief_advice":"Manage at home with rest and fluids. Monitor for worsening signs.","detailed_advice":"Mild symptoms usually improve with self care in 3-5 days. Drink plenty of clean water. Rest well. If symptoms persist or worsen after 2 days visit health post.","food_eat":"Rice, dal, leafy greens, fruits, warm milk","food_avoid":"Cold drinks, very spicy food, oily snacks","dos":"Drink warm water|Physical rest|Stay warm|Eat regularly","donts":"Do not ignore persistent symptoms|Do not overexert|Do not skip meals","nepali_advice":"घरमा आराम गर्नुहोस्"}

EXAMPLE — Nepali LOW risk (मलाई हल्का रुघा लागेको छ):
{"risk":"LOW","brief_advice":"तपाईंका लक्षणहरू हल्का छन् र घरमै उपचार गर्न सकिन्छ। आराम गर्नुहोस् र प्रशस्त तरल पदार्थ पिउनुहोस्।","detailed_advice":"हल्का रुघाखोकी सामान्यतया ३-५ दिनमा ठीक हुन्छ। तातो पानी र अदुवा चिया पिउनुहोस्। राम्रोसँग आराम गर्नुहोस्। दुई दिनमा सुधार नभए स्वास्थ्य चौकी जानुहोस्।","food_eat":"तातो सूप, अदुवा चिया, मह, भात, ताजा फलफूल","food_avoid":"चिसो पेय, धेरै पिरो खाना, तेलिलो खाजा","dos":"तातो पानी पिउनुहोस्|आराम गर्नुहोस्|न्यानो राख्नुहोस्|नियमित खाना खानुहोस्","donts":"लामो समय लक्षण बेवास्ता नगर्नुहोस्|अति परिश्रम नगर्नुहोस्","nepali_advice":"घरमा आराम गर्नुहोस्"}
"""

AZURE_OPENAI_ENDPOINT = os.getenv(
    "AZURE_OPENAI_ENDPOINT",
    "https://nexalaris-tech.openai.azure.com/openai/deployments/gpt-5.4/chat/completions?api-version=2024-10-21",
)
MAX_REQUESTS_PER_MINUTE = 10
RATE_LIMIT_WINDOW_SECONDS = 60
MAX_429_RETRIES = 4
BASE_BACKOFF_SECONDS = 1.0
REQUEST_TIMEOUT_SECONDS = 45


class FixedWindowRateLimiter:
    def __init__(self, limit: int, window_seconds: int):
        self.limit = limit
        self.window_seconds = window_seconds
        self.timestamps = deque()
        self.lock = threading.Lock()

    def try_acquire(self) -> bool:
        now = time.time()
        with self.lock:
            while self.timestamps and now - self.timestamps[0] >= self.window_seconds:
                self.timestamps.popleft()

            if len(self.timestamps) >= self.limit:
                return False

            self.timestamps.append(now)
            return True


rate_limiter = FixedWindowRateLimiter(
    limit=MAX_REQUESTS_PER_MINUTE,
    window_seconds=RATE_LIMIT_WINDOW_SECONDS,
)


def analyze_symptoms(symptoms: str) -> dict:
    # ── STEP 1: CHECK CHROMADB CACHE ─────────────
    cache_result = ChromaDBManager.check_cache(symptoms, threshold=0.15)
    if cache_result and cache_result["cached"]:
        cached_response = cache_result["response"]
        try:
            parsed = json.loads(cached_response)
            parsed["_source"] = "cache"
            parsed["_cache_hit"] = True
            if cache_result.get("metadata"):
                parsed["_cached_from"] = cache_result["metadata"].get("llm_source", "unknown")
            return parsed
        except json.JSONDecodeError:
            return {"error": "Invalid cached response", "original": cached_response}

    # ── STEP 2: Try Azure OpenAI (GPT-5.4) ─────
    result, rate_limited = _try_azure_openai(symptoms)
    if result:
        ChromaDBManager.save_to_cache(symptoms, result, metadata={"llm_source": "azure_gpt_5_4"})
        result["_source"] = "azure_gpt_5_4"
        result["_cache_hit"] = False
        return result

    # ── STEP 3: If GPT is rate-limited, fallback to Gemini then Groq ─────
    if rate_limited:
        result = _try_gemini(symptoms)
        if result:
            ChromaDBManager.save_to_cache(symptoms, result, metadata={"llm_source": "gemini"})
            result["_source"] = "gemini"
            result["_cache_hit"] = False
            return result

        result = _try_groq(symptoms)
        if result:
            ChromaDBManager.save_to_cache(symptoms, result, metadata={"llm_source": "groq"})
            result["_source"] = "groq"
            result["_cache_hit"] = False
            return result

    # ── STEP 4: Final fallback ─────────────────
    fallback = _fallback_response()
    ChromaDBManager.save_to_cache(symptoms, fallback, metadata={"llm_source": "fallback"})
    fallback["_source"] = "fallback"
    fallback["_cache_hit"] = False
    return fallback


def _try_azure_openai(symptoms: str) -> tuple[dict | None, bool]:
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    if not api_key:
        print("❌ Azure OpenAI API key missing: set AZURE_OPENAI_API_KEY")
        return None, False

    headers = {
        "api-key": api_key,
        "Content-Type": "application/json",
    }
    payload = {
        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": f"Detect the language of these symptoms and respond in the same language. Patient symptoms: {symptoms}",
            },
        ],
        "max_completion_tokens": 1000,
        "temperature": 0.7,
    }

    for attempt in range(MAX_429_RETRIES + 1):
        try:
            if not rate_limiter.try_acquire():
                print("⚠️ Local GPT rate limit exceeded (10 RPM), switching to fallback provider")
                return None, True

            response = requests.post(
                AZURE_OPENAI_ENDPOINT,
                headers=headers,
                json=payload,
                timeout=REQUEST_TIMEOUT_SECONDS,
            )

            if response.status_code == 429:
                if attempt == MAX_429_RETRIES:
                    print("❌ Azure OpenAI rate limit hit after retries")
                    return None, True

                backoff = (BASE_BACKOFF_SECONDS * (2 ** attempt)) + random.uniform(0.0, 0.5)
                print(f"⚠️ Azure OpenAI 429 received, retrying in {backoff:.2f}s")
                time.sleep(backoff)
                continue

            if response.status_code != 200:
                print(f"❌ Azure OpenAI non-200 status: {response.status_code} {response.text[:300]}")
                return None, False

            data = response.json()
            if not _is_output_safe(data):
                print("❌ Azure OpenAI response blocked by content filter")
                return None, False

            text = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            if not text:
                print("❌ Azure OpenAI returned empty content")
                return None, False

            print(f"✅ Azure GPT-5.4 response: {text[:100]}...")
            return _parse_response(text, "Azure GPT-5.4"), False

        except requests.RequestException as e:
            print(f"❌ Azure OpenAI request error: {e}")
            return None, False
        except ValueError as e:
            print(f"❌ Azure OpenAI response parse error: {e}")
            return None, False

    return None, False


def _is_output_safe(response_data: dict) -> bool:
    choices = response_data.get("choices") or []
    if not choices:
        return False

    first_choice = choices[0]
    if first_choice.get("finish_reason") == "content_filter":
        return False

    content_filter_results = first_choice.get("content_filter_results") or {}
    for details in content_filter_results.values():
        if isinstance(details, dict) and details.get("filtered"):
            return False

    prompt_filters = response_data.get("prompt_filter_results") or []
    for prompt_filter in prompt_filters:
        prompt_results = prompt_filter.get("content_filter_results") or {}
        for details in prompt_results.values():
            if isinstance(details, dict) and details.get("filtered"):
                return False

    return True


def _try_gemini(symptoms: str) -> dict | None:
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={api_key}"

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"{SYSTEM_PROMPT}\n\nDetect the language of these symptoms and respond in the same language. Patient symptoms: {symptoms}"
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1024,
            }
        }

        response = requests.post(
            url,
            json=payload,
            timeout=30
        )
        response.raise_for_status()

        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        print(f"✅ Gemini response: {text[:100]}...")

        return _parse_response(text, "Gemini")

    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return None


def _try_groq(symptoms: str) -> dict | None:
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Detect the language of these symptoms and respond in the same language. Patient symptoms: {symptoms}"
                }
            ],
            "temperature": 0.2,
            "max_tokens": 1024,
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()

        data = response.json()
        text = data["choices"][0]["message"]["content"].strip()
        print(f"✅ Groq response: {text[:100]}...")

        return _parse_response(text, "Groq")

    except Exception as e:
        print(f"❌ Groq error: {e}")
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
        required_fields = [
            "risk", "brief_advice", "detailed_advice",
            "food_eat", "food_avoid", "dos", "donts", "nepali_advice"
        ]
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
        "brief_advice": "Visit a health post or clinic for evaluation. A health worker can properly assess your condition.",
        "detailed_advice": "Please consult with a trained health worker who can properly assess your condition and provide appropriate treatment. Do not ignore your symptoms especially if they are getting worse.",
        "food_eat": "Rice, dal, vegetables, fruits, warm water",
        "food_avoid": "Spicy food, fried food, alcohol, cold drinks",
        "dos": "Rest|Drink plenty of water|Take prescribed medicine|Monitor symptoms",
        "donts": "Do not self-medicate|Do not delay seeking care|Do not ignore worsening symptoms",
        "nepali_advice": "स्वास्थ्य चौकी जानुहोस्"
    }