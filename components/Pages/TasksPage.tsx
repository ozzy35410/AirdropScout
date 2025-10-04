"use client";

import { useState, useEffect } from "react";
import { ExternalLink, CheckCircle2, Circle } from "lucide-react";
import { MAINNET_CHAINS, TESTNET_CHAINS, type ChainSlug } from "@/config/chains";
import { TASK_CONFIG } from "@/config/tasks";
import { useTranslation } from "@/hooks/useTranslation";

type NetworkMode = "mainnet" | "testnet";

export default function TasksPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<NetworkMode>("testnet");
  const [selectedChain, setSelectedChain] = useState<ChainSlug>("giwa");

  // URL'den network parametresini oku
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const network = params.get("network") as ChainSlug | null;
    
    if (network) {
      if (MAINNET_CHAINS.includes(network)) {
        setMode("mainnet");
        setSelectedChain(network);
      } else if (TESTNET_CHAINS.includes(network)) {
        setMode("testnet");
        setSelectedChain(network);
      }
    }
  }, []);

  const chains = mode === "mainnet" ? MAINNET_CHAINS : TESTNET_CHAINS;
  const tasks = [...(TASK_CONFIG[selectedChain] || [])];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t("tasks")}</h1>
        <p className="text-gray-400">
          Complete tasks to increase your chances of receiving airdrops
        </p>
      </div>

      {/* Network Mode Toggle */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        <button
          onClick={() => {
            setMode("mainnet");
            setSelectedChain("base");
          }}
          className={`px-6 py-3 font-medium transition-colors relative ${
            mode === "mainnet"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          {t("mainnet")}
          {mode === "mainnet" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => {
            setMode("testnet");
            setSelectedChain("giwa");
          }}
          className={`px-6 py-3 font-medium transition-colors relative ${
            mode === "testnet"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          {t("testnet")}
          {mode === "testnet" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      {/* Chain Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {chains.map((chain) => (
          <button
            key={chain}
            onClick={() => setSelectedChain(chain)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedChain === chain
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {chain.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No tasks available for this network yet.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} chain={selectedChain} />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, chain }: { task: any; chain: ChainSlug }) {
  const { t } = useTranslation();
  const [completed, setCompleted] = useState(false);

  const handleClick = () => {
    if (task.external && task.url) {
      window.open(task.url, "_blank", "noopener,noreferrer");
    } else if (!task.external && task.url) {
      window.location.href = task.url;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
            )}
            <h3 className="text-lg font-semibold text-white">
              {t(task.titleKey)}
            </h3>
          </div>
          
          {task.group && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded mb-2">
              {task.group}
            </span>
          )}
          
          {task.defaultAddress && (
            <p className="text-sm text-gray-400 mt-2">
              Default recipient: <code className="bg-gray-900 px-2 py-1 rounded text-xs">{task.defaultAddress}</code>
            </p>
          )}
        </div>

        {(task.url || task.external) && (
          <button
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex-shrink-0"
          >
            {task.external ? (
              <>
                Open
                <ExternalLink className="w-4 h-4" />
              </>
            ) : (
              "View"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
