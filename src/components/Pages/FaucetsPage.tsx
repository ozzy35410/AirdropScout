import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Droplets, ExternalLink } from 'lucide-react';
import { FAUCETS } from '../../config/tasks';
import { NETWORKS } from '../../config/networks';
import { useTranslation } from '../../lib/i18n';
import { isPharosReferralOpen, openPharosReferral } from '../../lib/referral';
import type { FaucetLink } from '../../types';

interface FaucetsPageProps {
	networkType: 'mainnet' | 'testnet';
	language: 'en' | 'tr';
	selectedNetwork?: string;
	onPageChange?: (page: string, params?: string) => void;
}

export function FaucetsPage({ networkType, language, selectedNetwork, onPageChange }: FaucetsPageProps) {
	const { t } = useTranslation(language);
	const [expandedNetworks, setExpandedNetworks] = useState<Record<string, boolean>>({});
	const [pharosUnlocked, setPharosUnlocked] = useState(isPharosReferralOpen());

	useEffect(() => {
		if (selectedNetwork) {
			setExpandedNetworks(prev => ({ ...prev, [selectedNetwork]: true }));
		}
	}, [selectedNetwork]);

	const faucetsByNetwork = useMemo(() => {
		return FAUCETS.reduce<Record<string, FaucetLink[]>>((acc, faucet) => {
			if (!acc[faucet.network]) {
				acc[faucet.network] = [];
			}
			acc[faucet.network].push(faucet);
			return acc;
		}, {});
	}, []);

	const toggleNetwork = (networkKey: string) => {
		setExpandedNetworks(prev => ({
			...prev,
			[networkKey]: !prev[networkKey]
		}));
	};

	const handleLinkClick = (faucet: FaucetLink) => {
		if (faucet.type === 'internal') {
			if (!onPageChange) return;
			const [path, query] = faucet.url.split('?');
			const page = path.replace('/', '') || 'home';
			onPageChange(page, query ?? undefined);
			return;
		}

		window.open(faucet.url, '_blank', 'noopener,noreferrer');
	};

	const handlePharosReferral = () => {
		openPharosReferral();
		setPharosUnlocked(true);
	};

	if (networkType === 'mainnet') {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
				<div className="mx-auto max-w-3xl px-4 text-center">
					<h1 className="text-4xl font-bold text-gray-900">{t('testnet_faucets')}</h1>
					<p className="mt-4 text-lg text-gray-600">{t('faucets_only_testnet')}</p>
				</div>
			</div>
		);
	}

	const orderedNetworkKeys = ['giwa', 'pharos', ...Object.keys(faucetsByNetwork).filter(key => !['giwa', 'pharos'].includes(key))];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900">{t('testnet_faucets')}</h1>
					<p className="mt-3 text-lg text-gray-600">{t('get_free_tokens')}</p>
				</div>

				<div className="mt-12 space-y-10">
					{orderedNetworkKeys.map((networkKey) => {
						const network = NETWORKS[networkKey];
						const faucets = faucetsByNetwork[networkKey];
						if (!network || !faucets) return null;

						const isExpanded = expandedNetworks[networkKey] ?? networkKey === 'giwa';
						const faucetsToRender = networkKey === 'pharos' && !pharosUnlocked ? [] : faucets;

						const headerGradient = networkKey === 'giwa'
							? 'from-sky-500 to-cyan-500'
							: 'from-indigo-500 to-blue-500';

						return (
							<div
								key={networkKey}
								className="overflow-hidden rounded-3xl border border-white/30 bg-white/70 shadow-xl backdrop-blur"
							>
								<button
									type="button"
									onClick={() => toggleNetwork(networkKey)}
									className={`flex w-full items-center justify-between px-6 py-5 text-left text-white transition-colors duration-200 bg-gradient-to-r ${headerGradient}`}
								>
									<div className="flex items-center gap-3">
										{isExpanded ? <ChevronDown className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
										<span className="text-2xl font-semibold">{network.displayName}</span>
									</div>
								</button>

								{isExpanded && (
									<div className="space-y-8 px-6 py-8">
										{networkKey === 'pharos' && !pharosUnlocked && (
											<div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-800">
												<p>{t('pharos_unlock_hint')}</p>
												<button
													type="button"
													onClick={handlePharosReferral}
													className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
												>
													{t('faucet_open')}
													<ExternalLink className="h-4 w-4" />
												</button>
											</div>
										)}

															<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
																						{faucetsToRender.map((faucet) => {
																							const buttonLabelKey = faucet.id === 'giwa-official'
																								? 'task_faucet_giwa_button'
																								: 'faucet_open';

																							return (
																								<div
														key={faucet.id}
														className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-6 shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
													>
														<div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
														<div className="relative flex h-full flex-col justify-between space-y-5">
															<div className="flex items-center gap-3">
																<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-500">
																	<Droplets className="h-6 w-6" />
																</div>
																<div>
																	<h3 className="text-lg font-semibold text-gray-900">
																		{t(faucet.title) || faucet.title}
																	</h3>
																	<p className="mt-1 text-sm text-gray-600">
																		{t(faucet.description) || faucet.description}
																	</p>
																</div>
															</div>

															<button
																type="button"
																onClick={() => handleLinkClick(faucet)}
																className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
															>
																<span>{t(buttonLabelKey)}</span>
																<ExternalLink className="h-4 w-4" />
															</button>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}