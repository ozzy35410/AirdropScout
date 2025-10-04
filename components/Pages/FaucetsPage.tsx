"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Lock, Unlock, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  isPharosReferralUnlocked,
  markPharosReferralOpened,
  getReferralDaysRemaining
} from "@/lib/referral";

export default function FaucetsPage() {
  const { t } = useTranslation();
  const [pharosUnlocked, setPharosUnlocked] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    setPharosUnlocked(isPharosReferralUnlocked());
    setDaysRemaining(getReferralDaysRemaining());
  }, []);

  const handleOpenPharos = () => {
    window.open(
      "https://testnet.pharosnetwork.xyz/experience?inviteCode=CktVYkx8FeejVAHr",
      "_blank",
      "noopener,noreferrer"
    );
    markPharosReferralOpened();
    setPharosUnlocked(true);
    setDaysRemaining(7);
  };

  const pharosFaucets = [
    {
      name: "Pharos Network Faucet",
      url: "https://testnet.pharosnetwork.xyz/",
      requiresUnlock: true
    },
    {
      name: "Zenith Swap Faucet",
      url: "https://testnet.zenithswap.xyz/faucet",
      requiresUnlock: true
    },
    {
      name: "BrokeX Faucet",
      url: "https://brokex.trade/faucet",
      requiresUnlock: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t("faucets")}</h1>
        <p className="text-gray-400">
          Get test tokens for testnet networks
        </p>
      </div>

      {/* Giwa Faucet */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">GIWA Sepolia</h2>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">
                GIWA Faucet
              </h3>
              <p className="text-sm text-gray-400">
                Get test tokens for GIWA Sepolia network
              </p>
            </div>
            <a
              href="https://faucet.giwa.io/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex-shrink-0"
            >
              {t("faucet_open")}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Pharos Faucets */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Pharos Testnet</h2>
        
        {/* Unlock Button */}
        {!pharosUnlocked ? (
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Unlock Pharos Faucets
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Click the button below to open Pharos with referral code. This will unlock access to all Pharos faucets for 7 days.
                </p>
                <button
                  onClick={handleOpenPharos}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
                >
                  {t("open_pharos")}
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Unlock className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <span className="text-green-400 font-medium">
                {t("faucet_unlocked")}
              </span>
              <span className="text-gray-400 text-sm ml-2">
                — {t("referral_expires").replace("{days}", daysRemaining.toString())}
              </span>
            </div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* Pharos Faucet List */}
        <div className="grid gap-4">
          {pharosFaucets.map((faucet) => (
            <div
              key={faucet.url}
              className={`bg-gray-800 border rounded-xl p-6 ${
                !pharosUnlocked
                  ? "border-gray-700 opacity-60"
                  : "border-gray-700 hover:border-gray-600"
              } transition-all`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-1">
                    {faucet.name}
                  </h3>
                  {!pharosUnlocked && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <Lock className="w-4 h-4" />
                      <span>{t("faucet_locked")}</span>
                    </div>
                  )}
                </div>
                <a
                  href={pharosUnlocked ? faucet.url : "#"}
                  target={pharosUnlocked ? "_blank" : undefined}
                  rel={pharosUnlocked ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!pharosUnlocked) {
                      e.preventDefault();
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                    pharosUnlocked
                      ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {t("faucet_open")}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
