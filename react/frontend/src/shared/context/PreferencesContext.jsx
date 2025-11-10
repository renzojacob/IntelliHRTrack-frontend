import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Unified preference schema
const DEFAULT_PREFS = {
  accent: 'teal',
  bg: 'gradient',
  density: 'comfortable',
  reduceMotion: false,
  glass: '0.6',
  sidebar: 'default',
  contrast: false,
  font: 'base'
};

const STORAGE_KEY = 'ih_prefs';

const PreferencesContext = createContext({
  prefs: DEFAULT_PREFS,
  updatePrefs: () => {},
  resetPrefs: () => {},
});

export function PreferencesProvider({ children }){
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  // Load persisted
  useEffect(()=>{
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        setPrefs({ ...DEFAULT_PREFS, ...parsed });
      }
    } catch { /* ignore */ }
  },[]);

  // Apply to document root (side-effects similar to static pages)
  useEffect(()=>{
    const root = document.documentElement;
    root.setAttribute('data-accent', prefs.accent);
    root.setAttribute('data-bg', prefs.bg);
    root.setAttribute('data-density', prefs.density);
    root.setAttribute('data-font', prefs.font);
    if(prefs.reduceMotion) root.classList.add('reduce-motion'); else root.classList.remove('reduce-motion');
    if(prefs.contrast) root.classList.add('high-contrast'); else root.classList.remove('high-contrast');
    // glass intensity as css vars
    const alpha = parseFloat(prefs.glass||'0.6');
    root.style.setProperty('--card-bg', `rgba(255,255,255,${alpha})`);
    root.style.setProperty('--card-border', `rgba(255,255,255,${Math.max(0, Math.min(1, alpha*0.6))})`);
    // theme
    const theme = localStorage.getItem('ih_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if(theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  },[prefs]);

  const persist = useCallback((next)=>{
    setPrefs(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  },[]);

  const updatePrefs = useCallback((partial)=>{
    persist({ ...prefs, ...partial });
  },[prefs, persist]);

  const resetPrefs = useCallback(()=> persist(DEFAULT_PREFS),[persist]);

  return (
    <PreferencesContext.Provider value={{ prefs, updatePrefs, resetPrefs }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(){ return useContext(PreferencesContext); }
