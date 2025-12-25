export interface CreateSupportPayload {
  name: string;
  email: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
}

export interface Support {
  id: number;
  name: string;
  email: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportState {
  tickets: Support[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}