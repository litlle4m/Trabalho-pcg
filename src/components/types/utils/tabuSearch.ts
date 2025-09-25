import { TravelData, TravelAnalysis, AnalysisWarning, CostBreakdown, TabuSearchResult } from '../types/travel';

class TabuSearchTravelAnalyzer {
  private tabuList: Set<string> = new Set();
  private tabuTenure: number = 5;
  private maxIterations: number = 50;

  calculateTotalCost(travel: TravelData): number {
    const hotelCost = travel.hotelPricePerDay * travel.stayDays;
    const foodCost = travel.foodPricePerDay * travel.stayDays;
    const entertainmentCost = travel.entertainmentPricePerDay * travel.stayDays;
    
    return travel.ticketPrice + hotelCost + foodCost + entertainmentCost;
  }

  calculateCostBreakdown(travel: TravelData): CostBreakdown {
    const hotelCost = travel.hotelPricePerDay * travel.stayDays;
    const foodCost = travel.foodPricePerDay * travel.stayDays;
    const entertainmentCost = travel.entertainmentPricePerDay * travel.stayDays;
    const totalCost = this.calculateTotalCost(travel);

    return {
      ticket: travel.ticketPrice,
      hotel: hotelCost,
      food: foodCost,
      entertainment: entertainmentCost,
      percentages: {
        ticket: (travel.ticketPrice / totalCost) * 100,
        hotel: (hotelCost / totalCost) * 100,
        food: (foodCost / totalCost) * 100,
        entertainment: (entertainmentCost / totalCost) * 100,
      }
    };
  }

  private calculateScoreRecursive(
    travel: TravelData, 
    allTravels: TravelData[], 
    depth: number = 0
  ): number {
    if (depth > 10) return 5;

    const totalCost = this.calculateTotalCost(travel);
    const costPerDay = totalCost / travel.stayDays;
    
    const avgCost = allTravels.reduce((sum, t) => sum + this.calculateTotalCost(t), 0) / allTravels.length;
    const avgCostPerDay = allTravels.reduce((sum, t) => sum + (this.calculateTotalCost(t) / t.stayDays), 0) / allTravels.length;
    
    let baseScore = Math.max(0, 10 - (totalCost / avgCost) * 5);
    
    const costEfficiencyBonus = Math.max(0, 2 - (costPerDay / avgCostPerDay));
    
    const expensiveItemPenalty = this.calculateExpensivePenaltyRecursive(travel, allTravels, depth + 1);
    
    const finalScore = Math.max(0, Math.min(10, baseScore + costEfficiencyBonus - expensiveItemPenalty));
    
    return Math.round(finalScore * 10) / 10;
  }

  private calculateExpensivePenaltyRecursive(
    travel: TravelData, 
    allTravels: TravelData[], 
    depth: number
  ): number {
    if (depth > 5) return 0;

    let penalty = 0;
    const otherTravels = allTravels.filter(t => t.id !== travel.id);
    
    for (const other of otherTravels) {
      if (travel.hotelPricePerDay > other.hotelPricePerDay * 3) {
        penalty += this.calculateExpensivePenaltyRecursive(travel, [other], depth + 1) + 1;
      }
      if (travel.foodPricePerDay > other.foodPricePerDay * 3) {
        penalty += this.calculateExpensivePenaltyRecursive(travel, [other], depth + 1) + 0.5;
      }
      if (travel.entertainmentPricePerDay > other.entertainmentPricePerDay * 3) {
        penalty += this.calculateExpensivePenaltyRecursive(travel, [other], depth + 1) + 0.5;
      }
      if (travel.ticketPrice > other.ticketPrice * 2) {
        penalty += this.calculateExpensivePenaltyRecursive(travel, [other], depth + 1) + 0.8;
      }
    }
    
    return Math.min(penalty, 3);
  }

