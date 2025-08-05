import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Crown, Trophy, Users, Calculator } from 'lucide-react';

interface Judge {
  id: number;
  creativity: number;
  quality: number;
  specialCriteria: number[];
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
  const [numJudges, setNumJudges] = useState<number>(3);
  const [judges, setJudges] = useState<Judge[]>([
    { id: 1, creativity: 0, quality: 0, specialCriteria: [0] },
    { id: 2, creativity: 0, quality: 0, specialCriteria: [0] },
    { id: 3, creativity: 0, quality: 0, specialCriteria: [0] }
  ]);
  const [audienceVoters, setAudienceVoters] = useState<number>(0);
  const [totalAudiencePoints, setTotalAudiencePoints] = useState<number>(0);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const updateNumJudges = useCallback((newNum: number) => {
    if (newNum < 1) return;
    setNumJudges(newNum);
    
    const newJudges = Array.from({ length: newNum }, (_, i) => {
      const existingJudge = judges[i];
      return existingJudge || { id: i + 1, creativity: 0, quality: 0, specialCriteria: [0] };
    });
    setJudges(newJudges);
  }, [judges]);

  const updateJudge = useCallback((judgeId: number, field: keyof Judge, value: number) => {
    setJudges(prev => prev.map(judge => 
      judge.id === judgeId ? { ...judge, [field]: value } : judge
    ));
  }, []);

  const updateSpecialCriteria = useCallback((judgeId: number, index: number, value: number) => {
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
        ? { ...judge, specialCriteria: [...judge.specialCriteria, 0] }
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
    // Calculate judge averages
    const judgeAverages = judges.map(judge => {
      const specialCriteriaAverage = judge.specialCriteria.reduce((sum, criteria) => sum + criteria, 0) / judge.specialCriteria.length;
      return (judge.creativity + judge.quality + specialCriteriaAverage) / 3;
    });

    // Overall judges average
    const overallJudgesAverage = judgeAverages.reduce((sum, avg) => sum + avg, 0) / judgeAverages.length;
    
    // Judges score (75% weight)
    const judgesScore = overallJudgesAverage * 0.75;
    
    // Audience score (25% weight)
    const audienceAverage = audienceVoters > 0 ? totalAudiencePoints / audienceVoters : 0;
    const audienceScore = audienceAverage * 0.25;
    
    // Final score
    const finalScore = judgesScore + audienceScore;

    setResults({
      finalScore,
      judgesScore,
      audienceScore,
      overallJudgesAverage,
      audienceAverage,
      judgeAverages
    });
  }, [judges, audienceVoters, totalAudiencePoints]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-gold" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
              Rustic Got Talent Calculator
            </h1>
            <Crown className="w-8 h-8 text-gold" />
          </div>
          <p className="text-muted-foreground text-lg">
            Calculate contestant scores based on judges' ratings and audience votes
          </p>
        </div>

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Judges Configuration */}
            <Card className="border-gold/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gold">
                  <Trophy className="w-5 h-5" />
                  Judges Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="numJudges" className="text-sm font-medium">Number of Judges:</Label>
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
                      <CardTitle className="text-lg">Judge {judge.id}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`creativity-${judge.id}`} className="text-sm">Creativity (0-10)</Label>
                          <Input
                            id={`creativity-${judge.id}`}
                            type="number"
                            value={judge.creativity}
                            onChange={(e) => updateJudge(judge.id, 'creativity', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="10"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quality-${judge.id}`} className="text-sm">Quality (0-10)</Label>
                          <Input
                            id={`quality-${judge.id}`}
                            type="number"
                            value={judge.quality}
                            onChange={(e) => updateJudge(judge.id, 'quality', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="10"
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Special Criteria</Label>
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
                                onChange={(e) => updateSpecialCriteria(judge.id, index, parseFloat(e.target.value) || 0)}
                                min="0"
                                max="10"
                                step="0.1"
                                placeholder={`Criteria ${index + 1}`}
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

            {/* Audience Voting */}
            <Card className="border-gold/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gold">
                  <Users className="w-5 h-5" />
                  Audience Voting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="audienceVoters" className="text-sm font-medium">Number of Audience Voters</Label>
                  <Input
                    id="audienceVoters"
                    type="number"
                    value={audienceVoters}
                    onChange={(e) => setAudienceVoters(parseInt(e.target.value) || 0)}
                    min="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="totalPoints" className="text-sm font-medium">Total Audience Points</Label>
                  <Input
                    id="totalPoints"
                    type="number"
                    value={totalAudiencePoints}
                    onChange={(e) => setTotalAudiencePoints(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Each voter gives 1-10 points. Total = sum of all votes.
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
              Calculate Result
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Final Score */}
                <Card className="border-gold/40 shadow-xl bg-gradient-to-br from-card to-muted/20">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl text-gold">Final Score</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent mb-2">
                      {results.finalScore.toFixed(2)}
                    </div>
                    <p className="text-muted-foreground">out of 10.00</p>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <Card className="border-gold/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gold">Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-gold">{results.judgesScore.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Judges' Score (75%)</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-gold">{results.audienceScore.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Audience Score (25%)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Calculations */}
                <Card className="border-gold/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gold">Detailed Calculations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Judge Averages:</h4>
                      <div className="space-y-1">
                        {results.judgeAverages.map((avg, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>Judge {index + 1}:</span>
                            <span className="font-mono">{avg.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Overall Judges Average:</span>
                        <div className="font-mono">{results.overallJudgesAverage.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Audience Average:</span>
                        <div className="font-mono">{results.audienceAverage.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Judges' Score = Overall Judges Average × 0.75</div>
                      <div>• Audience Score = Audience Average × 0.25</div>
                      <div>• Final Score = Judges' Score + Audience Score</div>
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
                    Enter scores and click "Calculate Result" to see the final score and breakdown.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentCalculator;