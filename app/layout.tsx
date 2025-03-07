import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExcuseMaster - Générateur d'excuses pour développeurs",
  description:
    "Générez des excuses créatives pour justifier vos retards de développement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
