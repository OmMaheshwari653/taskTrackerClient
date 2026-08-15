/**
 * Task Tracker API Client
 * Connects Next.js Frontend to Express Backend Server
 */

import { STORAGE_KEYS, DEFAULT_API_URL } from "./constants";

// Types matching Backend API Responses
export interface User {
  id: number;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface TimeEntry {
  id: number;
  taskId: number;
  startTime: string;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: "open" | "running" | "done";
  dueDate?: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  totalSeconds: number;
  isRunning: boolean;
  runningSince: string | null;
  timeEntries?: TimeEntry[];
}

export interface RunningTaskSummary {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  startTime: string;
  elapsedSeconds: number;
}

export interface TodaySummary {
  date: string;
  tasksWorkedCount: number;
  totalSecondsToday: number;
  runningTask: RunningTaskSummary | null;
}

export interface ApiHealthResponse {
  status: string;
  message: string;
  version: string;
  endpoints: Record<string, string[]>;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
export const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  // Remove trailing slash if present
  return url.replace(/\/$/, "");
};

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  },
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user: User): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
    }
  },
  clear: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
  },
};

/**
 * Universal Fetch Wrapper for Backend API
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const token = authStorage.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.error || data.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle Network Failure / CORS / Unreachable server
    throw new ApiError(
      "Unable to connect to server. Please check if backend is running at " + baseUrl,
      0
    );
  }
}

/**
 * API Endpoint Callers
 */
export const api = {
  // GET / - Health Check
  checkHealth: async (): Promise<ApiHealthResponse> => {
    return fetchApi<ApiHealthResponse>("/");
  },

  // POST /auth/login
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      authStorage.setToken(response.token);
      authStorage.setUser(response.user);
    }
    return response;
  },

  // GET /tasks (?status=open|running|done)
  getTasks: async (status?: string): Promise<Task[]> => {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return fetchApi<Task[]>(`/tasks${query}`);
  },

  // POST /tasks
  createTask: async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
  }): Promise<Task> => {
    return fetchApi<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  },

  // GET /tasks/:id
  getTaskById: async (id: number): Promise<Task> => {
    return fetchApi<Task>(`/tasks/${id}`);
  },

  // POST /tasks/:id/start
  startTaskTimer: async (id: number): Promise<{ message: string; task: Task }> => {
    return fetchApi<{ message: string; task: Task }>(`/tasks/${id}/start`, {
      method: "POST",
    });
  },

  // POST /tasks/:id/stop
  stopTaskTimer: async (id: number): Promise<{ message: string; task: Task }> => {
    return fetchApi<{ message: string; task: Task }>(`/tasks/${id}/stop`, {
      method: "POST",
    });
  },

  // GET /me/today
  getTodaySummary: async (): Promise<TodaySummary> => {
    return fetchApi<TodaySummary>("/me/today");
  },

  // Logout helper
  logout: (): void => {
    authStorage.clear();
  },
};
