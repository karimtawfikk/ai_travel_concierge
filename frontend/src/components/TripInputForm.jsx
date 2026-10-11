import React, { useState } from 'react';
import { 
  MapPin, Calendar, DollarSign, Clock, Sparkles, 
  RefreshCw, SlidersHorizontal, Plane 
} from 'lucide-react';

export default function TripInputForm({ formData, setFormData, onGenerate, loading }) {
  const [showAdvanced, setShowAdvanced] = useState(true);

  return (
    <div 
      id="trip-planner-studio"
      className="glass-panel" 
      style={{ 
        padding: '2.25rem 2.5rem', 
        borderRadius: '24px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 28, 0.9) 100%)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Subtle top ambient glow line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)',
      }} />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '0.35rem' }}>
            <span style={{ color: '#38bdf8' }}>Configure Your Custom Journey</span>
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.55 }}>
            Provide your destination, departure details, and travel preferences. Our specialized concierges will immediately launch live multi-agent reconnaissance to construct your personalized itinerary.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: showAdvanced ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${showAdvanced ? '#38bdf8' : 'var(--border-subtle)'}`,
            color: showAdvanced ? '#38bdf8' : 'var(--text-secondary)',
            padding: '0.45rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
          }}
        >
          <SlidersHorizontal size={13} /> {showAdvanced ? 'Hide Preferences' : 'Customize Preferences'}
        </button>
      </div>

      <form onSubmit={onGenerate}>
        {/* Row 1: Core Fields */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.25rem', 
          marginBottom: '1.5rem' 
        }}>
          
          {/* Destination */}
          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              <MapPin size={14} color="#38bdf8" /> Destination City <span style={{ color: '#38bdf8' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Kyoto, Japan or Cairo, Egypt"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.94rem',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              />
            </div>
          </div>

          {/* Departure Airport/City */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              <Plane size={14} color="#0ea5e9" /> Departure City / Airport
            </label>
            <input
              type="text"
              value={formData.origin || ''}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="e.g. New York (JFK), Cairo (CAI)"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.94rem',
                fontWeight: 500,
                outline: 'none',
              }}
            />
          </div>

          {/* Flight Type (Round-Trip vs One-Way) */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              <Plane size={14} color="#38bdf8" /> Flight Route Type
            </label>
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '3px', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, flight_type: 'round_trip' })}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: (formData.flight_type || 'round_trip') === 'round_trip' ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'transparent',
                  color: (formData.flight_type || 'round_trip') === 'round_trip' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: (formData.flight_type || 'round_trip') === 'round_trip' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                Round-trip
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, flight_type: 'one_way', return_date: '' })}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.5rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: formData.flight_type === 'one_way' ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'transparent',
                  color: formData.flight_type === 'one_way' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: formData.flight_type === 'one_way' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                One-way
              </button>
            </div>
          </div>

          {/* Departure Date */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              <Calendar size={14} color="#38bdf8" /> Start Date
            </label>
            <input
              type="date"
              value={formData.departure_date || ''}
              onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
              }}
            />
          </div>

          {/* Return Date */}
          <div>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: formData.flight_type === 'one_way' ? 'rgba(255,255,255,0.3)' : 'var(--text-secondary)', 
              marginBottom: '0.45rem' 
            }}>
              <Calendar size={14} color={formData.flight_type === 'one_way' ? 'rgba(255,255,255,0.3)' : '#818cf8'} /> 
              Return Date {formData.flight_type === 'one_way' && <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>(N/A for One-Way)</span>}
            </label>
            <input
              type="date"
              disabled={formData.flight_type === 'one_way'}
              value={formData.flight_type === 'one_way' ? '' : (formData.return_date || '')}
              onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: formData.flight_type === 'one_way' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.9)',
                border: formData.flight_type === 'one_way' ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                color: formData.flight_type === 'one_way' ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                cursor: formData.flight_type === 'one_way' ? 'not-allowed' : 'text',
              }}
            />
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              <Clock size={14} color="#a855f7" /> Trip Duration
            </label>
            <select
              value={formData.duration_days}
              onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.92rem',
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value={1}>1 Day (Quick Stopover)</option>
              <option value={2}>2 Days (Weekend Escape)</option>
              <option value={3}>3 Days (Long Weekend)</option>
              <option value={4}>4 Days (In-Depth Discovery)</option>
              <option value={5}>5 Days (Full Exploration)</option>
              <option value={6}>6 Days (Extended Journey)</option>
              <option value={7}>7 Days (1 Week Odyssey)</option>
            </select>
          </div>

          {/* Budget & Currency */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              <DollarSign size={14} color="#10b981" /> Destination Budget (Excl. Flights)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g. 1200"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                style={{
                  padding: '0.8rem 0.9rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="EGP">EGP (Egyptian Pound)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Row 2: Advanced Customization */}
        {showAdvanced && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.06)', 
            borderRadius: '16px', 
            padding: '1.4rem', 
            marginBottom: '1.75rem',
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.25rem' 
          }}>
            
            {/* Travel Style */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Travel Style & Atmosphere
              </label>
              <select
                value={formData.travel_style}
                onChange={(e) => setFormData({ ...formData, travel_style: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                <option value="Cultural & Foodie">Cultural & Foodie (Historic sights + local dining)</option>
                <option value="Luxury & Relaxation">Luxury & Relaxation (High-end comfort & wellness)</option>
                <option value="Adventure & Hidden Gems">Adventure & Hidden Gems (Off-the-beaten-path)</option>
                <option value="Budget Backpacker">Budget Backpacker (Cost-optimized & hostels)</option>
                <option value="Family Friendly">Family Friendly (Paced & accessible)</option>
              </select>
            </div>

            {/* Daily Pace */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Daily Sightseeing Pace
              </label>
              <select
                value={formData.pace}
                onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                <option value="Relaxed">Relaxed (1-2 main sights per day)</option>
                <option value="Balanced">Balanced (Comfortable moderate pace)</option>
                <option value="Active">Active (Packed itinerary & early starts)</option>
              </select>
            </div>

            {/* Specific Interests */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Interests & Must-Sees
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="e.g. Pyramids, art galleries, vintage bazaars..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            {/* Dietary Preferences */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Dietary Preferences
              </label>
              <input
                type="text"
                value={formData.dietary_preferences}
                onChange={(e) => setFormData({ ...formData, dietary_preferences: e.target.value })}
                placeholder="e.g. Halal, Vegetarian, Pescatarian, None..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
            </div>

          </div>
        )}

        {/* Action Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.95rem 2.25rem',
              borderRadius: '14px',
              background: loading ? 'rgba(103, 232, 249, 0.35)' : '#67e8f9',
              color: '#06121d',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 6px 25px rgba(56, 189, 248, 0.45)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(56, 189, 248, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(56, 189, 248, 0.45)';
              }
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={19} className="spin" /> Deploying Concierge Team...
              </>
            ) : (
              <>
                Plan My Journey
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
