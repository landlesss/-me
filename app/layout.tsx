import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio — Frontend Developer",
  description: "Frontend developer specialising in real-time interfaces, LLM integrations and WebSocket architectures.",
  openGraph: {
    title: "Portfolio — Frontend Developer",
    description: "LLM Chat streaming · Real-time WebSocket Dashboard · Production cases",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
