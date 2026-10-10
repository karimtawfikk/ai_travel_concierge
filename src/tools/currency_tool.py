import requests
from crewai.tools import tool


@tool("convert_currency")
def convert_currency(amount: float, from_currency: str, to_currency: str) -> str:
    """
    Convert an amount from one fiat currency to another using Frankfurter reference rates.
    Free, no API key required. Rates are reference rates, not guaranteed cash/card rates.
    Example: convert_currency(150.0, "EUR", "USD")
    """
    try:
        from_cur = from_currency.strip().upper()
        to_cur = to_currency.strip().upper()
        
        if from_cur == to_cur:
            return f"No conversion needed: {amount:.2f} {from_cur} is already in {to_cur}."
            
        url = f"https://api.frankfurter.dev/v2/rate/{from_cur}/{to_cur}"
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        rate = float(data["rate"])
        converted_amount = amount * rate
        rate_date = data.get("date", "date unavailable")
        
        return (
            f"{amount:.2f} {from_cur} = {converted_amount:.2f} {to_cur} "
            f"(reference rate: 1 {from_cur} = {rate:.6f} {to_cur}; "
            f"Frankfurter rate dated {rate_date})"
        )
    except Exception as e:
        return (
            f"ERROR: Currency conversion {from_currency!r}->{to_currency!r} failed: {e}. "
            "No rate or converted amount is available; do not estimate one."
        )
