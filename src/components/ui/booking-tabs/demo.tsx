"use client";

import React, { useState } from "react";
import { BookingTabs } from "./";
import type { BookingTabType } from "./types";

export function BookingTabsDemo() {
  const [activeTab, setActiveTab] = useState<BookingTabType>('oneway');

  return (
    <div className="space-y-12 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Navigation Tabs
        </h2>
        <p className="text-gray-600">
          Modern pill-shaped navigation for booking system
        </p>
      </div>

      {/* Default size */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Default (Medium)</h3>
        <BookingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Large size */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Large Size</h3>
        <BookingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          size="lg"
        />
      </div>

      {/* Small compact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Small Compact</h3>
        <BookingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          size="sm"
          variant="compact"
        />
      </div>

      {/* Current selection display */}
      <div className="mt-8 p-6 bg-sky-50 rounded-xl border border-sky-200">
        <h4 className="font-medium text-sky-900 mb-2">Current Selection:</h4>
        <p className="text-sky-700 capitalize">
          <strong>{activeTab}</strong> booking type selected
        </p>
        
        <div className="mt-4 text-sm text-sky-600">
          {activeTab === 'oneway' && "Single journey from pickup to destination"}
          {activeTab === 'return' && "Round trip with return date/time"}
          {activeTab === 'hourly' && "Chauffeur service by the hour"}
          {activeTab === 'fleet' && "Multiple vehicles for events"}
        </div>
      </div>
    </div>
  );
}
