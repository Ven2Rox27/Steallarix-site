// ============================================================
// Stellarix — API Client
// ============================================================

import type { ApiResponse } from './types';

const DEFAULT_TIMEOUT = 10_000;

interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * Base API client with error handling, timeouts, and response typing.
 * Currently returns mock data; designed for easy swap to real API.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = DEFAULT_TIMEOUT, headers = {}, signal } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: signal ?? controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      return { data, success: true };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          data: null as T,
          success: false,
          error: 'Request timed out',
        };
      }

      return {
        data: null as T,
        success: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Simulate an API call with mock data.
   * Returns the data wrapped in an ApiResponse after a small delay.
   */
  async mock<T>(data: T, delay = 0): Promise<ApiResponse<T>> {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return { data, success: true };
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
