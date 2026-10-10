import requests
from crewai.tools import tool


@tool("get_destination_weather")
def get_destination_weather(city_name: str) -> str:
    """
    Fetch real-time and upcoming seasonal weather forecast for any destination city worldwide.
    Uses Open-Meteo's free, high-accuracy meteorological API (no API key required).
    Returns temperature range (Celsius and Fahrenheit), rain probabilities, and condition summaries.
    """
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=en&format=json"
        geo_res = requests.get(geo_url, timeout=10).json()
        
        if not geo_res.get("results"):
            return f"Weather data not found for '{city_name}'. Default to temperate seasonal expectations."
            
        location = geo_res["results"][0]
        lat = location["latitude"]
        lon = location["longitude"]
        country = location.get("country", "")
        
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&"
            f"daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&"
            f"current_weather=true&timezone=auto"
        )
        w_res = requests.get(weather_url, timeout=10).json()
        
        current = w_res.get("current_weather", {})
        daily = w_res.get("daily", {})
        
        curr_temp_c = current.get("temperature", 20.0)
        curr_temp_f = round(curr_temp_c * 9 / 5 + 32, 1)
        
        max_temps = daily.get("temperature_2m_max", [curr_temp_c])
        min_temps = daily.get("temperature_2m_min", [curr_temp_c])
        precip = daily.get("precipitation_probability_max", [10])
        
        avg_max_c = round(sum(max_temps) / len(max_temps), 1)
        avg_min_c = round(sum(min_temps) / len(min_temps), 1)
        avg_max_f = round(avg_max_c * 9 / 5 + 32, 1)
        avg_min_f = round(avg_min_c * 9 / 5 + 32, 1)
        max_rain_chance = max(precip) if precip else 0
        
        report = (
            f"Weather Report for {location['name']}, {country} (Lat: {lat}, Lon: {lon}):\n"
            f"- Current Temperature: {curr_temp_c}°C ({curr_temp_f}°F)\n"
            f"- Forecast Range: High of {avg_max_c}°C ({avg_max_f}°F) / Low of {avg_min_c}°C ({avg_min_f}°F)\n"
            f"- Precipitation / Rain Risk: Up to {max_rain_chance}%\n"
            f"- Packing Tip: {'Light rain jacket or compact umbrella advised.' if max_rain_chance > 35 else 'Comfortable layers and walking shoes recommended.'}"
        )
        return report
    except Exception as e:
        return f"Weather lookup temporarily unavailable: {str(e)}. Consider standard seasonal clothing."
