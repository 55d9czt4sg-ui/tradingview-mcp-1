#!/usr/bin/env python3
"""
yfinance data fetcher for TradingView MCP.
Provides functions to fetch historical OHLCV data for backtesting and analysis.
"""

import json
import sys
import time
import yfinance as yf
from datetime import datetime, timedelta


def fetch_ohlcv(symbol, period="1mo", interval="1d"):
    """
    Fetch OHLCV data from Yahoo Finance.
    
    Args:
        symbol: Ticker symbol (e.g., "AAPL", "BTC-USD")
        period: Period of data ("1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max")
        interval: Data interval ("1m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo")
    
    Returns:
        Dict with OHLCV data and metadata
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                return {
                    "success": False,
                    "error": f"No data found for symbol {symbol}",
                    "symbol": symbol
                }
            
            # Convert to list of dicts for JSON serialization
            data = []
            for date, row in hist.iterrows():
                data.append({
                    "date": date.isoformat(),
                    "open": float(row['Open']) if not row['Open'] != row['Open'] else None,
                    "high": float(row['High']) if not row['High'] != row['High'] else None,
                    "low": float(row['Low']) if not row['Low'] != row['Low'] else None,
                    "close": float(row['Close']) if not row['Close'] != row['Close'] else None,
                    "volume": int(row['Volume']) if not row['Volume'] != row['Volume'] else None,
                })
            
            return {
                "success": True,
                "symbol": symbol,
                "period": period,
                "interval": interval,
                "count": len(data),
                "data": data
            }
        
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            return {
                "success": False,
                "error": str(e),
                "symbol": symbol
            }


def fetch_quote(symbol):
    """
    Fetch current quote for a symbol.
    
    Args:
        symbol: Ticker symbol
    
    Returns:
        Dict with current price and metadata
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            return {
                "success": True,
                "symbol": symbol,
                "price": info.get('currentPrice', info.get('regularMarketPrice')),
                "name": info.get('longName', info.get('shortName')),
                "currency": info.get('currency'),
                "market_cap": info.get('marketCap'),
                "pe_ratio": info.get('trailingPE'),
                "dividend_yield": info.get('dividendYield'),
                "timestamp": datetime.now().isoformat()
            }
        
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            return {
                "success": False,
                "error": str(e),
                "symbol": symbol
            }


def main():
    """CLI entry point for direct execution."""
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Usage: python yfinance_fetcher.py <command> [args...]",
            "commands": ["ohlcv <symbol> [period] [interval]", "quote <symbol>"]
        }))
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "ohlcv":
        symbol = sys.argv[2] if len(sys.argv) > 2 else "AAPL"
        period = sys.argv[3] if len(sys.argv) > 3 else "1mo"
        interval = sys.argv[4] if len(sys.argv) > 4 else "1d"
        result = fetch_ohlcv(symbol, period, interval)
    
    elif command == "quote":
        symbol = sys.argv[2] if len(sys.argv) > 2 else "AAPL"
        result = fetch_quote(symbol)
    
    else:
        result = {"error": f"Unknown command: {command}"}
    
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
