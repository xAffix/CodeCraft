'use client';

import React, { useState, useEffect } from 'react';

interface Step {
  target: string;
  title: string;
  description: string;
  icon: string;
  position: 'bottom' | 'top' | 'left' | 'right';
}

const steps: Step[] = [
  {
    target: 'sidebar-nav',
    title: 'Welcome to CodeCraft',
    description: 'This is your command center. Navigate between Mission Control, Simulations, Code Workspace, and Team AI from the sidebar.',
    icon: 'explore',
    position: 'right',
  },
  {
    target: 'tab-mission-control',
    title: 'Mission Control',
    description: 'Your dashboard shows KPI metrics, your Trust Score gauge, deployment pipeline status, and your team roster.',
    icon: 'dashboard',
    position: 'bottom',
  },
  {
    target: 'tab-simulations',
    title: 'Active Simulations',
    description: 'Simulations are real-world engineering scenarios. Each sprint has tickets, deadlines, and AI managers who guide you.',
    icon: 'simulation',
    position: 'bottom',
  },
  {
    target: 'tab-workspace',
    title: 'Code Workspace',
    description: 'Use the integrated Monaco Editor + terminal to write code. Your Docker workspace auto-generates starter files per project.',
    icon: 'code',
    position: 'bottom',
  },
  {
    target: 'tab-team-ai',
    title: 'AI Team',
    description: 'Meet your team: Kira (Tech Lead), Maya (PM), and Ravi (Peer Dev). Chat with them, ask for code reviews, or plan sprints.',
    icon: 'smart_toy',
    position: 'bottom',
  },
  {
    target: 'sim-slack',
    title: 'Sim-Slack Chat',
    description: 'Real-time messaging with your AI team. Message #general, #tickets, or #standup. The Chaos Engine fires production incidents you need to handle.',
    icon: 'forum',
    position: 'left',
  },
  {
    target: 'trust-score',
    title: 'Trust Score & Growth',
    description: 'Your Trust Score (0-100) reflects code quality, incident response, sprint reliability, and collaboration. Earn badges and level up from Junior to Principal Engineer!',
    icon: 'verified',
    position: 'top',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Show onboarding only on first visit
    const seen = localStorage.getItem('codecraft_onboarding_seen');
    if (!seen) {
      setDismissed(false);
    }
  }, []);

  const dismiss = (markSeen = true) => {
    setDismissed(true);
    if (markSeen) {
      localStorage.setItem('codecraft_onboarding_seen', 'true');
    }
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (dismissed) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => {}} />

      {/* Step card */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] w-[420px] max-w-[90vw]">
        <div className="glass-panel rounded-2xl border border-primary/30 shadow-xl shadow-primary/10 p-md">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-md">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-primary'
                    : i < currentStep
                      ? 'w-2 bg-primary/40'
                      : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">{step.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-label-md text-label-md text-on-surface mb-1">
                {step.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-md pt-md border-t border-white/5">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={prev}
                  className="font-label-sm text-label-sm text-outline-variant hover:text-on-surface transition-colors px-3 py-1.5"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => dismiss()}
                className="font-label-sm text-label-sm text-outline-variant hover:text-on-surface transition-colors px-3 py-1.5"
              >
                Skip all
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-xs text-label-xs text-outline-variant">
                {currentStep + 1} / {steps.length}
              </span>
              <button
                onClick={next}
                className="bg-primary/10 border border-primary/30 text-primary font-label-sm text-label-sm px-4 py-1.5 rounded-lg hover:bg-primary hover:text-on-surface transition-all flex items-center gap-1.5"
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
                <span className="material-symbols-outlined text-[14px]">
                  {currentStep < steps.length - 1 ? 'arrow_forward' : 'check'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
