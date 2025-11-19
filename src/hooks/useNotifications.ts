"use client";

import { useState, useCallback } from "react";

export interface Noti {
  id: string;
  text: string;
  x: number;
  y: number;
  variant?: "neutral" | "success" | "error";
  duration?: number;
}

export function useNotifications() {
  const [notis, setNotis] = useState<Noti[]>([]);

  const show = useCallback((props: Omit<Noti, "id">) => {
    const id = crypto.randomUUID();
    setNotis((prev) => [...prev, { id, ...props }]);
  }, []);

  const remove = useCallback((id: string) => {
    setNotis((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notis, show, remove };
}
