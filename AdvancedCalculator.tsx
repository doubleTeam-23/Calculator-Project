import { useState } from 'react';
import { 
  sin, cos, tan, cotan, factorial, power, squareRoot, reciprocal 
} from '@/lib/mathUtils';
import { cn } from '@/lib/utils';

interface AdvancedCalculatorProps {
  className?: string;
}

export default function AdvancedCalculator({ className }: AdvancedCalculatorProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg'); // 角度模式：度或弧度

  // 处理按钮输入
  const handleInput = (value: string) => {
    setInput(prev => prev + value);
    setResult(null); // 清除之前的结果
  };

  // 清除输入
  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  // 删除最后一个字符
  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  // 计算三角函数（根据角度模式转换）
  const calculateTrigFunction = (func: (x: number) => number) => {
    try {
      const value = parseFloat(input);
      if (isNaN(value)) {
        setResult('输入无效');
        return;
      }
      
      // 如果是角度模式，转换为弧度
      const angle = angleMode === 'deg' ? (value * Math.PI) / 180 : value;
      const result = func(angle);
      setResult(result.toFixed(6));
    } catch (error) {
      setResult('计算错误');
    }
  };

  // 计算阶乘
  const handleFactorial = () => {
    try {
      const value = parseFloat(input);
      if (isNaN(value) || !Number.isInteger(value) || value < 0) {
        setResult('请输入非负整数');
        return;
      }
      
      const result = factorial(value);
      setResult(result.toString());
    } catch (error) {
      setResult('计算错误');
    }
  };

  // 计算平方根
  const handleSquareRoot = () => {
    try {
      const value = parseFloat(input);
      if (isNaN(value)) {
        setResult('输入无效');
        return;
      }
      
      const result = squareRoot(value);
      setResult(result.toFixed(6));
    } catch (error) {
      setResult('计算错误');
    }
  };

  // 计算倒数
  const handleReciprocal = () => {
    try {
      const value = parseFloat(input);
      if (isNaN(value)) {
        setResult('输入无效');
        return;
      }
      
      const result = reciprocal(value);
      setResult(result.toFixed(6));
    } catch (error) {
      setResult('计算错误');
    }
  };

  // 计算幂函数
  const handlePower = (exponent: number) => {
    try {
      const base = parseFloat(input);
      if (isNaN(base)) {
        setResult('输入无效');
        return;
      }
      
      const result = power(base, exponent);
      setResult(result.toFixed(6));
    } catch (error) {
      setResult('计算错误');
    }
  };

  // 切换角度模式
  const toggleAngleMode = () => {
    setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg');
  };

  // 高级函数按钮配置
  const functionButtons = [
    [
      { label: 'sin', action: () => calculateTrigFunction(sin) },
      { label: 'cos', action: () => calculateTrigFunction(cos) },
      { label: 'tan', action: () => calculateTrigFunction(tan) },
      { label: 'cot', action: () => calculateTrigFunction(x => 1/tan(x)) },
    ],
    [
      { label: 'x!', action: handleFactorial },
      { label: '√x', action: handleSquareRoot },
      { label: '1/x', action: handleReciprocal },
      { label: 'x²', action: () => handlePower(2) },
    ],
    [
      { label: 'x³', action: () => handlePower(3) },
      { label: 'x⁻¹', action: () => handlePower(-1) },
      { label: 'x½', action: () => handlePower(0.5) },
      { label: 'eˣ', action: () => handlePower(Math.E) },
    ],
    [
      { label: '(', action: () => handleInput('(') },
      { label: ')', action: () => handleInput(')') },
      { label: 'π', action: () => handleInput(Math.PI.toString()) },
      { label: 'e', action: () => handleInput(Math.E.toString()) },
    ],
  ];

  return (
    <div className={cn('w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      {/* 角度模式切换 */}
      <div className="p-2 bg-gray-900 flex justify-end">
        <button
          onClick={toggleAngleMode}
          className={`px-3 py-1 text-sm rounded-full ${
            angleMode === 'deg' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {angleMode === 'deg' ? '角度 (DEG)' : '弧度 (RAD)'}
        </button>
      </div>
      
      {/* 输入和结果显示 */}
      <div className="p-6 bg-gray-900">
        <div className="text-right text-gray-400 text-sm mb-1 h-6">
          {result ? `结果: ${result}` : ''}
        </div>
        <div className="text-right text-white text-3xl font-light h-12 flex items-end justify-end">
          {input || '0'}
        </div>
      </div>
      
      {/* 数字和运算符按钮 */}
      <div className="p-4">
        {/* 函数按钮区域 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {functionButtons.flat().map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="py-3 px-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 text-sm"
            >
              {button.label}
            </button>
          ))}
        </div>
        
        {/* 输入控制按钮 */}
        <div className="grid grid-cols-4 gap-3">
          <button 
            onClick={handleClear} 
            className="py-3 px-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200"
          >
            C
          </button>
          <button 
            onClick={handleBackspace} 
            className="py-3 px-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200"
          >
            ←
          </button>
          <button 
            onClick={() => handleInput('%')} 
            className="py-3 px-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200"
          >
            %
          </button>
          <button 
            onClick={() => handleInput('/')} 
            className="py-3 px-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200"
          >
            ÷
          </button>
          
          {['7', '8', '9', '×'].map((btn, i) => (
            <button
              key={i}
              onClick={() => btn === '×' ? handleInput('*') : handleInput(btn)}
              className={`py-3 px-2 rounded-xl transition-all duration-200 ${
                btn === '×' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          
          {['4', '5', '6', '-'].map((btn, i) => (
            <button
              key={i}
              onClick={() => handleInput(btn)}
              className={`py-3 px-2 rounded-xl transition-all duration-200 ${
                btn === '-' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          
          {['1', '2', '3', '+'].map((btn, i) => (
            <button
              key={i}
              onClick={() => handleInput(btn)}
              className={`py-3 px-2 rounded-xl transition-all duration-200 ${
                btn === '+' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          
          <button 
            onClick={() => handleInput('0')} 
            className="py-3 px-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 col-span-2"
          >
            0
          </button>
          <button 
            onClick={() => handleInput('.')} 
            className="py-3 px-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200"
          >
            .
          </button>
          <button 
            onClick={() => setResult(input)} 
            className="py-3 px-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}