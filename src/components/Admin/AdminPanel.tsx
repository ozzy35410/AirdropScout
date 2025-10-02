import { ConfigAdminPanel } from './ConfigAdminPanel';

interface AdminPanelProps {
  language: 'en' | 'tr';
}

export function AdminPanel({ language }: AdminPanelProps) {
  return <ConfigAdminPanel language={language} />;
}
