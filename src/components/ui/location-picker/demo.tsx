"use client";

import React, { useState } from "react";
import { LocationPicker } from "./";
import type { GooglePlace } from "./types";

export function LocationPickerDemo() {
  const [pickupLocation, setPickupLocation] = useState<GooglePlace | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<GooglePlace | null>(null);
  const [stopLocation, setStopLocation] = useState<GooglePlace | null>(null);

  return (
    <div className="space-y-12 p-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Location Picker Components
        </h2>
        <p className="text-gray-600">
          Google Places integration with pill-shaped design
        </p>
      </div>

      {/* Side by side layout (horizontal) */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Horizontal Layout (Booking Style)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pickup Location
            </label>
            <LocationPicker
              variant="pickup"
              value={pickupLocation}
              onChange={setPickupLocation}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destination
            </label>
            <LocationPicker
              variant="destination"
              value={destinationLocation}
              onChange={setDestinationLocation}
              required
            />
          </div>
        </div>
      </div>

      {/* Different sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Size Variants</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">Small</p>
            <LocationPicker
              variant="pickup"
              size="sm"
              placeholder="Small location picker"
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Medium (Default)</p>
            <LocationPicker
              variant="destination"
              size="md"
              placeholder="Medium location picker"
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Large</p>
            <LocationPicker
              variant="stop"
              size="lg"
              placeholder="Large location picker"
            />
          </div>
        </div>
      </div>

      {/* Selection display */}
      {(pickupLocation || destinationLocation || stopLocation) && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-4">Selected Locations:</h4>
          
          {pickupLocation && (
            <div className="mb-2">
              <span className="font-medium text-blue-800">Pickup:</span>{" "}
              <span className="text-blue-700">{pickupLocation.address}</span>
            </div>
          )}
          
          {destinationLocation && (
            <div className="mb-2">
              <span className="font-medium text-blue-800">Destination:</span>{" "}
              <span className="text-blue-700">{destinationLocation.address}</span>
            </div>
          )}
          
          {stopLocation && (
            <div>
              <span className="font-medium text-blue-800">Stop:</span>{" "}
              <span className="text-blue-700">{stopLocation.address}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
