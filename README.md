# Camparakeet – AI Campaign Builder for SMBs

A beautiful, modern self-serve campaign creation tool for small and medium businesses with AI-assisted ad copy suggestions.

## ✨ Design Features

This app features a polished, modern design with:

- **Gradient backgrounds** and smooth color transitions
- **Glassmorphism effects** with backdrop blur
- **Smooth animations** and hover effects
- **Modern card designs** with soft shadows
- **Responsive layout** that looks great on all devices
- **Visual feedback** on all interactions
- **Beautiful typography** with clear hierarchy

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
│   ├── page.tsx           # Landing page (/) - Enhanced with gradients
│   ├── globals.css        # Global styles with custom scrollbar
│   ├── wizard/
│   │   └── page.tsx       # Campaign wizard (/wizard) - Beautiful multi-step form
│   └── dashboard/
│       └── page.tsx       # Dashboard (/dashboard) - Modern metrics dashboard
├── components/            # Reusable React components
│   ├── StepLayout.tsx     # Wizard layout with animated progress bar
│   ├── AudienceSummaryCard.tsx  # Styled audience summary
│   ├── BudgetProjectionCard.tsx # Budget estimates with gradients
│   ├── AdPreviewCard.tsx  # Ad preview with hover effects
│   └── MetricCard.tsx     # Dashboard metrics with gradient text
├── context/               # React context providers
│   └── CampaignWizardContext.tsx
├── lib/                   # Utility functions
│   ├── aiMock.ts          # AI function stubs
│   └── campaignStore.ts  # In-memory campaign storage
└── types/                 # TypeScript definitions
```

## Design System

### Colors

- **Primary**: Blue gradient (`#667eea` to `#764ba2`)
- **Accent**: Purple/Pink gradient (`#f093fb` to `#f5576c`)
- **Success**: Green (`#10b981`)
- **Background**: Soft gradients from slate to blue to purple

### Components

All components feature:
- Rounded corners (xl, 2xl)
- Soft shadows with hover effects
- Smooth transitions (300ms)
- Gradient accents
- Backdrop blur effects

### Animations

- Fade in/out
- Slide up/down
- Scale transforms
- Hover scale effects
- Progress bar animations

## Features

### Landing Page (`/`)
- Animated gradient background
- Hero section with gradient text
- Three benefit cards with hover effects
- Smooth animations

### Campaign Wizard (`/wizard`)
Five-step guided process with:
- Animated progress indicator
- Beautiful form inputs with focus states
- Live preview components
- Step-by-step visual feedback

### Dashboard (`/dashboard`)
- Campaign list sidebar
- Metric cards with gradient text
- Performance charts with animated bars
- AI insights with styled cards

## AI Integration

All AI functionality is stubbed in `lib/aiMock.ts`. Replace with real API calls when ready.

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **React Hooks** - State management
- **React Context** - Wizard state sharing

## Notes

- No authentication required (single user session)
- All data is stored in-memory (resets on refresh/deployment)
- AI functions are mocked and return templated data
- Fully responsive design for mobile and desktop
- Modern, polished UI with smooth animations

