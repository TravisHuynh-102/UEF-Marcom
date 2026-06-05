'use client';

import { Sparkles, AlertTriangle, Users, FileCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockInsights } from '@/lib/mock-data';

const briefingCards = [
  {
    question: 'What should leadership focus on today?',
    icon: AlertTriangle,
    insight: mockInsights.find((i) => i.id === 'i1')!,
    accentBg: 'bg-gradient-to-br from-rose-500/20 to-orange-500/20',
    accentBorder: 'border-rose-500/20',
    iconBg: 'bg-gradient-to-br from-rose-500 to-orange-500',
    badgeClass: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20',
    badgeText: 'View Details',
  },
  {
    question: 'Who needs support?',
    icon: Users,
    insight: mockInsights.find((i) => i.id === 'i2')!,
    accentBg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
    accentBorder: 'border-amber-500/20',
    iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-500',
    badgeClass: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
    badgeText: 'Take Action',
  },
  {
    question: 'Decisions needed',
    icon: FileCheck,
    insight: mockInsights.find((i) => i.id === 'i6')!,
    accentBg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
    accentBorder: 'border-indigo-500/20',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20',
    badgeText: 'Review Now',
  },
];

export default function AIChiefOfStaff() {
  return (
    <div className="relative group">
      {/* Animated gradient border glow */}
      <div
        className={cn(
          'absolute -inset-[1px] rounded-2xl opacity-60 blur-sm transition-opacity duration-500',
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
          'animate-[gradient-rotate_6s_ease_infinite] bg-[length:300%_300%]',
          'group-hover:opacity-80'
        )}
      />

      {/* Outer breathing glow */}
      <div className="absolute -inset-2 rounded-3xl ai-breathe pointer-events-none" />

      {/* Main card */}
      <div
        className={cn(
          'relative z-10 rounded-2xl overflow-hidden',
          'bg-white/70 dark:bg-white/[0.03]',
          'backdrop-blur-xl',
          'border border-white/20 dark:border-white/10',
          'shadow-lg dark:shadow-none'
        )}
      >
        {/* Subtle inner gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {/* Pulsing dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 pulse-dot ring-2 ring-white dark:ring-[#0a0a0f]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                AI Chief of Staff
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Your daily executive briefing — Wednesday, Jun 4
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>

          {/* Insight cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {briefingCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.question}
                  className={cn(
                    'group/card relative rounded-xl p-5 transition-all duration-300 cursor-pointer',
                    'bg-white/60 dark:bg-white/[0.04]',
                    'border border-gray-100 dark:border-white/[0.06]',
                    'hover:border-gray-200 dark:hover:border-white/10',
                    'hover:shadow-md dark:hover:shadow-none',
                    'hover:scale-[1.02]'
                  )}
                >
                  {/* Accent background glow */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500',
                      card.accentBg
                    )}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg mb-4 shadow-lg',
                        card.iconBg
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Question */}
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                      {card.question}
                    </h3>

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                      {card.insight.description}
                    </p>

                    {/* Action badge */}
                    <button
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                        card.badgeClass
                      )}
                    >
                      {card.badgeText}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/card:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
