import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SurveyPro - Engineering Survey Workflow Platform',
  description: 'Professional survey data management and workflow platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
