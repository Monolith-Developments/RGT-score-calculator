import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    title: 'Rustic Got Talent Calculator',
    subtitle: 'Calculate contestant scores based on judges\' ratings and audience votes',
    judgesConfig: 'Judges Configuration',
    numJudges: 'Number of Judges:',
    judge: 'Judge',
    creativity: 'Creativity (0-10)',
    quality: 'Quality (0-10)',
    specialCriteria: 'Special Criteria',
    criteria: 'Criteria',
    halfWeight: '50% Weight',
    fullWeight: '100% Weight',
    audienceVoting: 'Audience Voting',
    audienceHalfWeight: 'Audience Voting (50% Weight)',
    audienceFullWeight: 'Audience Voting (100% Weight)',
    numVoters: 'Number of Voters',
    totalPoints: 'Total Points',
    voterDescription: 'Each voter gives 1-10 points. Total = sum of all votes.',
    calculateResult: 'Calculate Result',
    finalScore: 'Final Score',
    outOf: 'out of 10.00',
    scoreBreakdown: 'Score Breakdown',
    judgesScore: 'Judges\' Score',
    audienceScore: 'Audience Score',
    detailedCalculations: 'Detailed Calculations',
    judgeAverages: 'Judge Averages:',
    overallJudgesAverage: 'Overall Judges Average:',
    audienceAverage: 'Audience Average:',
    calculationNote1: '• Judges\' Score = Overall Judges Average × Weight',
    calculationNote2: '• Audience Score = Audience Average × Weight',
    calculationNote3: '• Final Score = Judges\' Score + Audience Score',
    enterScores: 'Enter scores and click "Calculate Result" to see the final score and breakdown.',
    copyright: '© 2024 Rustic Kingdom 🗝️ | Developer: Adham'
  },
  ar: {
    title: 'حاسبة موهبة ريستيك',
    subtitle: 'احسب نقاط المتسابقين بناءً على تقييمات الحكام وأصوات الجمهور',
    judgesConfig: 'إعداد الحكام',
    numJudges: 'عدد الحكام:',
    judge: 'الحكم',
    creativity: 'الإبداع (0-10)',
    quality: 'الجودة (0-10)',
    specialCriteria: 'معايير خاصة',
    criteria: 'معيار',
    halfWeight: 'وزن 50%',
    fullWeight: 'وزن 100%',
    audienceVoting: 'تصويت الجمهور',
    audienceHalfWeight: 'تصويت الجمهور (وزن 50%)',
    audienceFullWeight: 'تصويت الجمهور (وزن 100%)',
    numVoters: 'عدد المصوتين',
    totalPoints: 'إجمالي النقاط',
    voterDescription: 'كل مصوت يعطي 1-10 نقاط. الإجمالي = مجموع جميع الأصوات.',
    calculateResult: 'احسب النتيجة',
    finalScore: 'النتيجة النهائية',
    outOf: 'من 10.00',
    scoreBreakdown: 'تفصيل النقاط',
    judgesScore: 'نقاط الحكام',
    audienceScore: 'نقاط الجمهور',
    detailedCalculations: 'الحسابات التفصيلية',
    judgeAverages: 'متوسطات الحكام:',
    overallJudgesAverage: 'متوسط الحكام الإجمالي:',
    audienceAverage: 'متوسط الجمهور:',
    calculationNote1: '• نقاط الحكام = متوسط الحكام الإجمالي × الوزن',
    calculationNote2: '• نقاط الجمهور = متوسط الجمهور × الوزن',
    calculationNote3: '• النتيجة النهائية = نقاط الحكام + نقاط الجمهور',
    enterScores: 'أدخل النقاط واضغط "احسب النتيجة" لرؤية النتيجة النهائية والتفصيل.',
    copyright: '© 2024 مملكة ريستيك 🗝️ | المطور: أدهم'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    document.documentElement.dir = language === 'en' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};