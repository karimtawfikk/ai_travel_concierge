# TravelConcierge AI
> **Autonomous Multi-Agent Travel Architecture** — Orchestrating specialized AI agents to research, optimize, and build bespoke, interactive travel itineraries in real-time.

---

## Overview

**TravelConcierge AI** is a production-grade multi-agent travel planning platform powered by **CrewAI**, **FastAPI**, and **React (Vite)**. Instead of generating generic, single-prompt travel lists, the system deploys a coordinated crew of specialized AI agents running parallel deep research, budget validation, and real-time live execution streaming.

---

## Multi-Agent Architecture

```
                                  [ User Preferences & Travel Dates ]
                                                   │
                                                   ▼
                                      ┌─────────────────────────┐
                                      │   Flight Scout Agent    │
                                      │  (Live Duffel MCP Tool) │
                                      └────────────┬────────────┘
                                                   │
                                                   ▼
                                      ┌─────────────────────────┐
                                      │   Lead Trip Architect   │
                                      │ (Spatial Blueprinting)  │
                                      └────────────┬────────────┘
                                                   │
                     ┌─────────────────────────────┼─────────────────────────────┬─────────────────────────────┐
                     │ (Parallel Exploration)      │ (Parallel Exploration)      │ (Parallel Exploration)      │ (Parallel Exploration)
                     ▼                             ▼                             ▼                             ▼
          ┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
          │Accommodations Agent │       │  Experiences Agent  │       │    Dining Agent     │       │Mobility&TransitAgent│
          │ (Hotels & Districts)│       │ (Culture & 12h AM/PM│       │ (Breakfast/Lunch/   │       │ (Transfers & Passes)│
          │                     │       │   Timed Activities) │       │   Dinner & Cafes)   │       │                     │
          └──────────┬──────────┘       └──────────┬──────────┘       └──────────┬──────────┘       └──────────┬──────────┘
                     │                             │                             │                             │
                     └─────────────────────────────┼─────────────────────────────┴─────────────────────────────┘
                                                   │
                                                   ▼
                                        ┌─────────────────────┐
                                        │Budget &Finance Agent│
                                        │(Cost Audit & Safety)│
                                        └──────────┬──────────┘
                                                   │
                                                   ▼
                                        ┌─────────────────────┐
                                        │ Itinerary Synthesis │
                                        │        Agent        │
                                        └─────────────────────┘
```

### Specialist Roles:
1. **Flight Scout Agent**: Directly interrogates the live **Duffel Flight API** via Model Context Protocol (MCP) to discover live airline offers, non-stop flight paths, and airfare quotes, isolating the primary anchor flight.
2. **Lead Trip Architect**: Ingests flight arrival/departure anchors to calculate true usable exploration days and assigns day-by-day geographic district anchors to prevent transit exhaustion.
3. **Accommodations Agent**: Discovers handpicked boutique hotels, district values, neighborhood safety, and walkability within the Architect's base neighborhoods.
4. **Experiences & Culture Agent**: Curates timed activities in 12-hour AM/PM format, cultural landmarks, hidden gems, and seasonal weather adaptations.
5. **Dining & Culinary Agent**: Researches authentic culinary hotspots ensuring Breakfast, Lunch, and Dinner (plus optional cafes/snacks) match each day's activity district.
6. **Mobility & Transit Agent**: Calculates airport transfers, rail passes, transit durations, and daily point-to-point logistics.
7. **Budget & Finance Agent**: Audits total on-the-ground spending across lodging, dining, activities, and transit against the traveler's stated budget.
8. **Itinerary Synthesis Agent**: Assembles all dossiers into a validated day-by-day timeline with 12-hour AM/PM schedules, flight cutoff rules, and interactive Google Maps links.

---

## Key Features

