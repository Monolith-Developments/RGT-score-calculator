import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Plus, Minus, Crown, Trophy, Users, Calculator, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Judge {
  id: number;
  creativity: string;
  quality: string;
  specialCriteria: string[];
  halfWeight: boolean;
}

interface AudienceVoting {
  voters: string;
  totalPoints: string;
}

interface CalculationResults {
  finalScore: number;
  judgesScore: number;
  audienceScore: number;
  overallJudgesAverage: number;
  audienceAverage: number;
  judgeAverages: number[];
}

const TalentCalculator = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  
  const [numJudges, setNumJudges] = useState<number>(3);
  const [judges, setJudges] = useState<Judge[]>([
    { id: 1, creativity: '', quality: '', specialCriteria: [''], halfWeight: false },
    { id: 2, creativity: '', quality: '', specialCriteria: [''], halfWeight: false },
    { id: 3, creativity: '', quality: '', specialCriteria: [''], halfWeight: false }
  ]);
  const [audienceHalfWeight, setAudienceHalfWeight] = useState<AudienceVoting>({ voters: '', totalPoints: '' });
  const [audienceFullWeight, setAudienceFullWeight] = useState<AudienceVoting>({ voters: '', totalPoints: '' });
  const [results, setResults] = useState<CalculationResults | null>(null);

  const updateNumJudges = useCallback((newNum: number) => {
    if (newNum < 1) return;
    setNumJudges(newNum);
    
    const newJudges = Array.from({ length: newNum }, (_, i) => {
      const existingJudge = judges[i];
      return existingJudge || { id: i + 1, creativity: '', quality: '', specialCriteria: [''], halfWeight: false };
    });
    setJudges(newJudges);
  }, [judges]);

  const updateJudge = useCallback((judgeId: number, field: keyof Omit<Judge, 'id' | 'specialCriteria'>, value: string | boolean) => {
    setJudges(prev => prev.map(judge => 
      judge.id === judgeId ? { ...judge, [field]: value } : judge
    ));
  }, []);

  const updateSpecialCriteria = useCallback((judgeId: number, index: number, value: string) => {
    setJudges(prev => prev.map(judge => 
      judge.id === judgeId 
        ? { 
            ...judge, 
            specialCriteria: judge.specialCriteria.map((criteria, i) => 
              i === index ? value : criteria
            )
          }
        : judge
    ));
  }, []);

  const addSpecialCriteria = useCallback((judgeId: number) => {
    setJudges(prev => prev.map(judge => 
      judge.id === judgeId 
        ? { ...judge, specialCriteria: [...judge.specialCriteria, ''] }
        : judge
    ));
  }, []);

  const removeSpecialCriteria = useCallback((judgeId: number, index: number) => {
    setJudges(prev => prev.map(judge => 
      judge.id === judgeId 
        ? { 
            ...judge, 
            specialCriteria: judge.specialCriteria.filter((_, i) => i !== index)
          }
        : judge
    ));
  }, []);

  const calculateResults = useCallback(() => {
    // Calculate judge averages with weights
    const judgeAverages = judges.map(judge => {
      const creativity = parseFloat(judge.creativity) || 0;
      const quality = parseFloat(judge.quality) || 0;
      const specialCriteriaSum = judge.specialCriteria.reduce((sum, criteria) => sum + (parseFloat(criteria) || 0), 0);
      const specialCriteriaAverage = specialCriteriaSum / judge.specialCriteria.length;
      const judgeAverage = (creativity + quality + specialCriteriaAverage) / 3;
      return judgeAverage * (judge.halfWeight ? 0.5 : 1);
    });

    // Overall judges average
    const overallJudgesAverage = judgeAverages.reduce((sum, avg) => sum + avg, 0) / judgeAverages.length;
    
    // Judges score (75% weight)
    const judgesScore = overallJudgesAverage * 0.75;
    
    // Audience scores
    const halfWeightVoters = parseFloat(audienceHalfWeight.voters) || 0;
    const halfWeightPoints = parseFloat(audienceHalfWeight.totalPoints) || 0;
    const halfWeightAverage = halfWeightVoters > 0 ? (halfWeightPoints / halfWeightVoters) * 0.5 : 0;
    
    const fullWeightVoters = parseFloat(audienceFullWeight.voters) || 0;
    const fullWeightPoints = parseFloat(audienceFullWeight.totalPoints) || 0;
    const fullWeightAverage = fullWeightVoters > 0 ? fullWeightPoints / fullWeightVoters : 0;
    
    const combinedAudienceAverage = halfWeightAverage + fullWeightAverage;
    const audienceScore = combinedAudienceAverage * 0.25;
    
    // Final score
    const finalScore = judgesScore + audienceScore;

    setResults({
      finalScore,
      judgesScore,
      audienceScore,
      overallJudgesAverage,
      audienceAverage: combinedAudienceAverage,
      judgeAverages: judges.map(judge => {
        const creativity = parseFloat(judge.creativity) || 0;
        const quality = parseFloat(judge.quality) || 0;
        const specialCriteriaSum = judge.specialCriteria.reduce((sum, criteria) => sum + (parseFloat(criteria) || 0), 0);
        const specialCriteriaAverage = specialCriteriaSum / judge.specialCriteria.length;
        return (creativity + quality + specialCriteriaAverage) / 3;
      })
    });
  }, [judges, audienceHalfWeight, audienceFullWeight]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Logo placeholder */}
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-4xl font-bold font-royal bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-background" />
            </div>
          </div>
          <p className="text-muted-foreground text-lg font-elegant">
            {t('subtitle')}
          </p>
          
          {/* Theme and Language toggles */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>
        </div>

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Judges Configuration */}
            <Card className="border-gold/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gold/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gold font-royal">
                  <Trophy className="w-5 h-5" />
                  {t('judgesConfig')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="numJudges" className="text-sm font-medium">{t('numJudges')}</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateNumJudges(numJudges - 1)}
                      disabled={numJudges <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="numJudges"
                      type="number"
                      value={numJudges}
                      onChange={(e) => updateNumJudges(parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateNumJudges(numJudges + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Individual Judge Inputs */}
                {judges.map((judge, judgeIndex) => (
                  <Card key={judge.id} className="border-muted bg-muted/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{t('judge')} {judge.id}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">
                            {judge.halfWeight ? t('halfWeight') : t('fullWeight')}
                          </Label>
                          <Switch
                            checked={judge.halfWeight}
                            onCheckedChange={(checked) => updateJudge(judge.id, 'halfWeight', checked)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`creativity-${judge.id}`} className="text-sm">{t('creativity')}</Label>
                          <Input
                            id={`creativity-${judge.id}`}
                            type="number"
                            value={judge.creativity}
                            onChange={(e) => updateJudge(judge.id, 'creativity', e.target.value)}
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quality-${judge.id}`} className="text-sm">{t('quality')}</Label>
                          <Input
                            id={`quality-${judge.id}`}
                            type="number"
                            value={judge.quality}
                            onChange={(e) => updateJudge(judge.id, 'quality', e.target.value)}
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">{t('specialCriteria')}</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addSpecialCriteria(judge.id)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {judge.specialCriteria.map((criteria, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={criteria}
                                onChange={(e) => updateSpecialCriteria(judge.id, index, e.target.value)}
                                min="0"
                                max="10"
                                step="0.1"
                                placeholder={`${t('criteria')} ${index + 1}`}
                              />
                              {judge.specialCriteria.length > 1 && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeSpecialCriteria(judge.id, index)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Audience Voting - Half Weight */}
            <Card className="border-gold/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gold/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gold font-royal">
                  <Users className="w-5 h-5" />
                  {t('audienceHalfWeight')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="audienceHalfVoters" className="text-sm font-medium">{t('numVoters')}</Label>
                  <Input
                    id="audienceHalfVoters"
                    type="number"
                    value={audienceHalfWeight.voters}
                    onChange={(e) => setAudienceHalfWeight(prev => ({ ...prev, voters: e.target.value }))}
                    min="0"
                    className="mt-1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="audienceHalfPoints" className="text-sm font-medium">{t('totalPoints')}</Label>
                  <Input
                    id="audienceHalfPoints"
                    type="number"
                    value={audienceHalfWeight.totalPoints}
                    onChange={(e) => setAudienceHalfWeight(prev => ({ ...prev, totalPoints: e.target.value }))}
                    min="0"
                    step="0.1"
                    className="mt-1"
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('voterDescription')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Audience Voting - Full Weight */}
            <Card className="border-gold/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gold/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gold font-royal">
                  <Users className="w-5 h-5" />
                  {t('audienceFullWeight')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="audienceFullVoters" className="text-sm font-medium">{t('numVoters')}</Label>
                  <Input
                    id="audienceFullVoters"
                    type="number"
                    value={audienceFullWeight.voters}
                    onChange={(e) => setAudienceFullWeight(prev => ({ ...prev, voters: e.target.value }))}
                    min="0"
                    className="mt-1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="audienceFullPoints" className="text-sm font-medium">{t('totalPoints')}</Label>
                  <Input
                    id="audienceFullPoints"
                    type="number"
                    value={audienceFullWeight.totalPoints}
                    onChange={(e) => setAudienceFullWeight(prev => ({ ...prev, totalPoints: e.target.value }))}
                    min="0"
                    step="0.1"
                    className="mt-1"
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('voterDescription')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Calculate Button */}
            <Button 
              variant="kingdom" 
              size="lg" 
              onClick={calculateResults}
              className="w-full"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {t('calculateResult')}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {results && (
              <>
                {/* Final Score */}
                <Card className="border-gold/40 shadow-xl bg-gradient-to-br from-card to-muted/20">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl text-gold">{t('finalScore')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent mb-2">
                      {results.finalScore.toFixed(2)}
                    </div>
                    <p className="text-muted-foreground">{t('outOf')}</p>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <Card className="border-gold/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gold">{t('scoreBreakdown')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-gold">{results.judgesScore.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{t('judgesScore')}</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-gold">{results.audienceScore.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{t('audienceScore')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Calculations */}
                <Card className="border-gold/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gold">{t('detailedCalculations')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{t('judgeAverages')}</h4>
                      <div className="space-y-1">
                        {results.judgeAverages.map((avg, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{t('judge')} {index + 1} {judges[index]?.halfWeight ? `(${t('halfWeight')})` : ''}:</span>
                            <span className="font-mono">{avg.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('overallJudgesAverage')}</span>
                        <div className="font-mono">{results.overallJudgesAverage.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('audienceAverage')}</span>
                        <div className="font-mono">{results.audienceAverage.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{t('calculationNote1')}</div>
                      <div>{t('calculationNote2')}</div>
                      <div>{t('calculationNote3')}</div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!results && (
              <Card className="border-dashed border-gold/30">
                <CardContent className="text-center py-12">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('enterScores')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center py-6 border-t border-gold/20">
          <p className="text-sm text-muted-foreground">
            {t('copyright')}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TalentCalculator;