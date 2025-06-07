import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Props = {
  hasCompletedQuestionnaire: boolean;
  prefillData?: Record<string, unknown>;
};

type TodoItem =
  | {
      key: 'questionnaire' | 'upload' | 'ai';
      label: (complete?: boolean) => string;
      icon: string;
      link: string;
    }
  | {
      key: 'articles';
      label: () => string;
      icon: string;
    };

const todoItems: readonly TodoItem[] = [
  {
    key: 'questionnaire',
    label: (complete?: boolean) =>
      complete
        ? 'Update Diagnostic Health Questionnaire'
        : 'Complete Diagnostic Health Questionnaire',
    icon: '/questionnaire.png',
    link: '/questionnaire',
  },
  {
    key: 'upload',
    label: () => 'Upload your bloodwork and other health-related data',
    icon: '/upload.png',
    link: '/profile?tab=uploads',
  },
  {
    key: 'ai',
    label: () => 'Meet Holly, your Virtual AI Naturopath',
    icon: '/ai-square.png',
    link: '/search',
  },
  {
    key: 'articles',
    label: () => 'Browse our featured articles',
    icon: '/articles.png',
  },
];

const Todo: React.FC<Props> = ({ hasCompletedQuestionnaire, prefillData }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your To-Do List</h2>
      <ul className="space-y-4">
        {todoItems.map((item) => {
          const label =
            item.key === 'questionnaire'
              ? item.label(hasCompletedQuestionnaire)
              : item.label();

          const isQuestionnaire = item.key === 'questionnaire';
          const linkProps =
            'link' in item
              ? isQuestionnaire && hasCompletedQuestionnaire && prefillData
                ? { to: item.link, state: { prefill: prefillData } }
                : { to: item.link }
              : undefined;

          return (
            <li
              key={item.key}
              className="flex items-start justify-between bg-[#f9f7f6] rounded-lg p-4 border border-gray-200 hover:shadow transition"
            >
              <div className="flex items-start gap-4">
                <img src={item.icon} alt="icon" className="w-8 h-8 mt-1" />
                <span className="text-gray-700 text-base">{label}</span>
              </div>

              {item.key === 'articles' ? (
                <button
                  onClick={() => {
                    const target = document.getElementById('featured-articles');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-1 bg-purple-700 text-white hover:bg-purple-800 px-3 py-1.5 rounded-full shadow-sm transition"
                >
                  Go <ArrowRight size={16} />
                </button>
              ) : (
                linkProps && (
                  <Link {...linkProps}>
                    <button className="inline-flex items-center gap-1 bg-purple-700 text-white hover:bg-purple-800 px-3 py-1.5 rounded-full shadow-sm transition">
                      Go <ArrowRight size={16} />
                    </button>
                  </Link>
                )
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todo;