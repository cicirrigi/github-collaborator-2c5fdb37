/**
 * useProgressiveActivation Hook
 * Manages progressive form section activation
 */

import { useState, useCallback } from 'react';

export interface ProgressiveActivationState {
  activeSection: string | null;
  completedSections: string[];
  isEnabled: boolean;
}

export const useProgressiveActivation = (initialSection?: string) => {
  const [activeSection, setActiveSection] = useState<string | null>(initialSection || null);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  const activateSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, []);

  const completeSection = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      if (!prev.includes(sectionId)) {
        return [...prev, sectionId];
      }
      return prev;
    });
  }, []);

  const isCompleted = useCallback((sectionId: string) => {
    return completedSections.includes(sectionId);
  }, [completedSections]);

  const isActive = useCallback((sectionId: string) => {
    return activeSection === sectionId;
  }, [activeSection]);

  return {
    activeSection,
    completedSections,
    isEnabled,
    activateSection,
    completeSection,
    isCompleted,
    isActive,
    setIsEnabled,
  };
};
