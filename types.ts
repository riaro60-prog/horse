
export enum GamePhase {
  SETUP = 'SETUP',
  INITIAL = 'INITIAL',
  BETTING_PHASE_1 = 'BETTING_PHASE_1',
  RACING_R1_R3 = 'RACING_R1_R3',
  BETTING_PHASE_2 = 'BETTING_PHASE_2',
  RACING_FINAL = 'RACING_FINAL',
  RESULTS = 'RESULTS'
}

export interface MovementWeight {
  spaces: number;
  weight: number;
}

export interface Horse {
  id: number;
  name: string;
  color: string;
  icon: string;
  description: string;
  probabilities: MovementWeight[];
}

export interface Bet {
  horseId: number;
  amount: number;
  phase: 1 | 2;
}

export interface Player {
  id: number;
  name: string;
  balance: number;
  bets: Bet[];
}

export interface RaceState {
  horsePositions: Record<number, number>;
  round: number;
  winners: number[];
}
