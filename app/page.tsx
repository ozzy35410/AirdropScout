import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Discover Airdrop Opportunities</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Track Your Progress Across
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Multiple Blockchains
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Complete tasks on mainnet and testnet networks. No wallet connection required — 
            just track by address.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-colors">
            <Shield className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">No Approvals</h3>
            <p className="text-sm text-gray-400">
              Only gas fees required — no token approvals needed
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-colors">
            <Zap className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Track by Address</h3>
            <p className="text-sm text-gray-400">
              No wallet connection required — paste your address to track progress
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-pink-500/50 transition-colors">
            <Sparkles className="w-8 h-8 text-pink-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Chain</h3>
            <p className="text-sm text-gray-400">
              Support for Base, Sei, Giwa, and Pharos networks
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
          >
            Start Exploring Tasks
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
