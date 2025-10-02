interface ConfigAdminPanelProps {
	language: 'en' | 'tr';
}

const COPY: Record<'en' | 'tr', { title: string; description: string }> = {
	en: {
		title: 'Admin tools are being refreshed',
		description:
			'The configuration console is temporarily unavailable while we streamline the new GIWA rollout. Please use the config files in the repository for any urgent adjustments.'
	},
	tr: {
		title: 'Yönetici araçları yenileniyor',
		description:
			'GIWA güncellemesi sırasında yapılandırma paneli geçici olarak devre dışı. Acil değişiklikler için lütfen depodaki config dosyalarını kullanın.'
	}
};

export function ConfigAdminPanel({ language }: ConfigAdminPanelProps) {
	const copy = COPY[language];

	return (
		<div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-16">
			<div className="max-w-2xl rounded-3xl border border-white/50 bg-white/80 p-10 text-center shadow-xl backdrop-blur">
				<h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
				<p className="mt-4 text-base text-gray-600">{copy.description}</p>
			</div>
		</div>
	);
}