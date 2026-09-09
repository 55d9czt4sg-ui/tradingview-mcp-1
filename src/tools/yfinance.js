/**
 * MCP tool for yfinance data fetching
 * Provides OHLCV and quote tools for Yahoo Finance data
 */

import { z } from 'zod';
import yfinance from '../core/yfinance.js';
import { jsonResult } from './_format.js';

const ohlcvSchema = z.object({
  symbol: z.string().describe('Stock ticker symbol (e.g., "AAPL", "BTC-USD", "ES=F")'),
  period: z.enum(['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'])
    .default('1mo')
    .describe('Data period to fetch'),
  interval: z.enum(['1m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'])
    .default('1d')
    .describe('Data interval/resolution')
});

const quoteSchema = z.object({
  symbol: z.string().describe('Stock ticker symbol'),
  symbols: z.array(z.string()).optional().describe('Alternative: array of symbols to fetch multiple quotes')
});

const multiOhlcvSchema = z.object({
  symbols: z.array(z.string()).min(1).describe('Array of ticker symbols'),
  period: z.enum(['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'])
    .default('1mo')
    .describe('Data period to fetch'),
  interval: z.enum(['1m', '5m', '15m', '30m', '60m', '1h', '1d', '5d', '1wk', '1mo', '3mo'])
    .default('1d')
    .describe('Data interval/resolution')
});

/**
 * Get OHLCV data from Yahoo Finance
 */
async function handleGetOhlcv(input) {
  try {
    const { symbol, period, interval } = ohlcvSchema.parse(input);
    const result = await yfinance.getOhlcv(symbol, period, interval);
    
    if (!result.success) {
      return jsonResult({
        success: false,
        error: result.error || 'Failed to fetch OHLCV data',
        symbol
      });
    }

    return jsonResult(result);
  } catch (error) {
    return jsonResult({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get current quote from Yahoo Finance
 */
async function handleGetQuote(input) {
  try {
    const parsed = quoteSchema.parse(input);
    
    if (parsed.symbols && parsed.symbols.length > 0) {
      const result = await yfinance.getQuotes(parsed.symbols);
      return jsonResult(result);
    }

    const result = await yfinance.getQuote(parsed.symbol);
    
    if (!result.success) {
      return jsonResult({
        success: false,
        error: result.error || 'Failed to fetch quote',
        symbol: parsed.symbol
      }, true);
    }

    return jsonResult(result);
  } catch (error) {
    return jsonResult({
      success: false,
      error: error.message
    }, true);
  }
}

/**
 * Get OHLCV data for multiple symbols
 */
async function handleGetMultipleOhlcv(input) {
  try {
    const { symbols, period, interval } = multiOhlcvSchema.parse(input);
    const result = await yfinance.getMultipleOhlcv(symbols, period, interval);
    return jsonResult(result);
  } catch (error) {
    return jsonResult({
      success: false,
      error: error.message
    });
  }
}

export function registerYfinanceTools(server) {
  server.tool(
    'yfinance_get_ohlcv',
    'Fetch OHLCV (Open, High, Low, Close, Volume) data from Yahoo Finance for backtesting, analysis, or comparison with TradingView data.',
    ohlcvSchema,
    handleGetOhlcv
  );

  server.tool(
    'yfinance_get_quote',
    'Fetch current stock quote(s) from Yahoo Finance with price, market cap, P/E ratio, and other metrics.',
    quoteSchema,
    handleGetQuote
  );

  server.tool(
    'yfinance_get_multiple_ohlcv',
    'Fetch OHLCV data for multiple symbols at once for batch analysis.',
    multiOhlcvSchema,
    handleGetMultipleOhlcv
  );
}
