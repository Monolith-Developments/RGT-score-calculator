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
    corpsMessage: 'Regards from the Corp of Talents',
    judgesConfig: 'Judges Configuration',
    numJudges: 'Number of Judges:',
    judge: 'Judge',
    creativity: 'Creativity (0-10)',
    quality: 'Quality (0-10)',
    specialCriteria: 'Special Criteria',
    criteria: 'Criteria',
    halfImpact: 'Half Impact',
    fullImpact: 'Full Impact',
    impactToggle: 'Impact Level',
    audienceVoting: 'Audience Voting',
    audienceHalfImpact: 'Audience Voting (Half Impact)',
    audienceFullImpact: 'Audience Voting (Full Impact)',
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
    calculationNote1: '• Judges\' Score = Overall Judges Average × Impact',
    calculationNote2: '• Audience Score = Audience Average × Impact',
    calculationNote3: '• Final Score = Judges\' Score + Audience Score',
    enterScores: 'Enter scores and click "Calculate Result" to see the final score and breakdown.',
    copyright: '© 2025 Rustic Kingdom 🗝️ | Developer: Adham'
  },
  ar: {
    title: 'حاسبة موهبة ريستيك',
    subtitle: 'احسب نقاط المتسابقين بناءً على تقييمات الحكام وأصوات الجمهور',
    corpsMessage: 'تحيات من مؤسسة المواهب',
    judgesConfig: 'إعداد الحكام',
    numJudges: 'عدد الحكام:',
    judge: 'الحكم',
    creativity: 'الإبداع (0-10)',
    quality: 'الجودة (0-10)',
    specialCriteria: 'معايير خاصة',
    criteria: 'معيار',
    halfImpact: 'تأثير نصف',
    fullImpact: 'تأثير كامل',
    impactToggle: 'مستوى التأثير',
    audienceVoting: 'تصويت الجمهور',
    audienceHalfImpact: 'تصويت الجمهور (تأثير نصف)',
    audienceFullImpact: 'تصويت الجمهور (تأثير كامل)',
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
    calculationNote1: '• نقاط الحكام = متوسط الحكام الإجمالي × التأثير',
    calculationNote2: '• نقاط الجمهور = متوسط الجمهور × التأثير',
    calculationNote3: '• النتيجة النهائية = نقاط الحكام + نقاط الجمهور',
    enterScores: 'أدخل النقاط واضغط "احسب النتيجة" لرؤية النتيجة النهائية والتفصيل.',
    copyright: '© 2025 مملكة ريستيك 🗝️ | المطور: أدهم'
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