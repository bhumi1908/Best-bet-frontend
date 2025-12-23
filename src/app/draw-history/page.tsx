"use client";

import Link from "next/link";
import { useState } from "react";

export default function DrawHistoryPage() {
  const [selectedState, setSelectedState] = useState<string>("North Carolina");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const states = [
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Idaho",
    "Illinois",
    "Indiana",
    "Kansas",
    "Kentucky",
    "Maine",
    "Maryland",
    "Michigan",
    "Mississippi",
    "Missouri",
    "North Carolina",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "Ohio",
    "Pennsylvania",
    "South Carolina",
    "Virginia",
    "Vermont",
    "Wisconsin",
  ];

  // Mock draw history data
  const mockDraws = [
    { time: "12:00 PM", numbers: "1-2-3", type: "Midday" },
    { time: "11:00 PM", numbers: "4-5-6", type: "Evening" },
    { time: "12:00 PM", numbers: "7-8-9", type: "Midday" },
    { time: "11:00 PM", numbers: "0-1-2", type: "Evening" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
            Draw History
          </h1>
          <p className="text-gray-400 text-lg">
            View historical Pick 3 draw results by state and date
          </p>
        </div>

        {/* Filters */}
        <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Draw Results */}
        <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            {selectedState} - {new Date(selectedDate).toLocaleDateString()}
          </h2>

          {selectedState === "North Carolina" ? (
            <div className="space-y-4">
              {mockDraws.map((draw, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-400 font-semibold">
                      {draw.type}
                    </span>
                    <span className="text-gray-400">{draw.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">
                      {draw.numbers}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                Draw history for {selectedState} is coming soon!
              </p>
              <p className="text-emerald-300 text-sm">
                Currently, we're servicing North Carolina. More states will be
                added soon.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Want to see predictions for upcoming draws?
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-150"
          >
            Login to View Predictions
          </Link>
        </div>
      </div>
    </div>
  );
}

