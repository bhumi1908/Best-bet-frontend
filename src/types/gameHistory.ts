/**
 * Game History Types
 * Centralized type definitions for game history-related data structures
 */

// ============================================================================
// Base Types
// ============================================================================

/**
 * Game History from backend API
 */
export interface GameHistory {
  id: number;
  state_id: number;
  state_name: string;
  state_code: string | null;
  game_id: number;
  game_name: string;
  game_code: string;
  draw_date: string;
  draw_time: 'MID' | 'EVE';
  winning_numbers: string;
  result: 'WIN' | 'LOSS' | 'PENDING';
  total_winners: number;
  prize_amount: number;
  created_at: string;
  updated_at: string;
}

/**
 * State from backend API
 */
export interface State {
  id: number;
  state_code: string | null;
  state_name: string;
}

/**
 * Game Type from backend API
 */
export interface GameType {
  id: number;
  game_code: string;
  game_name: string;
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Create Game History Payload
 */
export interface CreateGameHistoryPayload {
  state_id: number;
  game_id: number;
  draw_date: string; // ISO date string (date only, no time)
  draw_time: 'MID' | 'EVE';
  winning_numbers: string;
  result: 'WIN' | 'LOSS' | 'PENDING';
  prize_amount: number;
}

/**
 * Update Game History Payload
 */
export interface UpdateGameHistoryPayload {
  state_id?: number;
  game_id?: number;
  draw_date?: string;
  draw_time?: 'MID' | 'EVE';
  winning_numbers?: string;
  result?: 'WIN' | 'LOSS' | 'PENDING';
  prize_amount?: number;
}

/**
 * Game History Filters
 */
export interface GameHistoryFilters {
  search?: string;
  result?: 'WIN' | 'LOSS' | 'PENDING';
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
  sortBy?: 'drawDate' | 'resultStatus' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Get Game Histories Response
 */
export interface GetGameHistoriesResponse {
  game_histories: GameHistory[];
  pagination: Pagination;
}

/**
 * Get States Response
 */
export interface GetStatesResponse {
  states: State[];
  count: number;
}

/**
 * Get Game Types Response
 */
export interface GetGameTypesResponse {
  game_types: GameType[];
  count: number;
}

// ============================================================================
// Redux State Types
// ============================================================================

/**
 * Game History State
 */
export interface GameHistoryState {
  gameHistories: GameHistory[];
  selectedGameHistory: GameHistory | null;
  pagination: Pagination;
  filters: GameHistoryFilters;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * States State
 */
export interface StatesState {
  states: State[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Game Types State
 */
export interface GameTypesState {
  gameTypes: GameType[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
