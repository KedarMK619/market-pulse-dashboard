# MarketPulse

MarketPulse is an educational market dashboard for exploring company data, market headlines, product demand trends, and AI-generated market summaries in one place. It pairs an interactive React interface with chart visualizations and optional third-party data integrations.

> **Learning project only.** MarketPulse is not financial, investment, or trading advice. Some displayed figures are sample data, and third-party data may be delayed or inaccurate. Do not use this project to make financial decisions.

## Preview

Open the live preview:

**[Preview MarketPulse](https://preview--signal-scout-market-intel.lovable.app/dashboard)**

To run the project on your computer instead, see [Getting started](#getting-started).

## What you can explore

- **Dashboard** — Browse market summary cards, index and sector visualizations, and market highlights.
- **Company Analyzer** — Explore supported companies, price history, company information, financial statements, and related news.
- **Product Trends** — Search and filter sample product-demand data, and compare demand scores and changes.
- **Market Feed** — Browse market headlines and sentiment labels.
- **PulseAI Insights** — Ask questions about the sample market context. The app uses Gemini when configured and otherwise falls back to its local educational response engine.
- **Watchlist** — Add and remove companies and toggle their alert state. Watchlist selections are saved in browser local storage.
- **Settings** — Adjust appearance preferences and check the status of configured market-data APIs.
- **Supporting pages** — Review the project disclaimer, privacy policy, and terms of service.

Appearance preferences (dark mode, compact view, and animations) are shared across the app and saved in local storage. The sign-in page is currently a placeholder; authentication is not implemented.

## Technology

- [React](https://react.dev/) 18 and [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for local development and production builds
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/) for page navigation
- [Recharts](https://recharts.org/) for data visualizations
- [TanStack Query](https://tanstack.com/query/latest) and custom hooks for data flows
- [Vitest](https://vitest.dev/) and Testing Library for tests

## Getting started

### Requirements

- Node.js 18 or newer
- npm (included with Node.js)

### Install and run

```bash
git clone https://github.com/KedarMK619/market-pulse-dashboard.git
cd market-pulse-dashboard
npm install
npm run dev
```

Vite starts the development server at **http://localhost:8080/**. Open that URL in a browser. The server supports hot reloading as you edit the source.

### Optional API configuration

The app can use external providers for stock quotes, financials, news, and AI responses. Without credentials, or when a provider is unavailable, the application uses its built-in sample data or local AI response engine where supported.

Create a `.env.local` file in the project root and add only the keys you intend to use:

```dotenv
VITE_ALPHA_VANTAGE_KEY=your_alpha_vantage_key
VITE_FMP_KEY=your_financial_modeling_prep_key
VITE_NEWS_API_KEY=your_newsapi_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

`VITE_GEMINI_MODEL` can optionally be set to choose a Gemini model; the app defaults to `gemini-2.0-flash`.

Restart the development server after changing environment variables. API access may depend on provider quotas, account plans, and browser/CORS restrictions. Credentials with a `VITE_` prefix are included in client-side application code and can be seen by users in their browser. Use restricted keys for local experimentation; for a production deployment, route sensitive API calls through a server-side proxy rather than exposing privileged credentials.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run build:dev` | Create a build using Vite's development mode |
| `npm run preview` | Serve the built app locally for a production-build check |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |

For example, to build and preview the production output locally:

```bash
npm run build
npm run preview
```

## Data and integrations

The application combines local sample data with optional API integrations:

| Provider | Used for | Environment variable |
| --- | --- | --- |
| Alpha Vantage | Stock quotes and historical/company data | `VITE_ALPHA_VANTAGE_KEY` |
| Financial Modeling Prep | Company financial statements and profiles | `VITE_FMP_KEY` |
| NewsAPI | Market and company headlines | `VITE_NEWS_API_KEY` |
| Google Gemini | Optional AI-generated market responses and summaries | `VITE_GEMINI_API_KEY` |

API availability and data coverage can vary. The UI can display sample information when live data is unavailable, so always verify a value with its original provider before relying on it. News sentiment labels are generated by simple keyword matching and should not be treated as an assessment of an article's accuracy or investment significance.

## Project layout

```text
src/
  components/   Shared layout, cards, charts, and UI components
  contexts/     App-wide appearance preferences
  hooks/        Data and persistent watchlist hooks
  lib/
    api/        Third-party API clients and AI helpers
    mock/       Educational sample market data
  pages/        Dashboard, company, feed, settings, and other routes
  test/         Unit and component tests
```

## Contributing

Issues and pull requests are welcome. For a useful contribution:

1. Create a branch for your change.
2. Keep changes focused and follow the existing TypeScript and component patterns.
3. Run the relevant checks before opening a pull request:

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. Describe what changed and how you verified it.

## Disclaimer

MarketPulse is a learning and demonstration project. Market data may be simulated, delayed, incomplete, or incorrect; AI-generated content may also be inaccurate. Nothing shown in the application is investment, trading, legal, or financial advice. Consult qualified professionals and authoritative sources before making financial decisions.
