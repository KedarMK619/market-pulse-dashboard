# Project architecture decisions

- Keep app-wide appearance preferences in a shared React context and persist them in browser storage so they apply across pages and refreshes.
- Keep watchlist state in a shared React hook and persist company selections in browser storage so additions and removals stay consistent across pages and refreshes.