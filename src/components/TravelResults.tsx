import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AlertTriangle, Crown, Medal, Award, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { TravelAnalysis } from '../types/travel';

interface TravelResultsProps {
  results: TravelAnalysis[];
}

const TravelResults: React.FC<TravelResultsProps> = ({ results }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-travel-gold" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <TrendingUp className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-success';
    if (score >= 6) return 'bg-warning';
    return 'bg-destructive';
  };

  const getScoreColorLight = (score: number) => {
    if (score >= 8) return 'from-success/20 to-success/5';
    if (score >= 6) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Análise com Busca Tabu
        </h2>
        <p className="text-muted-foreground">
      
        </p>
      </div>

      <div className="grid gap-6">
        {results.map((result, index) => (
          <Card 
            key={result.travel.id} 
            className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
              result.rank === 1 ? 'border-travel-gold ring-2 ring-travel-gold/20' : 
              result.rank === 2 ? 'border-gray-400' : 
              result.rank === 3 ? 'border-orange-500' : 'border-border'
            }`}
          >
            {result.rank === 1 && (
              <div className="absolute top-0 right-0 bg-travel-gold text-white px-3 py-1 rounded-bl-lg font-bold text-sm">
                MELHOR ESCOLHA
              </div>
            )}

            <CardHeader className={`bg-gradient-to-r ${getScoreColorLight(result.score)} relative`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRankIcon(result.rank)}
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {result.travel.name || `Destino ${result.travel.id}`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      #{result.rank} • {result.travel.stayDays} dias
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getScoreColor(result.score)} text-white font-bold`}>
                    <span className="text-2xl">{result.score.toFixed(1)}</span>
                    <span className="text-sm">/10</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Resumo Financeiro */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">{formatCurrency(result.totalCost)}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-secondary" />
                  <p className="text-xs text-muted-foreground">Por Dia</p>
                  <p className="font-bold text-lg">{formatCurrency(result.costPerDay)}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-xs text-muted-foreground">Rank</p>
                  <p className="font-bold text-lg">#{result.rank}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Award className="w-5 h-5 mx-auto mb-1 text-travel-purple" />
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="font-bold text-lg">{result.score.toFixed(1)}</p>
                </div>
              </div>

              {/* Breakdown de Custos */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  Detalhamento de Custos
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Passagem</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={result.breakdown.percentages.ticket} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm font-medium w-16 text-right">
                        {formatCurrency(result.breakdown.ticket)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hotel Total</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={result.breakdown.percentages.hotel} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm font-medium w-16 text-right">
                        {formatCurrency(result.breakdown.hotel)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Alimentação Total</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={result.breakdown.percentages.food} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm font-medium w-16 text-right">
                        {formatCurrency(result.breakdown.food)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Entretenimento Total</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={result.breakdown.percentages.entertainment} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm font-medium w-16 text-right">
                        {formatCurrency(result.breakdown.entertainment)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alertas Tabu */}
              {result.warnings.length > 0 && (
                <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <h4 className="font-semibold text-warning">Alertas do Algoritmo Tabu</h4>
                  </div>
                  <div className="space-y-1">
                    {result.warnings.map((warning, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Badge 
                          variant={warning.severity === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {warning.type.toUpperCase()}
                        </Badge>
                        <span className="text-sm">{warning.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TravelResults;
