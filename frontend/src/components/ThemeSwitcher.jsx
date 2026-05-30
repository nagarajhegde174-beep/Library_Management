import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, ChevronUp } from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   LibNova ThemeSwitcher Component
   - Floating button + slide-up panel
   - Placed in both Admin header and Public Navbar
   ══════════════════════════════════════════════════════════ */

export default function ThemeSwitcher({ variant = 'floating' }) {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <div
      ref={panelRef}
      className={`ts-wrapper ts-wrapper--${variant}`}
      style={{
        position: variant === 'floating' ? 'fixed' : 'relative',
        bottom: variant === 'floating' ? '24px' : 'auto',
        right: variant === 'floating' ? '24px' : 'auto',
        zIndex: 9999,
      }}
    >
      {/* ── Trigger Button ── */}
      <button
        className={`ts-trigger ${open ? 'ts-trigger--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Switch Theme"
        aria-label="Open theme switcher"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: variant === 'floating' ? '0' : '8px',
          background: variant === 'floating'
            ? 'var(--gradient-primary)'
            : 'var(--glass-bg)',
          border: `1px solid var(--glass-border)`,
          borderRadius: variant === 'floating' ? '50%' : '12px',
          width: variant === 'floating' ? '50px' : 'auto',
          height: variant === 'floating' ? '50px' : '38px',
          padding: variant === 'floating' ? '0' : '0 14px',
          cursor: 'pointer',
          color: variant === 'floating' ? '#ffffff' : 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: 'inherit',
          boxShadow: open
            ? 'var(--shadow-glow)'
            : variant === 'floating' ? 'var(--shadow-md)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: open ? 'scale(1.08)' : 'scale(1)',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span style={{
          position: 'absolute', inset: 0,
          background: 'var(--gradient-primary)',
          opacity: open ? 0.15 : 0,
          transition: 'opacity 0.3s',
          borderRadius: 'inherit',
        }} />
        <Palette size={variant === 'floating' ? 22 : 16} style={{ zIndex: 1 }} />
        {variant !== 'floating' && (
          <>
            <span style={{ zIndex: 1, marginLeft: '4px' }}>Theme</span>
            <ChevronUp
              size={14}
              style={{
                zIndex: 1,
                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s',
                marginLeft: '2px',
              }}
            />
          </>
        )}
        {/* Swatches preview on floating button */}
        {variant === 'floating' && (
          <div style={{
            position: 'absolute',
            bottom: '-4px', right: '-4px',
            display: 'flex',
            gap: '2px',
          }}>
            {currentTheme.colors.map((c, i) => (
              <div key={i} style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: c,
                border: '1px solid rgba(255,255,255,0.3)',
              }} />
            ))}
          </div>
        )}
      </button>

      {/* ── Theme Panel ── */}
      <div
        style={{
          position: 'absolute',
          bottom: variant === 'floating' ? 'calc(100% + 12px)' : 'auto',
          top: variant !== 'floating' ? 'calc(100% + 12px)' : 'auto',
          right: 0,
          width: '240px',
          background: 'var(--bg-dropdown)',
          border: '1px solid var(--border-medium)',
          borderRadius: '20px',
          padding: '16px',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: `var(--shadow-md), inset 0 1px 1px var(--border-subtle)`,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transform: open ? 'translateY(0) scale(1)' : `translateY(${variant === 'floating' ? '8px' : '-8px'}) scale(0.96)`,
          transformOrigin: variant === 'floating' ? 'bottom right' : 'top right',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 10000,
        }}
      >
        {/* Panel Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{
            width: '28px', height: '28px',
            borderRadius: '8px',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Palette size={14} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Themes
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {currentTheme.name} active
            </div>
          </div>
        </div>

        {/* Theme Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {themes.map((t) => {
            const isActive = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: isActive
                    ? '1px solid var(--border-accent)'
                    : '1px solid transparent',
                  background: isActive
                    ? 'var(--accent-primary-soft)'
                    : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'var(--glass-bg)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Color Swatches */}
                <div style={{
                  display: 'flex',
                  gap: '3px',
                  flexShrink: 0,
                }}>
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === 0 ? '20px' : '12px',
                        height: '20px',
                        borderRadius: i === 0 ? '6px' : '4px',
                        background: c,
                        border: '1px solid rgba(255,255,255,0.15)',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Theme Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                    marginBottom: '1px',
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {t.description}
                  </div>
                </div>

                {/* Active Check */}
                {isActive && (
                  <div style={{
                    width: '20px', height: '20px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Check size={11} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          Theme is saved automatically
        </div>
      </div>
    </div>
  );
}
