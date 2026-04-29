"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Snackbar({ message, type = "error", onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!isVisible || !message) return null;

  const bgClass = type === "error" ? "bg-red-600" : "bg-zinc-900";

  return (
    <div className="fixed left-1/2 top-6 z-50 w-full max-w-md -translate-x-1/2 px-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`${bgClass} flex items-center justify-between gap-4 rounded-lg p-4 text-sm font-medium text-white shadow-lg`}>
        <p>{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="rounded-md p-1 transition hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
