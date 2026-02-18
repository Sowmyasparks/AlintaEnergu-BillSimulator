import { useReducer, useMemo, useState } from 'react';
import { CustomerForm } from './components/CustomerForm';
import { EnergyCalculator } from './components/EnergyCalculator';
import type { EnergyState, EnergyAction, PlanType } from './types/energy';

// Reducer Logic
const initialState: EnergyState = {
  plan: 'standard',
  appliances: [],
};

function energyReducer(state: EnergyState, action: EnergyAction): EnergyState {
  switch (action.type) {
    case 'ADD_DEVICE':
      return { ...state, appliances: [...state.appliances, action.payload] };
    case 'REMOVE_DEVICE':
      return { ...state, appliances: state.appliances.filter(d => d.id !== action.payload) };
    case 'CHANGE_PLAN':
      return { ...state, plan: action.payload };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(energyReducer, initialState);
  
  // Local state to store user info after form submission
  const [userName, setUserName] = useState<string>("");

  // Calculation  when appliances change
  const totalDailyKwh = useMemo(() => {
    return state.appliances.reduce((acc, curr) => acc + curr.kwh, 0);
  }, [state.appliances]);

  // To sync Form data with the Simulator
  const handleOnboardingSubmit = (data: any) => {
    setUserName(data.firstName);
    
    // Switch plan based on account type
    const suggestedPlan: PlanType = data.connectionType === 'commercial' ? 'green' : 'standard';
    dispatch({ type: 'CHANGE_PLAN', payload: suggestedPlan });
  };

  return (
    <div className="min-h-screen text-gray-900">
      {/*Header */}
      <nav className="bg-white border-b border-gray-200 p-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-alinta-orange">
            ALINTA<span className="text-alinta-blue">ENERGY </span> <span className='text-gray-600 uppercase font-light tracking-tighter'> Bill Simulator</span>
          </h1>
          {userName && (
            <div className="text-sm font-medium text-gray-600">
              Welcome, <span className="font-bold text-alinta-orange">{userName}</span>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {/* Dashboard Intro */}
        <div className="mb-10">
          <p className="text-gray-500 max-w-4xl">
            Set up your profile to see rates for your area, then start adding appliances to estimate your monthly bill
          </p>
        </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Left: Customer Form */}
        <div className="lg:col-span-5">
          <CustomerForm onFormSubmit={handleOnboardingSubmit} />
        </div>

        {/* Right: Energy calculation */}
        <div className="lg:col-span-7 space-y-8">
          {/* Live Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-alinta-blue text-white p-6 rounded-2xl shadow-xl">
              <p className="text-xs uppercase opacity-60 font-bold">Total Load</p>
              <p className="text-4xl font-black mt-1">{totalDailyKwh.toFixed(2)} <span className="text-lg">kWh</span></p>
            </div>
            <div className="bg-alinta-orange text-white p-6 rounded-2xl shadow-xl">
              <p className="text-xs uppercase opacity-80 font-bold">Active Plan</p>
              <p className="text-2xl font-bold mt-1 capitalize">{state.plan} Energy</p>
            </div>
          </div>

          {/* The Main Calculation Component */}
          <EnergyCalculator state={state} dispatch={dispatch} />
        </div>
      </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 bg-white border-t border-gray-200 text-center">
        <p className="text-gray-400 text-sm">© 2026 Sowmya Alinta POC</p>
      </footer>
    </div>
  );
}

export default App;