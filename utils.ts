
import { MovementWeight } from "./types";

export function calculateMovement(weights: MovementWeight[]): number {
  const totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of weights) {
    if (random < item.weight) {
      return item.spaces;
    }
    random -= item.weight;
  }
  return 0;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
}
