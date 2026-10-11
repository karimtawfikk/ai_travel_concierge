import React, { useState } from 'react';
import { Plane, Hotel, Compass, Utensils, Train, DollarSign, Sparkles, Zap, Search } from 'lucide-react';
import './TravelCommandCenter.css';
import './AgentExplain.css';

const specialists = [
  { id: '01', name: 'Flights', short: 'Routes & airfare', icon: Plane, color: '#0ea5e9', desc: 'Searches real-time round-trip flight options and airfare quotes via the Duffel MCP flight server.' },
  { id: '02', name: 'Accommodations', short: 'Stays & districts', icon: Hotel, color: '#38bdf8', desc: 'Finds the right base: neighborhoods, boutique stays, walkability, and location value.' },
  { id: '03', name: 'Experiences', short: 'Culture & weather', icon: Compass, color: '#818cf8', desc: 'Builds a realistic sightseeing rhythm around landmarks, interests, weather, and proximity.' },
  { id: '04', name: 'Dining', short: 'Food & local flavor', icon: Utensils, color: '#f59e0b', desc: 'Tracks signature dishes, markets, and restaurants that match your taste and dietary needs.' },
  { id: '05', name: 'Mobility', short: 'Transfers & transit', icon: Train, color: '#a855f7', desc: 'Solves airport arrival, transit passes, daily movement, and practical city logistics.' },
  { id: '06', name: 'Budget', short: 'Costs & savings', icon: DollarSign, color: '#10b981', desc: 'Audits on-the-ground spending across lodging, food, activities, and transport separate from flights.' },
  { id: '07', name: 'Synthesis', short: 'One coherent itinerary', icon: Sparkles, color: '#ec4899', desc: 'Combines every dossier into a day-by-day plan with map-ready coordinates.' },
];

const presets = [
  { title: 'Cairo, Egypt', subtitle: 'Culture + street food', destination: 'Cairo, Egypt', origin: 'New York (JFK)', duration_days: 3, travel_style: 'Cultural & Foodie', interests: 'Giza Pyramids, historic Islamic Cairo, Khan el-Khalili bazaar, authentic street food, Nile promenade', budget: '1200', currency: 'USD', pace: 'Balanced', travel_dates: 'November / Autumn', dietary_preferences: 'Halal / Authentic Egyptian', flag: '🇪🇬' },
  { title: 'Tokyo, Japan', subtitle: 'Neon + temples', destination: 'Tokyo, Japan', origin: 'San Francisco (SFO)', duration_days: 4, travel_style: 'Cultural & Foodie', interests: 'Shinjuku neon alleys, Akihabara tech, historic Asakusa, Tsukiji outer market, omakase sushi', budget: '1800', currency: 'USD', pace: 'Active', travel_dates: 'October / Autumn', dietary_preferences: 'No restrictions', flag: '🇯🇵' },
  { title: 'Paris, France', subtitle: 'Art + patisseries', destination: 'Paris, France', origin: 'Boston (BOS)', duration_days: 3, travel_style: 'Cultural & Foodie', interests: "Louvre & Musée d'Orsay, Montmartre, Seine cruise, artisan boulangeries", budget: '1600', currency: 'EUR', pace: 'Balanced', travel_dates: 'September / Autumn', dietary_preferences: 'Pescatarian', flag: '🇫🇷' },
  { title: 'Kyoto, Japan', subtitle: 'Zen + gardens', destination: 'Kyoto, Japan', origin: 'New York (JFK)', duration_days: 3, travel_style: 'Cultural & Foodie', interests: 'Fushimi Inari, Arashiyama bamboo grove, tea ceremonies, Gion', budget: '1300', currency: 'USD', pace: 'Relaxed', travel_dates: 'April / Spring Blossom', dietary_preferences: 'No restrictions', flag: '🇯🇵' },
];

function AgentCircle({ selectedAgent, onSelect }) {
  const count = specialists.length;
  return <div className="agent-explainer">
    <div className="agent-explainer-circle">
      <div className="agent-orbit" aria-label="Seven-agent travel planning system">
        <div className="orbit-halo orbit-halo-one" /><div className="orbit-halo orbit-halo-two" />
        <div className="orbit-center"><span>Planning team</span></div>
        {specialists.map((agent, index) => { const Icon = agent.icon; const selected = selectedAgent.id === agent.id; const angle = (360 / count) * index; return <button key={agent.id} className={`orbit-node ${selected ? 'selected' : ''}`} style={{ '--node-color': agent.color, '--node-angle': `${angle}deg`, border: 0, background: 'transparent', padding: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => onSelect(agent)}><div className="orbit-node-icon" style={selected ? { boxShadow: `0 0 0 5px ${agent.color}26, 0 0 30px ${agent.color}55`, transform: 'scale(1.08)' } : {}}><Icon size={18} /></div><div className="orbit-node-label"><b style={selected ? { color: '#fff' } : {}}>{agent.name}</b><span>{agent.short}</span></div></button>; })}
      </div>
    </div>
    <div className="agent-description" style={{ borderTopColor: selectedAgent.color }}><div className="agent-description-kicker" style={{ color: selectedAgent.color }}>Specialist {selectedAgent.id} · {selectedAgent.short}</div><h3>{selectedAgent.name}</h3><p>{selectedAgent.desc}</p><span className="agent-description-hint">Select another specialist to inspect its mission</span></div>
  </div>;
}

export default function WelcomeHero({ onSelectPreset }) {
  const [selectedAgent, setSelectedAgent] = useState(specialists[0]);
  return <div className="command-center">
    <section className="command-hero intro-panel">
      <div className="command-hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> Autonomous travel planning system</div>
        <h2>Your dream trip, crafted by <span className="gradient-text">autonomous specialists.</span></h2>
        <p className="command-lede">TravelConcierge AI deploys specialized concierges who research flights, stays, food, culture, transit, budget, and itinerary in real time—then bring everything together into one personalized journey.</p>
        <div className="command-actions"><a href="#trip-planner-studio" className="command-primary"><Zap size={16} /> Start planning</a><span className="command-note">Zero generic recommendations. 100% bespoke multi-agent coordination with Duffel MCP flights.</span></div>
      </div>
    </section>

    <section className="agents-tab"><div className="agents-tab-heading"><div><span className="section-kicker">Meet the planning team</span><h3>Specialized Agents. Tailored Execution.</h3></div><p>Click a specialist to see exactly what it contributes to your itinerary.</p></div><AgentCircle selectedAgent={selectedAgent} onSelect={setSelectedAgent} /></section>

    <section className="preset-section"><div className="section-heading compact"><div><span className="section-kicker">Need a jumpstart?</span><h3>Start from a destination brief</h3></div><p>Choose a preset and tune it in the planning studio.</p></div><div className="preset-grid">{presets.map((preset) => <button className="preset-card" key={preset.destination} onClick={() => onSelectPreset(preset)}><span className="preset-flag">{preset.flag}</span><span><b>{preset.title}</b><small>{preset.subtitle}</small></span><Search size={15} /></button>)}</div></section>
  </div>;
}
