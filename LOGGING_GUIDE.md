# Error Logging System Guide

## Overview
A robust error logging system has been implemented to handle errors in both development and production environments.

## Features
- **Smart Logging**: Distinguishes between development and production.
- **LocalStorage Backup**: Saves the last 50 logs to the user's browser, persisting across reloads.
- **Visual Viewer**: An on-screen log viewer for developers/admins.
- **Error Boundary**: Catches React component errors and logs them automatically.

## Files
- `src/utils/logger.js`: Core logic.
- `src/components/ErrorBoundary.jsx`: React wrapper to catch errors.
- `src/components/LogViewer.jsx`: UI to view logs.

## Usage

### 1. logging Errors Manually
Import the logger and use it anywhere in your client-side code:

```javascript
import { logger } from "@/utils/logger";

try {
  // your code
} catch (error) {
  logger.error("Something went wrong", error, { extraId: 123 });
}
```

### 2. Viewing Logs
- **Development**: Logs are printed to the console and stored. The Log Viewer button (bug icon) appears in the bottom-left.
- **Production**: Logs are stored silently in localStorage. To view them, append `?debug=true` to the URL (e.g., `https://your-site.com/?debug=true`).

### 3. Error Boundary
The entire application is wrapped in an `ErrorBoundary`. If a crash occurs:
1. It shows a user-friendly error message.
2. It logs the full error stack.
3. You can use the Log Viewer to debug it.

## API Methods
- `logger.error(message, error, data)`
- `logger.warn(message, data)`
- `logger.info(message, data)`
- `logger.getLogs()`
- `logger.clearLogs()`
