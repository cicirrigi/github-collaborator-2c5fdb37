/**
 * 🎨 VantageImageGrid Component
 * Interactive 4x4 grid with 3D perspective, hover effects, and adjacent card animation
 * Adapted from Vue version for React + Next.js + Framer Motion
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

interface VantageImageGridProps {
  imageUrl?: string;
  className?: string;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  glowStartColor?: string;
  glowEndColor?: string;
  gridCols?: number;
  gridRows?: number;
}

export default function VantageImageGrid({
  imageUrl = '/images/vantage%20lane%20logo1.webp',
  className,
  perspective = 600,
  rotateX = -1,
  rotateY = -15,
  glowStartColor: _glowStartColor = 'rgba(203,178,106,0.5)',
  glowEndColor: _glowEndColor = 'rgba(203,178,106,1)',
  gridCols = 4,
  gridRows = 4,
}: VantageImageGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = gridCols * gridRows;

  // Get adjacent card indices
  const getAdjacentIndices = useCallback(
    (index: number): number[] => {
      return [index - 1, index + 1, index - gridCols, index + gridCols].filter(i => {
        if (i < 0 || i >= totalCards) return false;
        if (index % gridCols === 0 && i === index - 1) return false;
        if (index % gridCols === gridCols - 1 && i === index + 1) return false;
        return true;
      });
    },
    [gridCols, totalCards]
  );

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 200);
  };

  const isCardRaised = (index: number): 'big' | 'small' | null => {
    if (hoveredIndex === null) return null;
    if (index === hoveredIndex) return 'big';
    if (getAdjacentIndices(hoveredIndex).includes(index)) return 'small';
    return null;
  };

  return (
    <div className={cn('relative block w-full', className)}>
      <div
        className={cn('relative grid w-full gap-0 grid-cols-4 rounded-2xl overflow-hidden')}
        style={{
          transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: '0 0 40px rgba(203,178,106,0.15)',
        }}
      >
        {Array.from({ length: totalCards }).map((_, index) => {
          const raised = isCardRaised(index);
          const col = index % gridCols;
          const row = Math.floor(index / gridCols);

          // Calculate background position for image split
          const bgPosX = gridCols > 1 ? (col / (gridCols - 1)) * 100 : 50;
          const bgPosY = gridRows > 1 ? (row / (gridRows - 1)) * 100 : 50;

          return (
            <motion.div
              key={index}
              className={cn(
                'block overflow-hidden',
                'border-0 shadow-none outline-none',
                'focus:outline-none active:outline-none',
                'select-none cursor-pointer'
              )}
              style={{
                zIndex: index + 1 + (raised === 'big' ? 100 : raised === 'small' ? 50 : 0),
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              animate={{
                scale: raised === 'big' ? 1.15 : raised === 'small' ? 1.05 : 1,
                x: raised === 'big' ? -20 : raised === 'small' ? -5 : 0,
                y: raised === 'big' ? -20 : raised === 'small' ? -5 : 0,
                boxShadow:
                  raised === 'big'
                    ? '0px 8px 30px rgba(203,178,106,0.4)'
                    : raised === 'small'
                      ? '0px 4px 15px rgba(203,178,106,0.2)'
                      : '0px 0px 0px rgba(0,0,0,0)',
              }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
            >
              {/* Split image background - each card shows a piece - HD quality */}
              <div
                className='w-full aspect-square will-change-transform'
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                  backgroundSize: `${gridCols * 100}% ${gridRows * 100}%`,
                  backgroundRepeat: 'no-repeat',
                  imageRendering: 'auto',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
