import { useEffect, useRef } from 'react';

export default function TopProgress({ running }){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    if(running){
      el.style.opacity = '1';
      el.style.width = '15%';
      const id = setTimeout(()=>{ el.style.width='80%'; }, 200);
      return ()=> clearTimeout(id);
    } else {
      el.style.width='100%';
      const id = setTimeout(()=>{ el.style.opacity='0'; el.style.width='0%'; }, 450);
      return ()=> clearTimeout(id);
    }
  },[running]);
  return <div ref={ref} className="fixed top-0 left-0 h-[3px] w-0 z-[70] opacity-0" style={{ backgroundImage:'linear-gradient(90deg, var(--accent,#14b8a6), var(--accent-to,#0ea5a0))' }} />
}
