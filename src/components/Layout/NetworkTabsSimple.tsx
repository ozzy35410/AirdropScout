import React from 'react';
import { getChainsByType } from '../../config/chains';

interface NetworkTabsProps {
	activeNetwork: string;
	onNetworkChange: (network: string) => void;
	networkType: 'mainnet' | 'testnet';
}

export const NetworkTabs: React.FC<NetworkTabsProps> = ({
	activeNetwork,
	onNetworkChange,
	networkType
}) => {
	const chainsToShow = getChainsByType(networkType);

	const activeColor = networkType === 'mainnet' ? 'bg-blue-600' : 'bg-sky-500';
	const inactiveColor = 'bg-gray-100 text-gray-700 hover:bg-gray-200';

	return (
		<div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-lg">
			<div className="flex flex-wrap gap-2">
				{chainsToShow.map((chain) => {
					const isActive = chain.slug === activeNetwork;
					return (
						<button
							key={chain.slug}
							type="button"
							onClick={() => onNetworkChange(chain.slug)}
							className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${isActive ? `${activeColor} text-white` : inactiveColor}`}
						>
							<span
								className="h-2 w-2 rounded-full"
								style={{ backgroundColor: chain.color }}
							/>
							{chain.displayName}
						</button>
					);
				})}
			</div>

			<div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm text-gray-600">
				<span className="font-medium">
					{networkType === 'mainnet' ? 'Mainnet' : 'Testnet'} •
					{' '}
					{chainsToShow.find(chain => chain.slug === activeNetwork)?.displayName ?? activeNetwork}
				</span>
				<span className="text-xs uppercase tracking-wide text-gray-400">{networkType}</span>
			</div>
		</div>
	);
};