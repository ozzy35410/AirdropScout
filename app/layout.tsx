import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airdrop Scout — NFTs",
  description: "Discover NFT collections across mainnet and testnet networks and track what you've already minted.",
  metadataBase: new URL("https://airdrop.scout3.xyz")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 text-center text-sm text-white">
          ⚡ Only gas fees required — no token approvals needed
        </div>
        <Header />
        <main className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
