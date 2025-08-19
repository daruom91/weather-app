export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
} as const;

export type HttpMethodType = typeof HttpMethod[keyof typeof HttpMethod];

export interface ApiRequestConfig {
  method?: HttpMethodType;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  response?: Response;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiClient {
  private baseURL: string = '';
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  private timeout: number = 10000;
  private maxRetries: number = 3;

  setBaseURL(url: string): void {
    this.baseURL = url.replace(/\/$/, '');
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  setMaxRetries(retries: number): void {
    this.maxRetries = Math.max(0, retries);
  }

  private buildURL(url: string, params?: Record<string, string | number | boolean>): string {
    const fullURL = this.baseURL ? `${this.baseURL}${url}` : url;
    
    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    const urlObj = new URL(fullURL);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value));
    });
    
    return urlObj.toString();
  }

  private createTimeoutSignal(timeoutMs: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller.signal;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number
  ): Promise<Response> {
    const timeoutSignal = this.createTimeoutSignal(timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: timeoutSignal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff: wait 2^attempt * 100ms
        const delay = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  async request<T = any>(
    url: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = HttpMethod.GET,
      headers = {},
      body,
      params,
      timeout = this.timeout,
      retries = this.maxRetries,
    } = config;

    const fullURL = this.buildURL(url, params);
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    // Don't send Content-Type for GET/HEAD requests without body
    if ((method === HttpMethod.GET || method === HttpMethod.HEAD) && !body) {
      delete requestHeaders['Content-Type'];
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body !== undefined && body !== null) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const operation = async (): Promise<ApiResponse<T>> => {
      const response = await this.fetchWithTimeout(fullURL, requestOptions, timeout);
      
      const apiResponse: ApiResponse<T> = {
        data: null as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

      if (!response.ok) {
        const error: ApiError = new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.response = response;
        throw error;
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        apiResponse.data = await response.json();
      } else {
        apiResponse.data = await response.text() as T;
      }

      return apiResponse;
    };

    return this.retry(operation, retries);
  }

  // Convenience methods
  async get<T = any>(url: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: HttpMethod.GET });
  }

  async post<T = any>(url: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: HttpMethod.POST, body });
  }

  async put<T = any>(url: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: HttpMethod.PUT, body });
  }

  async patch<T = any>(url: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: HttpMethod.PATCH, body });
  }

  async delete<T = any>(url: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: HttpMethod.DELETE });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Backward compatibility - keep the original function for existing code
export const fetchApi = async (method: HttpMethodType, url: string, body?: any) => {
  try {
    const response = await apiClient.request(url, { method, body });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};
