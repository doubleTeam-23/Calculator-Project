import { Routes, Route, Outlet } from "react-router-dom";

import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import BasicCalculator from '@/components/Calculator/BasicCalculator';
import AdvancedCalculator from '@/components/Calculator/AdvancedCalculator';
import EquationSolver from '@/components/Calculator/EquationSolver';
import GraphingTool from '@/components/Calculator/GraphingTool';
import CalculusPanel from '@/components/Calculator/CalculusPanel';
import MatrixCalculator from '@/components/Calculator/MatrixCalculator';
import UnitConverters from '@/components/Calculator/UnitConverters';
import BMICalculator from '@/components/Calculator/BMICalculator';
import Sidebar from '@/components/Sidebar';



// 主布局组件，包含侧边栏和主内容区域
const MainLayout = () => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      <Outlet />
    </main>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AdvancedCalculator />} />
          <Route path="advanced" element={<AdvancedCalculator />} />
          <Route path="equations" element={<EquationSolver />} />
          <Route path="graphing" element={<GraphingTool />} />
          <Route path="calculus" element={<CalculusPanel />} />
          <Route path="matrix" element={<MatrixCalculator />} />
          <Route path="converters" element={<UnitConverters />} />
          <Route path="bmi" element={<BMICalculator />} />
        </Route>
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}
