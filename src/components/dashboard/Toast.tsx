"use client";

import { C, font } from "@/lib/tokens";
import { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; text: string };

const ToastCtx = createContext<{ show: (text: string, kind?: ToastKind) => void }>({
  show: () => {},
});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const show = useCallback((text: string, kind: ToastKind = "info") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 1000,
          fontFamily: font,
        }}
      >
        {toasts.map((t) => {
          const bg = t.kind === "success" ? C.green : t.kind === "error" ? C.red : "#111111";
          return (
            <div
              key={t.id}
              style={{
                background: bg,
                color: "#FFFFFF",
                padding: "11px 16px",
                fontSize: 12.5,
                fontWeight: 500,
                minWidth: 260,
                maxWidth: 400,
                animation: "toastIn 0.2s ease-out",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
            >
              {t.text}
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastConsumer() { return null; }
ToastConsumer.displayName = "ToastConsumer";
