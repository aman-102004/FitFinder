import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const showToast = useCallback((m, ms = 3000) => { setMsg(m); setTimeout(() => setMsg(null), ms); }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {msg && <div className="toast">{msg}</div>}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
