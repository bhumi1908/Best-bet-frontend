import { NextResponse } from "next/server";

/**
 * API Route for Game 2: Front Number Game
 * Fetches prediction data from Excel file
 * Excel Path: C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\Raw Scrape - 10-26-2025\NC-No Program - 10-1-2025.xlsm
 * Sheet: "Data"
 * Cell Range: AF5:AG24
 */

export async function GET() {
  try {
    // TODO: Implement Excel file reading from VM
    // The Excel file should be read from:
    // Path: C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\Raw Scrape - 10-26-2025\NC-No Program - 10-1-2025.xlsm
    // Sheet: "Data"
    // Range: AF5:AG24
    
    // Mock data structure - Replace with actual Excel reading logic
    // Format: { frontNumber: string, predictions: string[] }
    const mockGameData: Record<string, string[]> = {
      "0": ["012", "023", "034", "045", "056", "067", "078", "089", "091", "002", "003", "004"],
      "1": ["123", "134", "145", "156", "167", "178", "189", "190", "101", "112", "113", "114"],
      "2": ["234", "245", "256", "267", "278", "289", "290", "201", "212", "223", "224", "225"],
      "3": ["345", "356", "367", "378", "389", "390", "301", "312", "323", "334", "335", "336"],
      "4": ["456", "467", "478", "489", "490", "401", "412", "423", "434", "445", "446", "447"],
      "5": ["567", "578", "589", "590", "501", "512", "523", "534", "545", "556", "557", "558"],
      "6": ["678", "689", "690", "601", "612", "623", "634", "645", "656", "667", "668", "669"],
      "7": ["789", "790", "701", "712", "723", "734", "745", "756", "767", "778", "779", "780"],
      "8": ["890", "801", "812", "823", "834", "845", "856", "867", "878", "889", "880", "881"],
      "9": ["901", "912", "923", "934", "945", "956", "967", "978", "989", "990", "991", "992"],
    };

    return NextResponse.json({
      success: true,
      data: {
        gameData: mockGameData,
        lastUpdated: new Date().toISOString(),
        source: {
          file: "NC-No Program - 10-1-2025.xlsm",
          sheet: "Data",
          range: "AF5:AG24"
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching Front Number Game data:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch game data",
      },
      { status: 500 }
    );
  }
}

