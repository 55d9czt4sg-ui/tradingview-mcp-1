/**
 * CLI command group: tv yfinance
 * Data fetching tools (OHLCV, quotes) from Yahoo Finance
 */

import { register } from '../router.js';
import * as yfinance from '../../core/yfinance.js';

register('yfinance', {
  description: 'Yahoo Finance data tools (OHLCV, quotes)',
  subcommands: new Map([
    ['ohlcv', {
      description: 'Fetch OHLCV data from Yahoo Finance',
      options: {
        period: { type: 'string', short: 'p', description: 'Period (default: 1mo)' },
        interval: { type: 'string', short: 'i', description: 'Interval (default: 1d)' },
      },
      handler: (opts, positionals) => {
        const symbol = positionals[0];
        if (!symbol) throw new Error('Symbol required');
        return yfinance.getOhlcv(
          symbol,
          opts.period || '1mo',
          opts.interval || '1d'
        );
      },
    }],
    ['quote', {
      description: 'Fetch current quote(s) from Yahoo Finance',
      handler: (opts, positionals) => {
        if (positionals.length === 1) {
          return yfinance.getQuote(positionals[0]);
        } else if (positionals.length > 1) {
          return yfinance.getQuotes(positionals);
        } else {
          throw new Error('Symbol required');
        }
      },
    }],
  ]),
});
