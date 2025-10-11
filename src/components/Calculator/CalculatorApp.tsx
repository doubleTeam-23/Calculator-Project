import { useState } from 'react';
import BasicCalculator from './BasicCalculator';
import AdvancedCalculator from './AdvancedCalculator';
import EquationSolver from './EquationSolver';
import GraphingTool from './GraphingTool';
import MatrixCalculator from './MatrixCalculator';
import UnitConverters from './UnitConverters';
import BMICalculator from './BMICalculator';
import CalculusPanel from './CalculusPanel';
import { cn } from '@/lib/utils';

interface CalculatorAppProps {
  className?: string;
}

// 计算器功能类型定义
type CalculatorFunction = 
  | 'basic' 
  | 'advanced' 
  | 'equations' 
  | 'graphing' 
  | 'matrix' 
  | 'converters' 
  | 'bmi' 
  | 'calculus';

export default function CalculatorApp({ className }: CalculatorAppProps) {
  const [activeFunction, setActiveFunction] = useState<CalculatorFunction>('basic');
  
  // 功能按钮配置
  const functionButtons = [
    { id: 'basic', label: '基础计算', icon: 'fa-calculator' },
    { id: 'advanced', label: '高级计算', icon: 'fa-superscript' },
    { id: 'equations', label: '方程求解', icon: 'fa-equals' },
    { id: 'graphing', label: '函数绘图', icon: 'fa-chart-line' },
    { id: 'calculus', label: '微积分', icon: 'fa-integral' },
    { id: 'matrix', label: '矩阵计算', icon: 'fa-table' },
    { id: 'converters', label: '单位转换', icon: 'fa-exchange-alt' },
    { id: 'bmi', label: 'BMI计算', icon: 'fa-person' },
  ];
  
  // 渲染当前选中的功能组件
  const renderActiveComponent = () => {
    switch (activeFunction) {
      case 'basic':
        return <BasicCalculator />;
      case 'advanced':
        return <AdvancedCalculator />;
      case 'equations':
        return <EquationSolver />;
      case 'graphing':
        return <GraphingTool />;
      case 'matrix':
        return <MatrixCalculator />;
      case 'converters':
        return <UnitConverters />;
      case 'bmi':
        return <BMICalculator />;
      case 'calculus':
        return <CalculusPanel />;
      default:
        return <BasicCalculator />;
    }
  };
  
  return (
    <div className={cn('w-full max-w-4xl mx-auto p-4', className)}>
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">科学计算器</h1>
        <p className="text-gray-400">强大的数学计算工具</p>
      </div>
      
      {/* 功能选择标签 */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max">
          {functionButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveFunction(button.id as CalculatorFunction)}
              className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 ${
                activeFunction === button.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <i className={`fa ${button.icon} text-xl mb-1`}></i>
              <span className="text-sm font-medium">{button.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 活动功能组件 */}
      <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {renderActiveComponent()}
      </div>
      
      {/* 页脚 */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>科学计算器 v1.0 | 支持多种数学计算功能</p>
      </div>
    </div>
  );
}