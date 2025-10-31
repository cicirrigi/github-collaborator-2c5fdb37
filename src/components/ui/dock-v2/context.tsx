'use client';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { Orientation } from './types';

interface DockCtx {
  orientation: Orientation;
  mouseX: number;
  mouseY: number;
  setMouse: (x: number, y: number) => void;
  resetMouse: () => void;
  register: (id: string, getCenter: () => { x: number; y: number }) => void;
  unregister: (id: string) => void;
  getCenter: (id: string) => { x: number; y: number } | undefined;
  isHovered: boolean; // Track if dock is being hovered
}

const DockContext = createContext<DockCtx | null>(null);

export const useDockCtx = () => {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error('useDockCtx must be used within <DockProvider>');
  return ctx;
};

export function DockProvider({
  children,
  orientation = 'horizontal',
}: {
  children: React.ReactNode;
  orientation?: Orientation;
}) {
  const [mouse, setMouse] = useState({
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
  });

  const registry = useRef(new Map<string, () => { x: number; y: number }>());

  // Track hover state pentru container expansion
  const isHovered = mouse.x !== Number.POSITIVE_INFINITY && mouse.y !== Number.POSITIVE_INFINITY;

  const value = useMemo<DockCtx>(
    () => ({
      orientation,
      mouseX: mouse.x,
      mouseY: mouse.y,
      setMouse: (x, y) => setMouse({ x, y }),
      resetMouse: () => setMouse({ x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY }),
      register: (id, getter) => registry.current.set(id, getter),
      unregister: id => registry.current.delete(id),
      getCenter: id => registry.current.get(id)?.(),
      isHovered,
    }),
    [orientation, mouse, isHovered]
  );

  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}