- **8-Agent Coordinated Pipeline**: Sequential anchor discovery (Flights ➔ Spatial Blueprint) followed by parallel multi-domain reconnaissance.
- **Model Context Protocol (MCP) Duffel Flight Search**: Live airline API integration wrapped in MCP stdio for real-time airfare and schedule retrieval.
- **Dynamic Usable Duration Computation**: Automatically derives activity duration from flight landing and departure times for round-trip flights.
- **Live SSE Trace Streaming**: Watch the agents research, call tools, and communicate in real-time via Server-Sent Events.
- **12-Hour AM/PM Synchronized Timelines**: Natural scheduling with arrival pacing, airport transfer deadlines, and complete daily meals (Breakfast, Lunch, Dinner).
- **One-Click PDF Export**: Direct print-optimized stylesheet for exporting clean, publication-ready travel itineraries.
- **Grounded Real-Time Tools**: Integrated Serper web search, live destination weather lookups, currency conversion, and transit estimators.
- **Glassmorphic Modern Frontend**: Dark-mode UI built with React, Lucide Icons, interactive day tabs, and Google Maps integration.

---

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, Uvicorn, CrewAI, LiteLLM, Pydantic v2
- **Agent Protocol**: Model Context Protocol (MCP) with `flights_mcp_wrapper` for live Duffel API search
- **LLM Engine**: Groq (Qwen 2.5 / Llama 3 models), NVIDIA NIM, OpenRouter
- **Tools & APIs**: Duffel Flight API, SerperDev (Google Search API), Open-Meteo, ExchangeRate API
- **Frontend**: React 18, Vite, Lucide React, Print-optimized CSS3 Glassmorphism

---

## Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- **Serper API Key** ([serper.dev](https://serper.dev))
- **Groq API Key** ([console.groq.com](https://console.groq.com))
- **Duffel API Access Token** ([duffel.com](https://duffel.com))
- **NVIDIA NIM API Key** ([build.nvidia.com](https://build.nvidia.com))

---

### 2. Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/karimtawfikk/multi-agent-travel-concierge.git
   cd multi-agent-travel-concierge
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv .venv
   # Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1
   # macOS/Linux:
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI backend server**:
   ```bash
   python -m uvicorn src.server:app --reload --port 8000
   ```
   *API will be running at `http://localhost:8000` (Swagger docs at `/docs`).*

---

### 3. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install packages**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

### 4. CLI Execution Mode

You can also run the multi-agent system directly from the command line:

```bash
python run_cli.py --destination "Kyoto, Japan" --days 3 --budget 1200 --style "Cultural & Foodie"
```

The output is automatically saved to `output_itinerary.json`.

---

## Project Structure

```
ai_travel_concierge/             
├── .gitignore                # Git ignore configuration
├── requirements.txt          # Python dependencies
├── run_cli.py                # Command-line execution entry point
├── src/
│   ├── config/
│   │   ├── agents.yaml       # Agent roles, goals, and backstories
│   │   └── tasks.yaml        # Task descriptions and output expectations
│   ├── tools/
│   │   ├── weather_tool.py   # Destination weather forecast tool
│   │   ├── currency_tool.py  # Live exchange rate tool
│   │   └── transit_estimator_tool.py # Point-to-point transit calculations
│   ├── crew.py               # CrewAI crew definition and agent orchestration
│   ├── flights_mcp_wrapper.py# Duffel MCP flight search wrapper
│   ├── models.py             # Pydantic schema for structured output
│   └── server.py             # FastAPI server with SSE streaming endpoint
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AgentPipelineTracker.jsx # Real-time agent status & trace feed
    │   │   ├── TripInputForm.jsx        # Travel preference configuration studio
    │   │   ├── WelcomeHero.jsx          # Interactive agent team explainer & presets
    │   │   └── TravelCommandCenter.css  # Futuristic glassmorphism styles
    │   ├── App.jsx           # Main application state & results display
    │   └── main.jsx          # React DOM root
    ├── package.json
    └── vite.config.js
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
