import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface MintedBadgeProps {
  isMinted?: boolean;
  isLoading?: boolean;
  language: 'en' | 'tr';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Record<NonNullable<MintedBadgeProps['size']>, string> = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2'
};

const ICON_SIZE: Record<NonNullable<MintedBadgeProps['size']>, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

export function MintedBadge({
  isMinted,
  isLoading = false,
  language,
  size = 'md'
}: MintedBadgeProps) {
  const { t } = useTranslation(language);
  const sizeClass = SIZE_CLASSES[size];
  const iconClass = ICON_SIZE[size];

  if (isLoading) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 font-medium text-blue-700 ${sizeClass}`}
      >
        <Clock className={iconClass} />
        <span>{language === 'tr' ? 'Kontrol ediliyor…' : 'Checking…'}</span>
      </div>
    );
  }

  if (isMinted === true) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 font-medium text-green-700 ${sizeClass}`}
      >
        <CheckCircle className={iconClass} />
        <span>{t('minted')}</span>
      </div>
    );
  }

  if (isMinted === false) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 font-medium text-gray-600 ${sizeClass}`}
      >
        <XCircle className={iconClass} />
        <span>{t('not_minted')}</span>
      </div>
    );
  }

  return null;
}