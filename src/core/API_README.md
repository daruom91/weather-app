# Enhanced API Client Documentation

The enhanced API client provides a robust, type-safe HTTP client with advanced features like retry logic, timeout handling, and error management.

## Features

- ✅ **TypeScript Support**: Full type safety with generic responses
- ✅ **Retry Logic**: Automatic retry with exponential backoff
- ✅ **Timeout Handling**: Configurable request timeouts
- ✅ **Query Parameters**: Built-in URL parameter handling
- ✅ **Error Handling**: Detailed error objects with status codes
- ✅ **Base URL Support**: Centralized API endpoint configuration
- ✅ **Request/Response Interceptors**: Easy header and body modification
- ✅ **Backward Compatibility**: Original `fetchApi` function maintained

## Quick Start

### Basic Usage

```typescript
import { apiClient } from './api';

// Configure base URL (optional)
apiClient.setBaseURL('https://api.example.com');

// Make a GET request
const response = await apiClient.get('/users');
console.log(response.data); // Typed response data
console.log(response.status); // HTTP status code
```

### Configuration Options

```typescript
// Global configuration
apiClient.setBaseURL('https://api.weatherapi.com/v1');
apiClient.setDefaultHeaders({ 'Authorization': 'Bearer token' });
apiClient.setTimeout(10000); // 10 seconds
apiClient.setMaxRetries(3);

// Per-request configuration
const response = await apiClient.get('/weather', {
  params: { city: 'London', units: 'metric' },
  timeout: 5000,
  retries: 2,
  headers: { 'X-Custom': 'value' }
});
```

## API Methods

### GET Request
```typescript
const response = await apiClient.get<User[]>('/users', {
  params: { page: 1, limit: 10 }
});
```

### POST Request
```typescript
const response = await apiClient.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### PUT Request
```typescript
const response = await apiClient.put<User>('/users/123', {
  name: 'Updated Name'
});
```

### PATCH Request
```typescript
const response = await apiClient.patch<User>('/users/123', {
  email: 'new@example.com'
});
```

### DELETE Request
```typescript
const response = await apiClient.delete('/users/123');
```

## Error Handling

The API client provides detailed error information:

```typescript
try {
  const response = await apiClient.get('/protected-resource');
} catch (error) {
  if (error instanceof Error && 'status' in error) {
    switch (error.status) {
      case 401:
        console.error('Unauthorized - check your credentials');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Server error - please try again later');
        break;
      default:
        console.error(`HTTP ${error.status}: ${error.message}`);
    }
  } else {
    console.error('Network error:', error.message);
  }
}
```

## Advanced Features

### Retry Logic
Automatic retry with exponential backoff is enabled by default (max 3 retries). You can configure this per request:

```typescript
const response = await apiClient.get('/unstable-endpoint', {
  retries: 5 // Custom retry count
});
```

### Timeout Handling
Set timeouts globally or per request:

```typescript
// Global timeout
apiClient.setTimeout(10000); // 10 seconds

// Per-request timeout
const response = await apiClient.get('/slow-endpoint', {
  timeout: 30000 // 30 seconds
});
```

### Response Types
The client supports both JSON and plain text responses:

```typescript
// JSON response (default)
const jsonResponse = await apiClient.get<User>('/api/users');

// Text response
const textResponse = await apiClient.get<string>('/api/plain-text');
```

## TypeScript Interfaces

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  data: T;           // Response data
  status: number;  // HTTP status code
  statusText: string;
  headers: Headers;
}
```

### ApiRequestConfig
```typescript
interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
}
```

### ApiError
```typescript
interface ApiError extends Error {
  status?: number;
  statusText?: string;
  response?: Response;
}
```

## Backward Compatibility

The original `fetchApi` function is maintained for backward compatibility:

```typescript
import { fetchApi, HttpMethod } from './api';

// Old way still works
const data = await fetchApi(HttpMethod.GET, '/users');
```

## Weather Service Integration

The weather service has been updated to use the enhanced API client:

```typescript
import { WeatherService } from '../services/weather.service';

const weatherService = new WeatherService();

// Set your API key
weatherService.setApiKey('your-openweathermap-api-key');

// Get current weather
const weather = await weatherService.getWeather('London');

// Get forecast
const forecast = await weatherService.getWeatherForecast('London', 5);

// Search cities
const cities = await weatherService.searchCities('San');
```

## Migration Guide

### From Basic fetchApi to Enhanced Client

**Before:**
```typescript
import { fetchApi, HttpMethod } from './api';

const data = await fetchApi(HttpMethod.GET, '/users');
```

**After:**
```typescript
import { apiClient } from './api';

const response = await apiClient.get<User[]>('/users');
const data = response.data; // Now you get status, headers, etc.
```

## Best Practices

1. **Always use TypeScript interfaces** for API responses
2. **Handle errors gracefully** with proper user feedback
3. **Set appropriate timeouts** based on endpoint characteristics
4. **Use query parameters** instead of string concatenation
5. **Configure base URL** once at app initialization
6. **Use environment variables** for API keys and sensitive data

## Environment Variables

Create a `.env` file for configuration:

```bash
VITE_API_BASE_URL=https://api.weatherapi.com/v1
VITE_API_KEY=your-api-key-here
```

Use in your code:

```typescript
apiClient.setBaseURL(import.meta.env.VITE_API_BASE_URL);
```