  generateWarnings(travel: TravelData, allTravels: TravelData[]): AnalysisWarning[] {
    const warnings: AnalysisWarning[] = [];
    const otherTravels = allTravels.filter(t => t.id !== travel.id);
    
    for (const other of otherTravels) {
      const hotelRatio = travel.hotelPricePerDay / other.hotelPricePerDay;
      const foodRatio = travel.foodPricePerDay / other.foodPricePerDay;
      const entertainmentRatio = travel.entertainmentPricePerDay / other.entertainmentPricePerDay;
      const ticketRatio = travel.ticketPrice / other.ticketPrice;

      if (hotelRatio >= 5) {
        warnings.push({
          type: 'hotel',
          message: `Hotel é ${hotelRatio.toFixed(1)}x mais caro que ${other.name}`,
          severity: 'high'
        });
      } else if (hotelRatio >= 3) {
        warnings.push({
          type: 'hotel',
          message: `Hotel é ${hotelRatio.toFixed(1)}x mais caro que ${other.name}`,
          severity: 'medium'
        });
      }

      if (foodRatio >= 4) {
        warnings.push({
          type: 'food',
          message: `Alimentação é ${foodRatio.toFixed(1)}x mais cara que ${other.name}`,
          severity: 'high'
        });
      } else if (foodRatio >= 2.5) {
        warnings.push({
          type: 'food',
          message: `Alimentação é ${foodRatio.toFixed(1)}x mais cara que ${other.name}`,
          severity: 'medium'
        });
      }

      if (entertainmentRatio >= 4) {
        warnings.push({
          type: 'entertainment',
          message: `Entretenimento é ${entertainmentRatio.toFixed(1)}x mais caro que ${other.name}`,
          severity: 'high'
        });
      }

      if (ticketRatio >= 3) {
        warnings.push({
          type: 'ticket',
          message: `Passagem é ${ticketRatio.toFixed(1)}x mais cara que ${other.name}`,
          severity: 'high'
        });
      }
    }

    return warnings.slice(0, 3);
  }

  analyze(travels: TravelData[]): TabuSearchResult {
    let bestSolution: TravelAnalysis[] = [];
    let currentSolution: TravelAnalysis[] = [];
    const convergenceData: number[] = [];
    
    currentSolution = travels.map(travel => ({
      travel,
      totalCost: this.calculateTotalCost(travel),
      costPerDay: this.calculateTotalCost(travel) / travel.stayDays,
      score: this.calculateScoreRecursive(travel, travels),
      rank: 0,
      warnings: this.generateWarnings(travel, travels),
      breakdown: this.calculateCostBreakdown(travel)
    }));

    bestSolution = [...currentSolution];
    
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      let bestCandidate: TravelAnalysis[] | null = null;
      let bestCandidateValue = -Infinity;

      for (let i = 0; i < travels.length; i++) {
        const neighbor = [...currentSolution];
        
        const variation = (Math.random() - 0.5) * 0.5;
        const newScore = Math.max(0, Math.min(10, 
          this.calculateScoreRecursive(travels[i], travels) + variation
        ));
        
        neighbor[i] = {
          ...neighbor[i],
          score: newScore
        };

        const solutionKey = neighbor.map(n => n.score.toFixed(2)).join('-');
        
        if (!this.tabuList.has(solutionKey)) {
          const solutionValue = neighbor.reduce((sum, n) => sum + n.score, 0);
          
          if (solutionValue > bestCandidateValue) {
            bestCandidate = neighbor;
            bestCandidateValue = solutionValue;
          }
        }
      }

      if (bestCandidate) {
        currentSolution = bestCandidate;
        
        const solutionKey = currentSolution.map(n => n.score.toFixed(2)).join('-');
        this.tabuList.add(solutionKey);
        
        if (this.tabuList.size > this.tabuTenure) {
          const firstKey = this.tabuList.values().next().value;
          this.tabuList.delete(firstKey);
        }

        const currentValue = currentSolution.reduce((sum, n) => sum + n.score, 0);
        const bestValue = bestSolution.reduce((sum, n) => sum + n.score, 0);
        
        if (currentValue > bestValue) {
          bestSolution = [...currentSolution];
        }
      }

      convergenceData.push(bestSolution.reduce((sum, n) => sum + n.score, 0));
    }

    bestSolution.sort((a, b) => b.score - a.score);
    bestSolution.forEach((analysis, index) => {
      analysis.rank = index + 1;
    });

    return {
      bestSolution,
      iterations: this.maxIterations,
      convergenceData
    };
  }
}

export const tabuSearchAnalyzer = new TabuSearchTravelAnalyzer();
