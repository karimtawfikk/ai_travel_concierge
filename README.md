# TravelConcierge AI
> **Autonomous Multi-Agent Travel Architecture** — Orchestrating specialized AI agents to research, optimize, and build bespoke, interactive travel itineraries in real-time.

---

## Overview

**TravelConcierge AI** is a production-grade multi-agent travel planning platform powered by **CrewAI**, **FastAPI**, and **React (Vite)**. Instead of generating generic, single-prompt travel lists, the system deploys a coordinated crew of specialized AI agents running parallel deep research, budget validation, and real-time live execution streaming.

---

## Multi-Agent Architecture

```
                                      [ User Preferences ]
                                               │
                 ┌─────────────────────────────┼─────────────────────────────┬─────────────────────────────┐
                 │ (Parallel Execution)        │ (Parallel Execution)        │ (Parallel Execution)        │ (Parallel Execution)
                 ▼                             ▼                             ▼                             ▼
      ┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
      │Accommodations Agent │       │  Experiences Agent  │       │    Dining Agent     │       │Mobility&TransitAgent│
      │ (Hotels & Districts)│       │ (Culture & Rhythm)  │       │ (Local Gastronomy)  │       │ (Transfers & Passes)│
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
1. **Accommodations Agent**: Discovers handpicked boutique hotels, district values, neighborhood safety, and walkability.
2. **Experiences & Culture Agent**: Curates timed activities, cultural landmarks, hidden gems, and seasonal weather adaptations.
3. **Dining & Culinary Agent**: Researches authentic culinary hotspots, signature dishes, street food markets, and dietary-tailored restaurants.
4. **Mobility & Transit Agent**: Calculates airport transfers, rail passes, transit durations, and daily point-to-point logistics.
5. **Budget & Finance Agent**: Audits total costs across categories, checks exchange rates, and prevents budget overruns.
6. **Itinerary Synthesis Agent**: Assembles all dossiers into a validated, day-by-day itinerary with exact coordinates and map links.

---

## Key Features

- **Parallel Agent Execution**: Specialized agents run simultaneously for rapid multi-domain reconnaissance.
- **Live SSE Trace Streaming**: Watch the agents research, call tools, and communicate in real-time via Server-Sent Events.
- **Grounded Real-Time Tools**: Integrated Serper web search, live destination weather lookups, currency conversion, and transit estimators.
- **Glassmorphic Modern Frontend**: Dark-mode UI built with React, Lucide Icons, interactive day tabs, and Google Maps integration.

---

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, Uvicorn, CrewAI, LiteLLM, Pydantic v2
- **LLM Engine**: Groq (Qwen / Llama models), OpenRouter, NVIDIA NIM
- **Tools & APIs**: SerperDev (Google Search API), Open-Meteo, ExchangeRate API
- **Frontend**: React 18, Vite, Lucide React, Modern CSS3 Glassmorphism

---

## Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- **Serper API Key** ([serper.dev](https://serper.dev))
- **Groq API Key** ([console.groq.com](https://console.groq.com))

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
