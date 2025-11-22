# Camparakeet – AI Campaign Builder for SMBs

A self-serve campaign creation tool for small and medium businesses with AI-assisted ad copy suggestions.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
camparakeet/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page (/)
│   ├── globals.css        # Global styles with Tailwind
│   ├── wizard/
│   │   └── page.tsx       # Campaign wizard (/wizard)
│   └── dashboard/
│       └── page.tsx       # Dashboard (/dashboard)
├── components/            # Reusable React components
│   ├── StepLayout.tsx     # Wizard step wrapper with progress
│   ├── AudienceSummaryCard.tsx
│   ├── BudgetProjectionCard.tsx
│   ├── AdPreviewCard.tsx
│   └── MetricCard.tsx
├── context/               # React context providers
│   └── CampaignWizardContext.tsx  # Wizard state management
├── lib/                   # Utility functions
│   ├── aiMock.ts          # AI function stubs (replace with real APIs)
│   └── campaignStore.ts   # In-memory campaign storage
├── types/                 # TypeScript definitions
│   └── index.ts
└── package.json
```

## Main Entry Points

- **Landing Page**: `app/page.tsx` - Entry point at `/`
- **Wizard**: `app/wizard/page.tsx` - Campaign creation flow at `/wizard`
- **Dashboard**: `app/dashboard/page.tsx` - Campaign management at `/dashboard`
- **Root Layout**: `app/layout.tsx` - Wraps all pages with providers and global styles

## Features

### Landing Page (`/`)
- Hero section with product name and tagline
- Three benefit cards
- "Get Started" CTA button

### Campaign Wizard (`/wizard`)
Five-step guided process:
1. **Goal & Business Info** - Campaign name, business details, goal selection
2. **Audience** - Location, radius, audience presets with live summary
3. **Budget & Schedule** - Budget type, amount, dates with projections
4. **Creative & AI Copy** - Offer description, AI-generated ad copy, image upload, live preview
5. **Review & Confirm** - Complete summary before launch

### Dashboard (`/dashboard`)
- Campaign list sidebar
- Selected campaign details
- Performance metrics (Impressions, Clicks, CTR, Conversions, Spend)
- Performance over time chart
- AI-generated insights

## AI Integration

All AI functionality is stubbed in `lib/aiMock.ts`:

- `generateAdCopy()` - Generates ad copy suggestions (currently returns templated data)
- `generateInsights()` - Generates performance insights (currently uses simple rules)

### How to Integrate Real AI

1. Install your AI SDK (e.g., `npm install openai`)
2. Add your API key to environment variables (`.env.local`)
3. Replace functions in `lib/aiMock.ts` with real API calls
4. See comments in `lib/aiMock.ts` for integration examples

Example OpenAI integration:
```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAdCopy(input: GenerateAdCopyInput): Promise<AdCopySuggestion[]> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an expert copywriter..." },
      { role: "user", content: `Generate ad copy for ${input.businessName}...` }
    ],
  });
  // Parse and return suggestions
}
```

## Data Storage

Currently uses in-memory storage (`lib/campaignStore.ts`). Campaigns are lost on page refresh. To persist data:

1. Add a database (PostgreSQL, MongoDB, etc.)
2. Replace `lib/campaignStore.ts` functions with API calls
3. Or use browser localStorage for client-side persistence

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management
- **React Context** - Wizard state sharing

## Development

- Run `npm run dev` for development server
- Run `npm run build` to create production build
- Run `npm run lint` to check for linting errors

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. **Push to GitHub**: Commit and push your code to a GitHub repository
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com), click "Import Project", and select your repository
3. **Deploy**: Vercel will auto-detect Next.js and deploy automatically

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick CLI Deploy:**
```bash
npm install -g vercel
vercel
```

Your app will be live at `https://your-project-name.vercel.app`

## Notes

- No authentication required (single user session)
- All data is stored in-memory (resets on refresh/deployment)
- AI functions are mocked and return templated data
- Fully responsive design for mobile and desktop

