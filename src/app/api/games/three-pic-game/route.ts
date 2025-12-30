import { NextResponse } from "next/server";

/**
 * API Route for Game 1: Three Pic Game
 * Fetches prediction data from Excel file
 * Excel Path: C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\Raw Scrape - 10-26-2025\NC-No Program - 10-1-2025.xlsm
 * Sheet: "Results"
 * Cell Range: AD73:AI92
 */

export async function GET() {
  try {
    // TODO: Implement Excel file reading from VM
    // The Excel file should be read from:
    // Path: C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\Raw Scrape - 10-26-2025\NC-No Program - 10-1-2025.xlsm
    // Sheet: "Results"
    // Range: AD73:AI92
    
    // Mock data structure - Replace with actual Excel reading logic
    const mockPredictions = [
      "123", "234", "345", "456", "567", "678", "789", "890",
      "012", "135", "246", "357", "468", "579", "680", "791",
      "802", "913", "024", "136", "247", "358", "469", "570",
      "681", "792", "803", "914", "025", "137", "248", "359",
      "460", "571", "682", "793", "804", "915", "026", "138",
      "249", "350", "461", "572", "683", "794", "805", "916"
    ];

    return NextResponse.json({
      success: true,
      data: {
        predictions: mockPredictions,
        lastUpdated: new Date().toISOString(),
        source: {
          file: "NC-No Program - 10-1-2025.xlsm",
          sheet: "Results",
          range: "AD73:AI92"
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching Three Pic Game data:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch game data",
      },
      { status: 500 }
    );
  }
}

