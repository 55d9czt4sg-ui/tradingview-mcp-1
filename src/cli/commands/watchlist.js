import { register } from "../router.js";
import * as core from "../../core/watchlist.js";

register("watchlist", {
  description: "Watchlist tools (get, add, remove)",
  subcommands: new Map([
    [
      "get",
      {
        description: "Get watchlist symbols",
        handler: () => core.get(),
      },
    ],
    [
      "add",
      {
        description: "Add a symbol to the watchlist",
        handler: (opts, positionals) => {
          if (!positionals[0])
            throw new Error("Symbol required. Usage: tv watchlist add AAPL");
          return core.add({ symbol: positionals[0] });
        },
      },
    ],
    [
      "remove",
      {
        description: "Remove a symbol from the watchlist",
        handler: (opts, positionals) => {
          if (!positionals[0])
            throw new Error("Symbol required. Usage: tv watchlist remove AAPL");
          return core.remove({ symbol: positionals[0] });
        },
      },
    ],
  ]),
});
