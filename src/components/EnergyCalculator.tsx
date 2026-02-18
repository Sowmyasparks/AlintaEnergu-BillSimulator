import { useMemo, useCallback, useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import type { EnergyState, EnergyAction, Appliance, PlanType } from '../types/energy';

interface CalulatorProps {
  state: EnergyState;
  dispatch: React.Dispatch<EnergyAction>;
}

export const EnergyCalculator: FC<CalulatorProps> = ({ state, dispatch }) => {

  const [availableAppliances, setAvailableAppliances] = useState<Appliance[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Visible in slow network only

  // API request to database to fetch appliance list
  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        setLoading(true);
        const response = await fetch('/appliances.json'); // Using dummy json for appliance list
        const data = await response.json();
        setAvailableAppliances(data);
      } catch (error) {
        console.error("Failed to fetch appliances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliances();
  }, []);

  //Monthly Bill Calculation. useMemo useful when more appliances
  const estimatedMonthlyBill = useMemo(() => {
    const dailyKwh = state.appliances.reduce((sum, item) => sum + item.kwh, 0);
    const rate = state.plan === 'green' ? 0.3 : 0.25;
    return (dailyKwh * rate * 30).toFixed(2);
  }, [state.appliances, state.plan]);

  //Adding the selection to global state
const handleAddSelected = useCallback(() => {
  if (!selectedId) return;

  const selectedAppliance = availableAppliances.find(a => a.id === selectedId);
  
  if (selectedAppliance) {
    const id = `${selectedAppliance.id}-${crypto.randomUUID()}`; // random id to ensure unique id when same appliance added more than once

    const newDevice: Appliance = { 
      ...selectedAppliance, 
      id: id 
    };

    dispatch({ type: 'ADD_DEVICE', payload: newDevice });
    setSelectedId(""); 
  }
}, [selectedId, availableAppliances, dispatch]);

  const handleRateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'CHANGE_PLAN', payload: e.target.value as PlanType });
  };

  return (
    <div className="bg-white p-8 shadow-xl rounded-2xl border-t-4 border-alinta-blue">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calculator</h2>
      </div>

      {/* Monthly Bill Display */}
      <div className="mb-8 p-6 rounded-xl border border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Estimated Monthly Bill</p>
          <p className="text-4xl font-black text-gray-900">${estimatedMonthlyBill}</p>
        </div>
        <select 
          value={state.plan}
          onChange={handleRateChange}
          className="p-2 border rounded-md text-sm font-medium focus:ring-2 focus:ring-alinta-blue outline-none bg-white"
        >
          <option value="standard">Standard Rate</option>
          <option value="green">Eco-Green Rate</option>
        </select>
      </div>

      {/* Dropdown with Loading State */}
      <div className="flex gap-2 mb-8">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={loading}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alinta-blue outline-none bg-white disabled:bg-gray-100"
        >
          <option value="">{loading ? "Loading Appliances..." : "-- Select Appliance --"}</option>
          {availableAppliances.map(eachAppliance => (
            <option key={eachAppliance.id} value={eachAppliance.id}>
              {eachAppliance.name} ({eachAppliance.kwh} kWh/h)
            </option>
          ))}
        </select>
        <button
          onClick={handleAddSelected}
          disabled={!selectedId || loading}
          className="px-6 py-3 bg-alinta-blue text-white font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-30"
        >
          Add
        </button>
      </div>

      {/* List of Active Devices */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Household Load</p>
        {state.appliances.length === 0 && (
          <div className="py-6 text-center border-2 border-dashed border-gray-100 rounded-lg text-gray-400 italic text-sm">
             No appliances selected
          </div>
        )}
        {state.appliances.map((eachAppliance) => (
          <div key={eachAppliance.id} className="flex justify-between items-center p-4 rounded-lg border border-transparent hover:border-gray-200 transition-all">
            <span className="font-semibold text-gray-700">{eachAppliance.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono font-bold text-alinta-blue">{eachAppliance.kwh} kWh</span>
              <button 
                onClick={() => dispatch({ type: 'REMOVE_DEVICE', payload: eachAppliance.id })}
                className="text-red-400 hover:text-red-600 text-xl font-bold px-2"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};