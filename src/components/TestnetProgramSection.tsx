import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Program } from '../config/programs';
import { useTranslation } from '../lib/i18n';

interface TestnetProgramSectionProps {
  program: Program;
  language: 'en' | 'tr';
}

export function TestnetProgramSection({ program, language }: TestnetProgramSectionProps) {
  const { t } = useTranslation(language);
  const [isExpanded, setIsExpanded] = useState(false);

  const programName = language === 'tr' ? program.nameTR : program.nameEN;

  const handleOpenProgram = () => {
    window.open(program.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 p-6 hover:from-purple-700 hover:to-blue-700 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <ChevronDown className="w-6 h-6 text-white" />
            ) : (
              <ChevronRight className="w-6 h-6 text-white" />
            )}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-400"></div>
            <h2 className="text-2xl font-bold text-white">{programName}</h2>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenProgram();
            }}
            className="inline-flex items-center space-x-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <span className="text-sm">{t('open')}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </button>

      {isExpanded && (
        <div className="p-6">
          <ul className="space-y-2">
            {program.tasksText.map((task) => {
              const taskText = language === 'tr' ? task.textTR : task.textEN;
              
              return (
                <li
                  key={task.id}
                  className="flex items-center justify-between rounded-lg bg-white/40 px-4 py-3 border border-gray-200"
                >
                  <span className="text-sm text-gray-900">{taskText}</span>
                  {task.daily && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                      {t('daily_task')}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
