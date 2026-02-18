export interface Appliance {
  id: string;
  name: string;
  kwh: number;
}

export type PlanType = 'standard' | 'green';

export interface EnergyState {
  plan: PlanType;
  appliances: Appliance[];
}

// Reducer Actions
export type EnergyAction =
  | { type: 'ADD_DEVICE'; payload: Appliance }
  | { type: 'REMOVE_DEVICE'; payload: string }
  | { type: 'CHANGE_PLAN'; payload: PlanType };