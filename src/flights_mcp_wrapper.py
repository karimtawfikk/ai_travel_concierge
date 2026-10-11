import os
import sys
import json
import logging
import httpx
from dotenv import load_dotenv

load_dotenv()


def _filter_and_trim_offers(data, max_offers: int = 5):
    """Sort and limit flight offers to the top best/cheapest ones (supports dict, string JSON, or objects)."""
    is_str = False
    raw_data = data
    if isinstance(data, str):
        try:
            data = json.loads(data)
            is_str = True
        except Exception:
            return raw_data

    if not isinstance(data, dict):
        return raw_data

    offers = data.get("offers")
    if not isinstance(offers, list) or not offers:
        return json.dumps(data) if is_str else data

    def _offer_sort_key(offer):
        total_stops = 0
        if isinstance(offer, dict):
            slices = offer.get("slices", [])
            for s in slices:
                if isinstance(s, dict):
                    total_stops += s.get("stops", 0)

            price_val = 999999.0
            try:
                price_info = offer.get("price") or {}
                price_val = float(price_info.get("amount", 999999.0))
            except (ValueError, TypeError):
                pass
            return (total_stops, price_val)
        return (0, 999999.0)

    # Sort offers: prioritizes fewer stops first (non-stop), then lowest price
    sorted_offers = sorted(offers, key=_offer_sort_key)
    data["offers"] = sorted_offers[:max_offers]

    return json.dumps(data) if is_str else data


# 1. Transport-level patching for Duffel-Version header
_orig_sync_send = httpx.Client.send
def _patched_sync_send(self, request, *args, **kwargs):
    if "api.duffel.com" in str(request.url):
        request.headers["Duffel-Version"] = "v2"
    return _orig_sync_send(self, request, *args, **kwargs)
httpx.Client.send = _patched_sync_send

_orig_async_send = httpx.AsyncClient.send
async def _patched_async_send(self, request, *args, **kwargs):
    if "api.duffel.com" in str(request.url):
        request.headers["Duffel-Version"] = "v2"
    return await _orig_async_send(self, request, *args, **kwargs)
httpx.AsyncClient.send = _patched_async_send


# 2. Patch DuffelClient.__init__ if imported
try:
    import flights.api.client
    _orig_init = flights.api.client.DuffelClient.__init__
    def _patched_init(self, *args, **kwargs):
        _orig_init(self, *args, **kwargs)
        if hasattr(self, "headers") and isinstance(self.headers, dict):
            self.headers["Duffel-Version"] = "v2"
        if hasattr(self, "client") and hasattr(self.client, "headers"):
            self.client.headers["Duffel-Version"] = "v2"
    flights.api.client.DuffelClient.__init__ = _patched_init
except Exception as e:
    sys.stderr.write(f"[Duffel-Fix] Error patching DuffelClient: {e}\n")


# 3. Patch server.py search_flights and tool handlers directly
try:
    import flights.server
    if hasattr(flights.server, "search_flights"):
        _orig_search_flights = flights.server.search_flights

        async def _wrapped_search_flights(*args, **kwargs):
            result = await _orig_search_flights(*args, **kwargs)
            return _filter_and_trim_offers(result, max_offers=5)

        flights.server.search_flights = _wrapped_search_flights

    # Also wrap if registered inside mcp instance tools
    if hasattr(flights.server, "mcp"):
        mcp_obj = flights.server.mcp
        if hasattr(mcp_obj, "_tool_manager") and hasattr(mcp_obj._tool_manager, "_tools"):
            tools_dict = mcp_obj._tool_manager._tools
            if "search_flights" in tools_dict:
                tool_item = tools_dict["search_flights"]
                if hasattr(tool_item, "fn"):
                    _orig_fn = tool_item.fn
                    async def _wrapped_fn(*args, **kwargs):
                        res = await _orig_fn(*args, **kwargs)
                        return _filter_and_trim_offers(res, max_offers=5)
                    tool_item.fn = _wrapped_fn
except Exception as e:
    sys.stderr.write(f"[Duffel-Fix] Error patching search_flights tool: {e}\n")


if __name__ == "__main__":
    from flights.server import main
    main()
