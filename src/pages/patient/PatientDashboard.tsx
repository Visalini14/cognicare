import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAdaptiveState } from '../../services/adaptiveDifficulty';
import { Card, Button, DifficultyBadge } from '../../components/common/UIComponents';
import { Brain, Sparkles, HelpCircle, Users, ArrowRight, Heart } from 'lucide-react';
import type { GameType } from '../../types';
import { MemoryMatchGame } from '../../games/memory-match/MemoryMatchGame';
import { PatternRecallGame } from '../../games/pattern-recall/PatternRecallGame';
import { RecognitionQuizGame } from '../../games/recognition/RecognitionQuizGame';
import { FamilyRecognitionGame } from '../../games/family-recognition/FamilyRecognitionGame';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { ui } = useLanguage();
  const userId = user?.uid || 'patient-1';
  const userName = user?.name || 'Aarav';

  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  if (activeGame === 'memory-match') {
    return <MemoryMatchGame onBackToDashboard={() => setActiveGame(null)} />;
  }

  if (activeGame === 'pattern-recall') {
    return <PatternRecallGame onBackToDashboard={() => setActiveGame(null)} />;
  }

  if (activeGame === 'recognition-quiz') {
    return <RecognitionQuizGame onBackToDashboard={() => setActiveGame(null)} />;
  }

  if (activeGame === 'family-recognition') {
    return <FamilyRecognitionGame onBackToDashboard={() => setActiveGame(null)} />;
  }

  const activities = [
    {
      type: 'memory-match' as GameType,
      title: ui.memoryMatchTitle,
      description: ui.memoryMatchDesc,
      icon: Brain,
      color: 'bg-teal-700 text-white',
      level: getAdaptiveState(userId, 'memory-match').currentLevel,
    },
    {
      type: 'pattern-recall' as GameType,
      title: ui.patternRecallTitle,
      description: ui.patternRecallDesc,
      icon: Sparkles,
      color: 'bg-indigo-700 text-white',
      level: getAdaptiveState(userId, 'pattern-recall').currentLevel,
    },
    {
      type: 'recognition-quiz' as GameType,
      title: ui.recognitionQuizTitle,
      description: ui.recognitionQuizDesc,
      icon: HelpCircle,
      color: 'bg-emerald-700 text-white',
      level: getAdaptiveState(userId, 'recognition-quiz').currentLevel,
    },
    {
      type: 'family-recognition' as GameType,
      title: ui.familyRecognitionTitle,
      description: ui.familyRecognitionDesc,
      icon: Users,
      color: 'bg-amber-600 text-white',
      level: getAdaptiveState(userId, 'family-recognition').currentLevel,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* WELCOMING ELDERLY-FIRST BANNER */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-black uppercase tracking-wider text-teal-100">
            <Heart className="w-4 h-4 fill-white" /> {ui.cognitiveActivities}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {ui.welcomeBack}, {userName}!
          </h1>
          <p className="text-teal-100 text-lg sm:text-xl font-medium leading-relaxed">
            {ui.memoryMatchDesc}
          </p>
        </div>
      </div>

      {/* CHOOSE AN ACTIVITY SECTION */}
      <div className="space-y-6">
        <div className="border-b-2 border-slate-200 pb-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{ui.cognitiveActivities}</h2>
          <p className="text-slate-600 text-lg font-semibold mt-1">{ui.listenPageGuidance}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.type}
                hoverEffect
                className="p-8 border-3 border-slate-200 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-16 h-16 rounded-3xl ${item.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-9 h-9" />
                    </div>
                    <DifficultyBadge level={item.level} />
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{item.title}</h3>
                  <p className="text-slate-700 text-lg font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-slate-100">
                  <Button
                    variant="primary"
                    size="xl"
                    icon={ArrowRight}
                    onClick={() => setActiveGame(item.type)}
                    fullWidth
                  >
                    {ui.startActivity}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
