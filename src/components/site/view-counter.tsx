"use client";

import { useEffect, useRef } from "react";
import { incrementPostViews } from "@/lib/actions";

interface ViewCounterProps {
  postId: string;
}

export function ViewCounter({ postId }: ViewCounterProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const timer = setTimeout(() => {
      incrementPostViews(postId).catch(() => undefined);
    }, 1000);
    return () => clearTimeout(timer);
  }, [postId]);

  return null;
}
