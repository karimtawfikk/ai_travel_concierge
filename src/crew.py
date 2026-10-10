import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import PrivateAttr

from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool

from .models import CompleteTripItinerary, TripSpatialBlueprint
from .tools.weather_tool import get_destination_weather
from .tools.currency_tool import convert_currency
from .tools.transit_estimator_tool import estimate_transit_and_distance
import litellm

litellm.num_retries = 5




local_env = Path(__file__).resolve().parent.parent / ".env"
if local_env.exists():
    load_dotenv(local_env, override=True)
parent_env = Path(__file__).resolve().parent.parent.parent.parent / ".env"
if parent_env.exists():
    load_dotenv(parent_env, override=False)


@CrewBase
class TravelConciergeCrew:
    """Master AI Travel Concierge Crew with 7 specialized agents and parallel execution"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    def _get_search_tool(self):
        """Require Serper so research tasks cannot silently run without web search."""
        if not os.getenv("SERPER_API_KEY"):
            raise RuntimeError(
                "SERPER_API_KEY is required for travel research. Add it to the project .env."
            )
        return SerperDevTool(n_results=3)

    @agent
    def trip_architect(self) -> Agent:
        groq_llm_lead = LLM(
            model="groq/qwen/qwen3.8-27b",
            temperature=0.1,
            max_tokens=1000,
            api_key=os.getenv("GROQ_API_KEY6") or os.getenv("GROQ_API_KEY1"),
            reasoning_format="hidden",
            reasoning_effort="low",
        )
        return Agent(
            config=self.agents_config["trip_architect"],
            tools=[],
            llm=groq_llm_lead,
            max_iter=2,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def stay_scout(self) -> Agent:
        groq_llm_1 = LLM(
            model="groq/openai/gpt-oss-120b",
            temperature=0.1,
            max_tokens=2000,
            api_key=os.getenv("GROQ_API_KEY1"),
            reasoning_format="hidden",
            reasoning_effort="low",
        )
        tools = []
        search = self._get_search_tool()
        tools.append(search)

        return Agent(
            config=self.agents_config["stay_scout"],
            tools=tools,
            llm=groq_llm_1,
            max_iter=5,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def activity_planner(self) -> Agent:
        groq_llm_2 = LLM(
            model="groq/openai/gpt-oss-120b",
            temperature=0.1,
            max_tokens=2000,
            api_key=os.getenv("GROQ_API_KEY2"),
            reasoning_format="hidden",
            reasoning_effort="low",
        )
        tools = [get_destination_weather, estimate_transit_and_distance]
        search = self._get_search_tool()
        tools.append(search)

        return Agent(
            config=self.agents_config["activity_planner"],
            tools=tools,
            llm=groq_llm_2,
            max_iter=6,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def food_scout(self) -> Agent:
        groq_llm_3 = LLM(
            model="groq/openai/gpt-oss-120b",
            temperature=0.1,
            max_tokens=2000,
            api_key=os.getenv("GROQ_API_KEY3"),
            reasoning_format="hidden",
            reasoning_effort="low",
        )
        tools = [estimate_transit_and_distance]
        search = self._get_search_tool()
        tools.append(search)

        return Agent(
            config=self.agents_config["food_scout"],
            tools=tools,
            llm=groq_llm_3,
            max_iter=5,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def transit_scout(self) -> Agent:
        groq_llm_4 = LLM(
            model="groq/openai/gpt-oss-120b",
            temperature=0.1,
            max_tokens=2000,
            api_key=os.getenv("GROQ_API_KEY4"),
            reasoning_format="hidden",
            reasoning_effort="low",
        )
        tools = [estimate_transit_and_distance]
        search = self._get_search_tool()
        tools.append(search)

        return Agent(
            config=self.agents_config["transit_scout"],
            tools=tools,
            llm=groq_llm_4,
            max_iter=5,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def budget_analyst(self) -> Agent:
        nvidia_budget_llm = LLM(
            model="openai/nvidia/nemotron-3.5-lightning-30b-a3b",
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=os.getenv("NVIDIA_BUDGET_API_KEY"),
            temperature=0.1
        )
        return Agent(
            config=self.agents_config["budget_analyst"],
            tools=[convert_currency],
            llm=nvidia_budget_llm,
            max_iter=3,
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def itinerary_compiler(self) -> Agent:
        
        """compiler_llm = LLM(
            model="openai/z-ai/glm-5.3-flash",
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=os.getenv("NVIDIA_API_KEY"),
            temperature=0.1,
        )"""

        compiler_llm = LLM(
            model="openai/nvidia/nemotron-3.5-lightning-30b-a3b",
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=os.getenv("NVIDIA_API_KEY"),
            temperature=0.1
        )

        return Agent(
            config=self.agents_config["itinerary_compiler"],
            tools=[],
            llm=compiler_llm,
            max_iter=3,
            verbose=True,
            allow_delegation=False,
        )

    @task
    def trip_blueprint_task(self) -> Task:
        return Task(
            config=self.tasks_config["trip_blueprint_task"],
            agent=self.trip_architect(),
            output_pydantic=TripSpatialBlueprint,
        )

    @task
    def stay_scout_task(self) -> Task:
        return Task(
            config=self.tasks_config["stay_scout_task"],
            agent=self.stay_scout(),
            context=[self.trip_blueprint_task()],
        )

    @task
    def activity_planning_task(self) -> Task:
        return Task(
            config=self.tasks_config["activity_planning_task"],
            agent=self.activity_planner(),
            context=[self.trip_blueprint_task()],
        )

    @task
    def food_scout_task(self) -> Task:
        return Task(
            config=self.tasks_config["food_scout_task"],
            agent=self.food_scout(),
            context=[self.trip_blueprint_task()],
        )

    @task
    def transit_scout_task(self) -> Task:
        return Task(
            config=self.tasks_config["transit_scout_task"],
            agent=self.transit_scout(),
            context=[self.trip_blueprint_task()],
        )

    @task
    def budget_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config["budget_analysis_task"],
            agent=self.budget_analyst(),
            context=[
                self.stay_scout_task(),
                self.activity_planning_task(),
                self.food_scout_task(),
                self.transit_scout_task(),
            ],
        )

    @task
    def itinerary_compilation_task(self) -> Task:
        return Task(
            config=self.tasks_config["itinerary_compilation_task"],
            agent=self.itinerary_compiler(),
            context=[
                self.stay_scout_task(),
                self.activity_planning_task(),
                self.food_scout_task(),
                self.transit_scout_task(),
                self.budget_analysis_task(),
            ],
            output_pydantic=CompleteTripItinerary,
        )

    @crew
    def crew(self, step_callback=None, task_callback=None) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            step_callback=step_callback,
            task_callback=task_callback,
            verbose=True,
        )
