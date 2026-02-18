# AlintaEnergy Bill Simulator

This is a React proof-of-concept built to demonstrate modern front-end architectural patterns within the energy sector. This dashboard allows users to manage their profiles and simulate real-time energy usage costs based on  pricing structures.

---

## 🛠️ The Tech Stack

- **Core:** React 19 + Vite + TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 (Modern CSS-first configuration)
- **Form Management:** React Hook Form (Uncontrolled components for performance)
- **State Logic:** Discriminated Unions with `useReducer`

---

## ⚡ Technical Showcase (Hooks & Logic)

To ensure this application meets enterprise standards for performance, I implemented several advanced React patterns:

### 1. Complex State with `useReducer`
Instead of multiple `useState` hooks, I centralized the Billing  logic within a reducer. This ensures that actions like `ADD_DEVICE` or `CHANGE_PLAN` result in predictable state transitions.

### 2. Performance Optimization with `useMemo`
The estimated bill calculation is wrapped in `useMemo`. In a real-world energy calculations can become mathematically expensive. This ensures the math only runs when the appliance list or energy rate actually changes, keeping the UI at 60fps.

### 3. Referential Stability with `useCallback`
Event handlers are memoized using `useCallback` before being passed to child components. This prevents unnecessary re-renders of the simulator list when the parent state updates.

### 4. Efficient Data Entry with `react-hook-form`
I utilized `react-hook-form` to handle customer onboarding. This minimizes re-renders compared to controlled inputs and includes regex validation for Australian-specific postcodes.

---

## 🎨 Design & Branding

The UI is built using **Tailwind CSS v4**, utilizing the new `@theme` variable system to inject brand identity:
- **Alinta Orange:** `#ff6100`
- **Alinta Blue:** `#196CFF`



---

## 🚀 How to Run

1. **Clone & Install:**
   ```bash
   git clone https://github.com/Sowmyasparks/AlintaEnergu-BillSimulator
   cd AlintaEnergu-BillSimulator
   npm install