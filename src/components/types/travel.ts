export interface TravelData {
  id: number;
  name: string;
  ticketPrice: number;
  hotelPricePerDay: number;
  stayDays: number;
  foodPricePerDay: number;
  entertainmentPricePerDay: number;
}

export interface TravelAnalysis {
  travel: TravelData;
  totalCost: number;
  costPerDay: number;
  score: number;
  rank: number;
  warnings: AnalysisWarning[];
  breakdown: CostBreakdown;
}

export interface AnalysisWarning {
  type: 'hotel' | 'food' | 'entertainment' | 'ticket';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CostBreakdown {
  ticket: number;
  hotel: number;
  food: number;
  entertainment: number;
  percentages: {
    ticket: number;
    hotel: number;
    food: number;
    entertainment: number;
  };
}

export interface TabuSearchResult {
  bestSolution: TravelAnalysis[];
  iterations: number;
  convergenceData: number[];
}
