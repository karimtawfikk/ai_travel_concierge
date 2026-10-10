import math
import requests
from crewai.tools import tool


def _get_place_coordinates(query: str) -> tuple:
    """Helper to geocode a place name to (lat, lon, resolved_name)."""
    headers = {"User-Agent": "AITravelConcierge/1.0 (concierge@travel.ai)"}
    try:
        search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json"
        s_res = requests.get(search_url, headers=headers, timeout=8).json()
        if s_res.get("query", {}).get("search"):
            top_title = s_res["query"]["search"][0]["title"]
            sum_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{top_title}"
            res = requests.get(sum_url, headers=headers, timeout=8).json()
            coords = res.get("coordinates")
            if coords:
                return coords["lat"], coords["lon"], res.get("title", query)
    except Exception:
        pass
        
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={query}&count=1&language=en&format=json"
        geo_res = requests.get(geo_url, timeout=8).json()
        if geo_res.get("results"):
            item = geo_res["results"][0]
            return item["latitude"], item["longitude"], item.get("name", query)
    except Exception:
        pass
        
    return None


@tool("estimate_transit_and_distance")
def estimate_transit_and_distance(origin: str, destination: str, city_name: str = "") -> str:
    """
    Estimate the geographic distance, walking duration, and taxi/transit travel time between two places or landmarks in a city.
    Free, no API key required. Uses geographic coordinates and standard transit velocity models.
    Example: estimate_transit_and_distance("Zamalek", "Giza Pyramids", "Cairo")
    """
    try:
        q1 = f"{origin} {city_name}".strip()
        q2 = f"{destination} {city_name}".strip()
        
        loc1 = _get_place_coordinates(q1)
        loc2 = _get_place_coordinates(q2)
        
        if not loc1 or not loc2:
            return (
                f"Could not map exact geographic coordinates for '{origin}' and '{destination}'. "
                f"Use general neighborhood transit estimates."
            )
            
        lat1, lon1, name1 = loc1
        lat2, lon2, name2 = loc2
        
        # Haversine distance formula
        R = 6371.0  # Earth's radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        dist_km = R * c
        dist_miles = dist_km * 0.621371
        
        # Transit time models
        walk_min = round((dist_km / 4.5) * 60)
        drive_taxi_min = round((dist_km / 25.0) * 60) + 5  # Accounting for city traffic & signals
        metro_min = round((dist_km / 30.0) * 60) + 10     # Accounting for station entry/exit
        
        if dist_km <= 1.2:
            recommendation = f"Highly walkable (~{walk_min} mins on foot). No transit or taxi needed."
        elif dist_km <= 5.0:
            recommendation = f"Short taxi/rideshare (~{drive_taxi_min} mins) or direct metro/bus (~{metro_min} mins). Walking takes ~{walk_min} mins."
        else:
            recommendation = f"Significant distance across city. Recommend metro/train (~{metro_min} mins) or taxi/Uber (~{drive_taxi_min} mins in standard traffic)."
            
        return (
            f"=== Transit & Distance Estimate ===\n"
            f"- Route: {name1} -> {name2}\n"
            f"- Distance: {dist_km:.2f} km (~{dist_miles:.2f} miles)\n"
            f"- Estimated Walking Time: ~{walk_min} minutes\n"
            f"- Estimated Taxi / Rideshare: ~{drive_taxi_min} minutes (traffic dependent)\n"
            f"- Estimated Metro / Transit: ~{metro_min} minutes\n"
            f"- Recommendation: {recommendation}"
        )
    except Exception as e:
        return f"Transit calculation failed for '{origin}' -> '{destination}': {str(e)}."
