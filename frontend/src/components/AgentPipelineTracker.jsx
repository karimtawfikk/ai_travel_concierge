import React, { useEffect, useRef, useState } from 'react';
import { Plane, Hotel, Compass, Utensils, Train, DollarSign, Sparkles, Clock, Terminal, Activity } from 'lucide-react';
import './TravelCommandCenter.css';

const agentDefinitions = [
  { id: 'flight', name: 'Flights', icon: Plane, color: '#0ea5e9' },
  { id: 'stay', name: 'Accommodations', icon: Hotel, color: '#38bdf8' },
  { id: 'experience', name: 'Experiences', icon: Compass, color: '#818cf8' },
  { id: 'culinary', name: 'Dining', icon: Utensils, color: '#f59e0b' },
  { id: 'mobility', name: 'Mobility', icon: Train, color: '#a855f7' },
  { id: 'budget', name: 'Budget', icon: DollarSign, color: '#10b981' },
  { id: 'compiler', name: 'Synthesis', icon: Sparkles, color: '#ec4899' },
];

export default function AgentPipelineTracker({ destination, liveLogs = [], agentStatus = {}, completedCount = 0, isComplete = false }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedAgentId, setSelectedAgentId] = useState('flight');
  const logsEndRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
  }, [liveLogs.length, selectedAgentId]);

  const selectedAgent = agentDefinitions.find((agent) => agent.id === selectedAgentId) || agentDefinitions[0];
  const selectedLogs = liveLogs.filter((log) => log.agent_id === selectedAgent.id || (!log.agent_id && log.agent?.toLowerCase().includes(selectedAgent.name.toLowerCase())));
  const time = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`;
  const totalAgents = agentDefinitions.length;
  const visibleCompletedCount = agentDefinitions.filter((agent) => agentStatus[agent.id] === 'completed').length;
  const displayCompletedCount = isComplete ? totalAgents : Math.min(totalAgents, Math.max(completedCount, visibleCompletedCount));

  return <div className="control-room">
    <section className="control-header"><div><div className="eyebrow"><span className={`eyebrow-dot ${isComplete ? '' : 'live'}`} /> {isComplete ? 'Execution review' : 'Live planning room'}</div><h2>{isComplete ? 'Agent run for' : 'Planning trip to'} <span className="gradient-text">{destination || 'your destination'}</span></h2><p>{isComplete ? 'Review each specialist’s completed execution trace and tool activity.' : 'Follow each specialist as it researches and builds your travel plan.'}</p></div><div className="execution-clock"><Clock size={16} /><span><small>{isComplete ? 'run time' : 'elapsed'}</small><b>{time}</b></span></div></section>
    <section className="control-progress"><div className="progress-copy"><span><b>Agent progress</b> · {displayCompletedCount}/{totalAgents} complete</span><strong>{Math.round((displayCompletedCount / totalAgents) * 100)}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${Math.max(8, (displayCompletedCount / totalAgents) * 100)}%` }} /></div><div className="phase-legend"><span>Flight & Transit Scouting</span><span>→</span><span>Parallel Research</span><span>→</span><span>Budget</span><span>→</span><span>Synthesis</span></div></section>
    <section className="trace-panel trace-panel-focused"><div className="panel-heading trace-heading"><div><span className="section-kicker">{isComplete ? 'Agent execution trace' : 'Live agent feedback'}</span><h3><span className="trace-agent-dot" style={{ background: selectedAgent.color }} /> {selectedAgent.name}</h3></div><span className="trace-live">{isComplete ? <><Terminal size={12} /> SAVED TRACE</> : <><Activity size={12} /> LIVE</>}</span></div><div className="agent-feed-tabs">{agentDefinitions.map((agent) => { const Icon = agent.icon; const active = agent.id === selectedAgent.id; const status = agentStatus[agent.id] || 'queued'; const statusLabel = status === 'running' ? 'Running' : status === 'completed' ? 'Complete' : 'Queued'; return <button key={agent.id} className={`${active ? 'active' : ''} ${status}`} onClick={() => setSelectedAgentId(agent.id)} style={{ '--agent-color': agent.color }}><Icon size={15} /><span>{agent.name}</span><small>{statusLabel}</small></button>; })}</div><div className="trace-feed" ref={logsEndRef}>{selectedLogs.length === 0 ? <div className="trace-empty"><Terminal size={20} /><p>{agentStatus[selectedAgent.id] === 'queued' ? `${selectedAgent.name} is queued.` : `Waiting for ${selectedAgent.name.toLowerCase()} to emit its first execution event.`}</p><span>Agent inputs, MCP tool calls, results, and flight output will appear here.</span></div> : selectedLogs.map((entry, index) => <div className={`trace-event ${entry.type} ${entry.label?.toLowerCase().replaceAll(' ', '-') || ''}`} key={`${entry.time}-${index}`}><div className="trace-event-meta"><span>{entry.label || (entry.type === 'task_completed' ? 'COMPLETE' : 'AGENT UPDATE')}</span><time>{entry.time || 'now'}</time></div><p>{entry.message}</p>{entry.details !== undefined && <details className="trace-event-details" open={entry.label !== 'AGENT INPUT'}><summary>View {entry.label === 'AGENT INPUT' ? 'full agent input' : entry.label === 'TOOL REQUEST' ? 'tool arguments' : entry.label === 'TOOL RESULT' ? 'tool output' : 'full output'}</summary><pre>{typeof entry.details === 'string' ? entry.details : JSON.stringify(entry.details, null, 2)}</pre></details>}</div>)}</div><div className="trace-footer"><span><Terminal size={13} /> {selectedLogs.length} events for this agent</span>{!isComplete && <span className="trace-cursor" />}</div></section>
  </div>;
}
