import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CampaignWizardProvider } from '@/context/CampaignWizardContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Camparakeet – AI Campaign Builder for SMBs',
  description: 'AI-powered campaign creation for busy SMBs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CampaignWizardProvider>
          {children}
        </CampaignWizardProvider>
      </body>
    </html>
  );
}

