import { useState, useEffect } from 'react';
import { CheckCircle, Circle, ExternalLink, Code, ChevronDown, ChevronRight } from 'lucide-react';
import { PROGRAMS, Program, ProgramTask } from '../config/programs';
import { isSameUTCDate } from '../lib/daily';
import { useTranslation } from '../lib/i18n';
import { useAddressTracking } from '../hooks/useAddressTracking';

interface ProgramsSectionProps {
  language: 'en' | 'tr';
  networkType: 'mainnet' | 'testnet';
}

interface TaskProgress {
  completed: boolean;
  timestamp: number;
}

function getStorageKey(address: string, programSlug: string, taskId: string): string {
  const addr = address || 'anon';
  return `progress__${addr}__${programSlug}__${taskId}`;
}

function loadTaskProgress(address: string, programSlug: string, taskId: string, kind: string): boolean {
  const key = getStorageKey(address, programSlug, taskId);
  const raw = localStorage.getItem(key);
  if (!raw) return false;

  try {
    const data: TaskProgress = JSON.parse(raw);
    if (!data.completed) return false;

    // For daily tasks, check if it's the same UTC day
    if (kind === 'daily') {
      const now = Date.now();
      if (!isSameUTCDate(data.timestamp, now)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

function saveTaskProgress(address: string, programSlug: string, taskId: string, completed: boolean): void {
  const key = getStorageKey(address, programSlug, taskId);
  const data: TaskProgress = {
    completed,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(data));
}

function ProgramCard({ program, language, trackingAddress }: { program: Program; language: 'en' | 'tr'; trackingAddress: string }) {
  const { t } = useTranslation(language);
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});

  // Load initial task states
  useEffect(() => {
    const states: Record<string, boolean> = {};
    program.tasks.forEach((task: ProgramTask) => {
      states[task.id] = loadTaskProgress(trackingAddress, program.slug, task.id, task.kind);
    });
    setTaskStates(states);
  }, [program, trackingAddress]);

  const handleToggleTask = (task: ProgramTask) => {
    const currentState = taskStates[task.id] || false;
    const newState = !currentState;

    saveTaskProgress(trackingAddress, program.slug, task.id, newState);
    setTaskStates(prev => ({ ...prev, [task.id]: newState }));
  };

  const handleOpenProgram = () => {
    window.open(program.url, '_blank', 'noopener,noreferrer');
  };

  const programName = language === 'tr' ? program.nameTR : program.nameEN;
  const completedCount = Object.values(taskStates).filter(Boolean).length;
  const totalCount = program.tasks.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{programName}</h3>
            {program.code && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                <Code className="w-3 h-3" />
                {t('invite_code')}: {program.code}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{t('completed')}:</span>
            <span className="text-gray-900 font-semibold">{completedCount}/{totalCount}</span>
          </div>
        </div>

        {/* Open button */}
        <div className="ml-4">
          <button
            onClick={handleOpenProgram}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span>{t('open')}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {program.tasks.map((task: ProgramTask) => {
          const isCompleted = taskStates[task.id] || false;
          const taskTitle = language === 'tr' ? task.titleTR : task.titleEN;
          const taskNotes = language === 'tr' ? task.notesTR : task.notesEN;

          return (
            <div
              key={task.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}
            >
              <button
                onClick={() => handleToggleTask(task)}
                className="mt-0.5 flex-shrink-0"
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                    {taskTitle}
                  </span>
                  {task.kind === 'daily' && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                      {t('daily_task')}
                    </span>
                  )}
                </div>
                {taskNotes && (
                  <p className="text-xs text-gray-600">{taskNotes}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProgramsSection({ language, networkType }: ProgramsSectionProps) {
  const { t } = useTranslation(language);
  const { trackingAddress } = useAddressTracking();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show on testnet
  const isTestnet = networkType === 'testnet';
  if (!isTestnet) return null;

  // Filter programs for testnet
  const items = PROGRAMS.filter((p: Program) => (p.testnetOnly ? isTestnet : true) && p.visible);
  
  if (items.length === 0) return null;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 p-6 hover:from-purple-700 hover:to-blue-700 transition-all"
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? (
            <ChevronDown className="w-6 h-6 text-white" />
          ) : (
            <ChevronRight className="w-6 h-6 text-white" />
          )}
          <h2 className="text-2xl font-bold text-white">{t('programs')}</h2>
        </div>
      </button>

      {isExpanded && (
        <div className="p-6">
          {items.map((program: Program) => (
            <ProgramCard
              key={program.slug}
              program={program}
              language={language}
              trackingAddress={trackingAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
