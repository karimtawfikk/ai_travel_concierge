import json
import re
import requests
from crewai.tools import tool


@tool("fetch_webpage_markdown")
def fetch_webpage_markdown(url: str) -> str:
    """
    Fetch a website URL (hotel details, restaurant menu, city guide, blog)
    and convert it into clean, readable markdown text.
    Standardized tool backed by MCP Fetch protocol principles.
    Example: fetch_webpage_markdown("https://en.wikipedia.org/wiki/Eiffel_Tower")
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        resp = requests.get(url, headers=headers, timeout=12)
        resp.raise_for_status()
        
        html_text = resp.text
        
        # Clean basic scripts and styles
        cleaned = re.sub(r'<(script|style|nav|footer|header)[^>]*>.*?</\1>', '', html_text, flags=re.DOTALL | re.IGNORECASE)
        # Extract text content simply
        text = re.sub(r'<[^>]+>', ' ', cleaned)
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Return first 2500 characters to keep context clean and avoid token overflows
        if len(text) > 2500:
            text = text[:2500] + "\n...[truncated for conciseness]"
            
        return f"Content extracted from {url}:\n\n{text}"
    except Exception as e:
        return f"Unable to fetch URL '{url}': {str(e)}"
