"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { routes } from "@/utilities/routes";

export default function PredictionsPage() {
  const { data: session, status } = useSession();
  const [selectedState, setSelectedState] = useState<string>("North Carolina");
  const [selectedDraw, setSelectedDraw] = useState<string>("Midday");

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

  const drawTypes = ["Midday", "Evening"];

  // Mock predictions data
  const mockPredictions = [
    { numbers: "1-2-3", confidence: 95, rank: 1 },
    { numbers: "4-5-6", confidence: 92, rank: 2 },
    { numbers: "7-8-9", confidence: 88, rank: 3 },
    { numbers: "0-1-2", confidence: 85, rank: 4 },
    { numbers: "3-4-5", confidence: 82, rank: 5 },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
            Pick 3 Predictions
          </h1>
          <p className="text-gray-400 text-lg">
            Get the most accurate predictions for today's draws
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
                Select Draw Type
              </label>
              <select
                value={selectedDraw}
                onChange={(e) => setSelectedDraw(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {drawTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Predictions */}
        <div className="bg-black/55 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              {selectedState} - {selectedDraw} Draw
            </h2>
            <p className="text-gray-400 text-sm">
              Predictions for {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {selectedState === "North Carolina" ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
                <p className="text-emerald-300 text-sm font-semibold">
                  ⚡ Live Predictions - Updated in real-time
                </p>
              </div>

              <div className="grid gap-4">
                {mockPredictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 bg-black/30 rounded-lg border border-white/10 hover:border-yellow-400/50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/20 text-yellow-400 font-bold text-lg">
                        #{prediction.rank}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {prediction.numbers}
                        </div>
                        <div className="text-sm text-gray-400">
                          Confidence: {prediction.confidence}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-300 font-semibold">
                        Best Bet
                      </div>
                      <div className="text-xs text-gray-400">Recommended</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  💡 <strong>Tip:</strong> These predictions are based on our
                  advanced algorithm analyzing historical patterns and trends.
                  Always play responsibly.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                Predictions for {selectedState} are coming soon!
              </p>
              <p className="text-emerald-300 text-sm mb-6">
                Currently, we're servicing North Carolina. More states will be
                added soon.
              </p>
              <Link
                href={routes.plans}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors"
              >
                View Subscription Plans
              </Link>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">
              📊 Performance Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">This Week Hits:</span>
                <span className="text-white font-semibold">12/14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Month Hits:</span>
                <span className="text-white font-semibold">48/56</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate:</span>
                <span className="text-emerald-300 font-semibold">85.7%</span>
              </div>
            </div>
          </div>

          <div className="bg-black/55 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">
              🎯 Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href={routes.drawHistory}
                className="block text-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
              >
                View Draw History
              </Link>
              <Link
                href={routes.home}
                className="block text-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

