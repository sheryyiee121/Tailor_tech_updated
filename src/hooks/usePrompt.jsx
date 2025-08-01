// src/hooks/usePrompt.js
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const usePrompt = (message, when) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!when) return;

    const unblock = navigate.block((tx) => {
      const allowTransition = window.confirm(message);

      if (allowTransition) {
        unblock(); // Unblock navigation
        tx.retry(); // Allow transition
      }
    });

    return () => {
      unblock();
    };
  }, [navigate, message, when]);
};