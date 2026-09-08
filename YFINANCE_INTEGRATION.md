# yfinance Integration

## Overview

yfinance integration is now fully operational and accessible via three methods:
1. **MCP Tools** - Three tools for Claude Code integration
2. **CLI Commands** - `tv yfinance` subcommand group
3. **Node.js API** - Direct module imports for internal use

## Architecture

```
Claude Code / MCP Client
        ↓
  MCP Tools (src/tools/yfinance.js)
        ↓
  Core Wrapper (src/core/yfinance.js)
        ↓
  Python Subprocess (src/python/yfinance_fetcher.py)
        ↓
  Yahoo Finance API
```

## Quick Start

### Via CLI

```bash
# Fetch OHLCV data
tv yfinance ohlcv AAPL
tv yfinance ohlcv AAPL --period 3mo --interval 1h

# Fetch quotes
tv yfinance quote AAPL
tv yfinance quote AAPL MSFT GOOGL
```

### Via Node.js Core API

```javascript
const yfinance = require('./src/core/yfinance');

// Fetch OHLCV
const ohlcv = await yfinance.getOhlcv('AAPL', '1mo', '1d');

// Fetch single quote
const quote = await yfinance.getQuote('AAPL');

// Fetch multiple quotes
const quotes = await yfinance.getQuotes(['AAPL', 'MSFT', 'GOOGL']);

// Fetch multiple OHLCV
const multiple = await yfinance.getMultipleOhlcv(['AAPL', 'MSFT'], '1mo', '1d');
```

## MCP Tools

### yfinance_get_ohlcv
Fetch OHLCV data from Yahoo Finance for a single symbol.

**Input:**
- `symbol` (string, required) - Ticker symbol (e.g., "AAPL", "ES1!")
- `period` (string, optional) - Period: "1d", "5d", "1mo", "3mo", "6mo", "1y" (default: "1mo")
- `interval` (string, optional) - Interval: "1m", "5m", "15m", "30m", "60m", "1d", "1wk", "1mo" (default: "1d")

**Output:**
```json
{
  "success": true,
  "symbol": "AAPL",
  "period": "1mo",
  "interval": "1d",
  "data": [
    {
      "date": "2025-01-01",
      "open": 150.0,
      "high": 152.5,
      "low": 149.8,
      "close": 151.2,
      "volume": 45000000
    }
  ]
}
```

### yfinance_get_quote
Fetch current quote(s) from Yahoo Finance.

**Input:**
- `symbols` (string or string[], required) - Ticker symbol(s)

**Output:**
```json
{
  "success": true,
  "quotes": [
    {
      "symbol": "AAPL",
      "price": 151.2,
      "change": 1.2,
      "changePercent": 0.8,
      "volume": 45000000,
      "marketCap": "2400000000000"
    }
  ]
}
```

### yfinance_get_multiple_ohlcv
Fetch OHLCV data from Yahoo Finance for multiple symbols.

**Input:**
- `symbols` (string[], required) - Array of ticker symbols
- `period` (string, optional) - Period (default: "1mo")
- `interval` (string, optional) - Interval (default: "1d")

**Output:**
```json
{
  "success": true,
  "data": {
    "AAPL": {
      "symbol": "AAPL",
      "data": [/* bars */]
    },
    "MSFT": {
      "symbol": "MSFT",
      "data": [/* bars */]
    }
  }
}
```

## Features

- **Exponential Backoff Retry Logic**: Automatically retries failed requests with delays (1s, 2s, 4s) to handle Yahoo Finance rate limiting
- **Error Handling**: Graceful degradation with meaningful error messages when data is unavailable
- **Multiple Symbol Support**: Batch operations for fetching data on multiple tickers
- **Flexible Periods & Intervals**: Support for daily, intraday, weekly, and monthly data
- **Subprocess Isolation**: Python runs in isolated subprocess for data fetching, keeping Node.js core clean

## Implementation Details

### Python Module (src/python/yfinance_fetcher.py)
- Uses `yfinance` library to fetch historical data and current quotes
- Implements retry logic with exponential backoff (max 3 attempts)
- Handles rate limiting errors (429) gracefully
- Returns JSON-serialized results to stdout

### Node.js Wrapper (src/core/yfinance.js)
- Spawns Python subprocess with JSON input/output
- Handles subprocess lifecycle and error parsing
- Exports async functions matching MCP tool signatures
- No external dependencies beyond Node.js built-ins

### MCP Tools (src/tools/yfinance.js)
- Three tools with zod input validation
- Tools register with `registerYfinanceTools()` function
- Return results wrapped via `jsonResult()` for MCP transport

### CLI Commands (src/cli/commands/yfinance.js)
- Two subcommands under `yfinance` group: `ohlcv` and `quote`
- Flags: `--period`, `--interval`
- Proper error messages and exit codes

## Rate Limiting Handling

Yahoo Finance actively rate-limits requests. The integration includes:

1. **Exponential Backoff**: Requests retry with delays of 1s, 2s, 4s
2. **Graceful Failures**: Returns proper error messages when all retries fail
3. **Empty Result Handling**: Detects and retries on empty responses

For batch operations or high-frequency requests, consider:
- Spacing requests out over time
- Using longer periods (daily data instead of hourly) to reduce API load
- Caching results locally when feasible

## Testing

### Unit Tests
```bash
npm run test:unit
```

### CLI Testing
```bash
# Test ohlcv command
node src/cli/index.js yfinance ohlcv AAPL

# Test quote command
node src/cli/index.js yfinance quote AAPL MSFT

# Test with options
node src/cli/index.js yfinance ohlcv AAPL --period 3mo --interval 1h
```

### Direct Python Testing
```bash
python3 src/python/yfinance_fetcher.py ohlcv AAPL 1mo 1d
python3 src/python/yfinance_fetcher.py quote AAPL MSFT
```

## Files

- `src/python/yfinance_fetcher.py` - Python data fetching module
- `src/core/yfinance.js` - Node.js wrapper layer
- `src/tools/yfinance.js` - MCP tool definitions
- `src/cli/commands/yfinance.js` - CLI command registration
- `requirements.txt` - Python dependencies
- `src/server.js` - Updated to register yfinance tools
- `src/cli/index.js` - Updated to load yfinance commands

## Dependencies

Python:
- `yfinance==0.2.48`
- `pandas==2.2.3`
- `numpy==1.26.4`
- `python-dateutil==2.8.2`

## Future Enhancements

- Add request queuing for batch operations
- Implement local caching to reduce API requests
- Add support for additional data sources
- Add performance metrics and monitoring
- Support for options data and other asset classes
