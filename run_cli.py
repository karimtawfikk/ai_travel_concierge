import sys
import json
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Ensure parent directory is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

load_dotenv(override=False)
parent_env = Path(__file__).resolve().parent.parent.parent / ".env"
if parent_env.exists():
    load_dotenv(parent_env, override=False)

from src.crew import TravelConciergeCrew
from src.models import CompleteTripItinerary


def run(destination: str, days: int, budget: str, travel_style: str, interests: str):
    print(f"\n=============================================================")
    print(f"🚀 Launching AI Travel Concierge for: {destination}")
    print(f"📅 Duration: {days} Days | 💰 Budget: ${budget} | 🎨 Style: {travel_style}")
    print(f"=============================================================\n")

    inputs = {
        "destination": destination,
        "duration_days": days,
        "travel_style": travel_style,
        "interests": interests,
        "dietary_preferences": "No restrictions",
        "budget": budget,
        "currency": "USD",
        "pace": "Balanced",
        "travel_dates": "Next month",
    }

    crew_obj = TravelConciergeCrew().crew()
    result = crew_obj.kickoff(inputs=inputs)

    out_file = Path("output_itinerary.json")
    if hasattr(result, "json_dict") and result.json_dict:
        out_file.write_text(json.dumps(result.json_dict, indent=2), encoding="utf-8")
        print(f"\n✅ Itinerary compiled successfully! Saved to {out_file.resolve()}")
    elif hasattr(result, "raw") and result.raw:
        out_file.write_text(result.raw, encoding="utf-8")
        print(f"\n✅ Raw itinerary saved to {out_file.resolve()}")

    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI Travel Concierge CLI")
    parser.add_argument("--destination", type=str, default="Kyoto, Japan", help="Destination city/country")
    parser.add_argument("--days", type=int, default=3, help="Duration in days")
    parser.add_argument("--budget", type=str, default="1200", help="Budget amount")
    parser.add_argument("--style", type=str, default="Cultural & Culinary Explorer", help="Travel style")
    parser.add_argument("--interests", type=str, default="Temples, authentic ramen, historic alleys, tea ceremony", help="Interests")

    args = parser.parse_args()
    run(args.destination, args.days, args.budget, args.style, args.interests)
