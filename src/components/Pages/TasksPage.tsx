import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Trophy } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { getChainsByType } from '../../config/chains';
import { NETWORK_TASKS } from '../../config/tasks';
import { NetworkTabs } from '../Layout/NetworkTabsSimple';

interface TasksPageProps {
  networkType: 'mainnet' | 'testnet';
  language: 'en' | 'tr';
  selectedNetwork?: string;
  onPageChange?: (page: string, params?: string) => void;
}

export function TasksPage({ networkType, language, selectedNetwork, onPageChange }: TasksPageProps) {
  const { t } = useTranslation(language);

  const availableNetworks = useMemo(
    () => getChainsByType(networkType),
    [networkType]
  );

  const [activeNetwork, setActiveNetwork] = useState<string>(() => {
    const fallback = availableNetworks[0]?.slug ?? 'giwa';
    if (selectedNetwork && availableNetworks.some(chain => chain.slug === selectedNetwork)) {
      return selectedNetwork;
    }
    return fallback;
  });

  useEffect(() => {
    if (selectedNetwork && availableNetworks.some(chain => chain.slug === selectedNetwork)) {
      setActiveNetwork(selectedNetwork);
    } else if (!availableNetworks.some(chain => chain.slug === activeNetwork)) {
      setActiveNetwork(availableNetworks[0]?.slug ?? 'giwa');
    }
  }, [selectedNetwork, availableNetworks, activeNetwork]);

  const tasks = NETWORK_TASKS[activeNetwork] ?? [];

  const handleTaskClick = (url: string) => {
    if (!url) return;

    const isExternal = url.startsWith('http');
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!onPageChange) return;

    const [path, queryString] = url.split('?');
    const page = path.replace(/^\//, '') || 'home';
    const params = queryString || undefined;
    onPageChange(page, params);
  };

  const getCtaKey = (taskId: string) => {
    switch (taskId) {
      case 'giwa-faucet':
        return 'task_faucet_giwa_button';
      case 'giwa-mint-nft':
        return 'task_mint_nft_giwa_button';
      default:
        return 'open_task';
    }
  };

  const heroIcon = networkType === 'testnet' ? <Trophy className="w-8 h-8 text-sky-500" /> : <Trophy className="w-8 h-8 text-blue-500" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-inner">
            {heroIcon}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('airdrop_tasks')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('complete_tasks_description')}</p>
        </div>

        <div className="mb-8">
          <NetworkTabs
            activeNetwork={activeNetwork}
            onNetworkChange={setActiveNetwork}
            networkType={networkType}
          />
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-10 text-center">
            <p className="text-gray-600 text-lg">{t('tasks_empty_state')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const isExternal = task.url.startsWith('http');
              const Icon = isExternal ? ExternalLink : ArrowRight;
              const ctaKey = getCtaKey(task.id);

              return (
                <div
                  key={task.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-6 shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/80 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                        {t(task.category) || task.category}
                      </span>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {t(task.title) || task.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t(task.description) || task.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTaskClick(task.url)}
                      className="relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                      <span>{t(ctaKey)}</span>
                      <Icon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}