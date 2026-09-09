/**
 * yfinance wrapper for MCP
 * Calls the Python yfinance_fetcher module and returns results
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pythonScript = path.join(__dirname, '../python/yfinance_fetcher.py');

/**
 * Execute Python yfinance fetcher and return result
 */
function executeYfinancePython(command, args = []) {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [pythonScript, command, ...args], {
      cwd: path.join(__dirname, '../../')
    });

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    py.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${e.message}\nStderr: ${stderr}`));
      }
    });
  });
}

/**
 * Fetch OHLCV data from Yahoo Finance
 * @param {string} symbol - Ticker symbol (e.g., "AAPL", "BTC-USD")
 * @param {string} period - Data period ("1mo", "3mo", "1y", "5y", etc.)
 * @param {string} interval - Data interval ("1d", "1h", "5m", etc.)
 */
export async function getOhlcv(symbol, period = '1mo', interval = '1d') {
  return executeYfinancePython('ohlcv', [symbol, period, interval]);
}

/**
 * Fetch current quote from Yahoo Finance
 * @param {string} symbol - Ticker symbol
 */
export async function getQuote(symbol) {
  return executeYfinancePython('quote', [symbol]);
}

/**
 * Fetch multiple quotes
 * @param {string[]} symbols - Array of ticker symbols
 */
export async function getQuotes(symbols) {
  const results = await Promise.all(
    symbols.map(symbol => getQuote(symbol))
  );
  return {
    success: results.every(r => r.success),
    quotes: results
  };
}

/**
 * Fetch OHLCV data for multiple symbols
 * @param {string[]} symbols - Array of ticker symbols
 * @param {string} period - Data period
 * @param {string} interval - Data interval
 */
export async function getMultipleOhlcv(symbols, period = '1mo', interval = '1d') {
  const results = await Promise.all(
    symbols.map(symbol => getOhlcv(symbol, period, interval))
  );
  return {
    success: results.every(r => r.success),
    data: results
  };
}

export default {
  getOhlcv,
  getQuote,
  getQuotes,
  getMultipleOhlcv
};
