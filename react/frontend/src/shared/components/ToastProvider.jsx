import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

const ToastCtx = createContext({ showToast: ()=>{} });

export function ToastProvider({ children }){
  const [items, setItems] = useState([]);
  const idRef = useRef(1);

  const showToast = useCallback((message, { type='info', duration=2600 } = {}) => {
    const id = idRef.current++;
    setItems(prev => [...prev, { id, message, type }]);
    setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), duration);
  }, []);

  const value = useMemo(()=>({ showToast }),[showToast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div id="toast-root">
        {items.map(t=> (
          <div key={t.id} className={classNames('pointer-events-auto min-w-[220px] max-w-[360px] rounded-xl p-3 border glass shadow',
              t.type==='success' && 'bg-emerald-500/15 border-emerald-500/25',
              t.type==='warning' && 'bg-amber-500/20 border-amber-500/25',
              t.type==='error' && 'bg-rose-500/20 border-rose-500/25')
          }>
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(){ return useContext(ToastCtx); }
