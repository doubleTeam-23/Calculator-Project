import { useState } from 'react';
import { solveLinearEquation, solveQuadraticEquation } from '@/lib/mathUtils';
import { cn } from '@/lib/utils';

interface EquationSolverProps {
  className?: string;
}

export default function EquationSolver({ className }: EquationSolverProps) {
  const [equationType, setEquationType] = useState<'linear' | 'quadratic' | 'system'>('linear');
  const [coefficients, setCoefficients] = useState({
    a: '', b: '', c: '', // 一元一次方程 ax + b = 0 或 一元二次方程 ax² + bx + c = 0
    a1: '', b1: '', c1: '', // 二元一次方程组 a1x + b1y = c1
    a2: '', b2: '', c2: ''  // 二元一次方程组 a2x + b2y = c2
  });
  const [solution, setSolution] = useState<string | null>(null);

  // 处理系数变化
  const handleCoefficientChange = (
    field: keyof typeof coefficients, 
    value: string
  ) => {
    setCoefficients(prev => ({ ...prev, [field]: value }));
    setSolution(null); // 清除之前的解
  };

  // 求解一元一次方程
  const solveLinear = () => {
    try {
      const a = parseFloat(coefficients.a || '0');
      const b = parseFloat(coefficients.b || '0');
      
      if (isNaN(a) || isNaN(b)) {
        setSolution('请输入有效的系数');
        return;
      }
      
      const x = solveLinearEquation(a, b);
      
      if (x === null) {
        setSolution('方程无解或有无数解');
      } else {
        setSolution(`x = ${x.toFixed(4)}`);
      }
    } catch (error) {
      setSolution('计算错误');
    }
  };

  // 求解一元二次方程
  const solveQuadratic = () => {
    try {
      const a = parseFloat(coefficients.a || '0');
      const b = parseFloat(coefficients.b || '0');
      const c = parseFloat(coefficients.c || '0');
      
      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        setSolution('请输入有效的系数');
        return;
      }
      
      const result = solveQuadraticEquation(a, b, c);
      
      if (!result) {
        setSolution('方程无实根或系数无效');
      } else if (result.x1 === result.x2) {
        setSolution(`x = ${result.x1.toFixed(4)}`);
      } else {
        setSolution(`x₁ = ${result.x1.toFixed(4)}, x₂ = ${result.x2.toFixed(4)}`);
      }
    } catch (error) {
      setSolution('计算错误');
    }
  };

  // 求解二元一次方程组
  const solveSystem = () => {
    try {
      const a1 = parseFloat(coefficients.a1 || '0');
      const b1 = parseFloat(coefficients.b1 || '0');
      const c1 = parseFloat(coefficients.c1 || '0');
      const a2 = parseFloat(coefficients.a2 || '0');
      const b2 = parseFloat(coefficients.b2 || '0');
      const c2 = parseFloat(coefficients.c2 || '0');
      
      if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
        setSolution('请输入有效的系数');
        return;
      }
      
      // 使用克拉默法则求解
      const determinant = a1 * b2 - a2 * b1;
      
      if (determinant === 0) {
        // 检查是否有无数解或无解
        const determinant2 = a1 * c2 - a2 * c1;
        if (determinant2 === 0) {
          setSolution('方程组有无数解');
        } else {
          setSolution('方程组无解');
        }
        return;
      }
      
      // 计算解
      const x = (b2 * c1 - b1 * c2) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;
      
      setSolution(`x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`);
    } catch (error) {
      setSolution('计算错误');
    }
  };

  // 求解方程
  const handleSolve = () => {
    switch (equationType) {
      case 'linear':
        solveLinear();
        break;
      case 'quadratic':
        solveQuadratic();
        break;
      case 'system':
        solveSystem();
        break;
    }
  };

  // 渲染方程输入表单
  const renderEquationForm = () => {
    switch (equationType) {
      case 'linear':
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-center text-gray-300 mb-4">一元一次方程: ax + b = 0</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">系数 a</label>
                  <input
                    type="number"
                    value={coefficients.a}
                    onChange={(e) => handleCoefficientChange('a', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">系数 b</label>
                  <input
                    type="number"
                    value={coefficients.b}
                    onChange={(e) => handleCoefficientChange('b', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'quadratic':
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-center text-gray-300 mb-4">一元二次方程: ax² + bx + c = 0</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">系数 a</label>
                  <input
                    type="number"
                    value={coefficients.a}
                    onChange={(e) => handleCoefficientChange('a', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">系数 b</label>
                  <input
                    type="number"
                    value={coefficients.b}
                    onChange={(e) => handleCoefficientChange('b', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">系数 c</label>
                  <input
                    type="number"
                    value={coefficients.c}
                    onChange={(e) => handleCoefficientChange('c', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'system':
        return (
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-center text-gray-300 mb-4">二元一次方程组</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">第一个方程: a₁x + b₁y = c₁</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      value={coefficients.a1}
                      onChange={(e) => handleCoefficientChange('a1', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="a₁"
                    />
                    <input
                      type="number"
                      value={coefficients.b1}
                      onChange={(e) => handleCoefficientChange('b1', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="b₁"
                    />
                    <input
                      type="number"
                      value={coefficients.c1}
                      onChange={(e) => handleCoefficientChange('c1', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="c₁"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">第二个方程: a₂x + b₂y = c₂</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      value={coefficients.a2}
                      onChange={(e) => handleCoefficientChange('a2', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="a₂"
                    />
                    <input
                      type="number"
                      value={coefficients.b2}
                      onChange={(e) => handleCoefficientChange('b2', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="b₂"
                    />
                    <input
                      type="number"
                      value={coefficients.c2}
                      onChange={(e) => handleCoefficientChange('c2', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="c₂"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      <div className="p-4 bg-gray-900">
        <h3 className="text-white text-xl font-semibold text-center">方程求解</h3>
      </div>
      
      {/* 方程类型选择 */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setEquationType('linear')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              equationType === 'linear'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            一元一次方程
          </button>
          <button
            onClick={() => setEquationType('quadratic')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              equationType === 'quadratic'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            一元二次方程
          </button>
          <button
            onClick={() => setEquationType('system')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              equationType === 'system'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            二元一次方程组  
          </button>
        </div>
      </div>
      
      {/* 方程输入区域 */}
      <div className="p-6">
        {renderEquationForm()}
        
        {/* 求解按钮 */}
        <div className="mt-6">
          <button
            onClick={handleSolve}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 text-lg font-medium"
          >
            求解方程
          </button>
        </div>
        
        {/* 结果显示 */}
        {solution && (
          <div className="mt-6 p-4 bg-gray-900 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">方程的解:</p>
            <p className="text-white text-2xl font-light text-center">{solution}</p>
          </div>
        )}
      </div>
    </div>
  );
}