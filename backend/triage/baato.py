from baato import BaatoClient
import os
from dotenv import load_dotenv


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


load_dotenv()

baato_token = os.getenv('BAATO_API_KEY')

def baato_near(lat, lon, limit ,type):
    client = BaatoClient(access_token=baato_token,
    endpoint="https://api.baato.io/api", version="v1") # detault Baato base URL and version

    response = client.near_by(lat=lat, lon=lon, type=type, limit = limit)

    raw_data = response.get("data", [])
    if not isinstance(raw_data, list):
        return []

    filtered_data = []
    for item in raw_data:
        if not isinstance(item, dict):
            continue

        filtered_data.append(
            {
                "name": item.get("name"),
                "address": item.get("address"),
                "type": item.get("type"),
                "centroid": item.get("centroid"),
                "tags": item.get("tags"),
            }
        )

    return filtered_data
    # print(response["data"])
    # print(response["status"])

class BaatoView(APIView):
    def get(self, request):
        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")
        place_type = request.query_params.get("type", "hospital")
        limit = request.query_params.get("limit", 10)

        if lat is None or lon is None:
            return Response(
                {"detail": "Both 'lat' and 'lon' query params are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            lat = float(lat)
            lon = float(lon)
            limit = int(limit)
        except (TypeError, ValueError):
            return Response(
                {"detail": "Invalid latitude/longitude/limit. Provide numeric values."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            hospitals = baato_near(lat, lon, type=place_type, limit=limit)
            return Response(hospitals or [], status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"Error occurred while fetching hospitals: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )