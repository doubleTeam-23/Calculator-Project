import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CalculusPanelProps {
  className?: string;
}

// 简单的求导函数（模拟实现，实际应用中应使用专业的数学表达式解析库）
const differentiate = (expression: string, variable: string = 'x'): string => {
  // 移除空白字符
  const expr = expression.replace(/\s+/g, '');
  
  // 简单表达式求导规则
  if (expr === variable) return '1';
  if (expr.match(/^\d+$/)) return '0'; // 常数的导数为0
  
  // 处理幂函数 x^n
  const powerMatch = expr.match(/^([a-zA-Z])\^(\d+)$/);
  if (powerMatch && powerMatch[1] === variable) {
    const n = parseInt(powerMatch[2]);
    if (n === 1) return '1';
    if (n === 0) return '0';
    return `${n}${variable}^${n-1}`;
  }
  
  // 处理常数乘以变量 c*x
  const linearMatch = expr.match(/^(\d+)\*?([a-zA-Z])$/);
  if (linearMatch && linearMatch[2] === variable) {
    return linearMatch[1];
  }
  
  // 处理常数乘以幂函数 c*x^n
  const termMatch = expr.match(/^(\d+)\*?([a-zA-Z])\^(\d+)$/);
  if (termMatch && termMatch[2] === variable) {
    const c = parseInt(termMatch[1]);
    const n = parseInt(termMatch[3]);
    if (n === 1) return c.toString();
    return `${c*n}${variable}^${n-1}`;
  }
  
  // 处理正弦函数 sin(x)
  if (expr.match(/^sin\(([a-zA-Z])\)$/) && RegExp.$1 === variable) {
    return `cos(${variable})`;
  }
  
  // 处理余弦函数 cos(x)
  if (expr.match(/^cos\(([a-zA-Z])\)$/) && RegExp.$1 === variable) {
    return `-sin(${variable})`;
  }
  
  // 处理简单加法
  if (expr.includes('+')) {
    const terms = expr.split('+');
    return terms.map(term => differentiate(term, variable)).join('+');
  }
  
  // 处理简单减法
  if (expr.includes('-') && !expr.startsWith('-')) {
    const terms = expr.split('-');
    return terms[0] ? differentiate(terms[0], variable) : '' 
      + terms.slice(1).map(term => '-' + differentiate(term, variable)).join('');
  }
  
  // 无法识别的表达式
  return '无法计算导数，请使用简单表达式（如 x^2, 3*x^3, sin(x), cos(x) 等）';
};

// 简单的积分函数（模拟实现）
const integrate = (expression: string, variable: string = 'x'): string => {
  // 移除空白字符
  const expr = expression.replace(/\s+/g, '');
  
  // 简单表达式积分规则
  if (expr === variable) return `(${variable}^2)/2 + C`;
  if (expr.match(/^\d+$/)) return `${expr}*${variable} + C`; // 常数的积分
  
  // 处理幂函数 x^n
  const powerMatch = expr.match(/^([a-zA-Z])\^(\d+)$/);
  if (powerMatch && powerMatch[1] === variable) {
    const n = parseInt(powerMatch[2]);
    if (n === -1) return `ln|${variable}| + C`;
    return `(${variable}^${n+1})/${n+1} + C`;
  }
  
  // 处理常数乘以变量 c*x
  const linearMatch = expr.match(/^(\d+)\*?([a-zA-Z])$/);
  if (linearMatch && linearMatch[2] === variable) {
    const c = linearMatch[1];
    return `(${c}*${variable}^2)/2 + C`;
  }
  
  // 处理常数乘以幂函数 c*x^n
  const termMatch = expr.match(/^(\d+)\*?([a-zA-Z])\^(\d+)$/);
  if (termMatch && termMatch[2] === variable) {
    const c = termMatch[1];
    const n = parseInt(termMatch[3]);
    if (n === -1) return `${c}*ln|${variable}| + C`;
    return `(${c}*${variable}^${n+1})/${n+1} + C`;
  }
  
  // 处理正弦函数 sin(x)
  if (expr.match(/^sin\(([a-zA-Z])\)$/) && RegExp.$1 === variable) {
    return `-cos(${variable}) + C`;
  }
  
  // 处理余弦函数 cos(x)
  if (expr.match(/^cos\(([a-zA-Z])\)$/) && RegExp.$1 === variable) {
    return `sin(${variable}) + C`;
  }
  
  // 处理简单加法
  if (expr.includes('+')) {
    const terms = expr.split('+');
    return terms.map(term => integrate(term, variable)).join(' + ').replace(/ \+ C \+ /g, ' + ').replace(/ \+ C$/, ' + C');
  }
  
  // 无法识别的表达式
  return '无法计算积分，请使用简单表达式（如 x^2, 3*x^3, sin(x), cos(x) 等）';
};

export default function CalculusPanel({ className }: CalculusPanelProps) {
  const [calculusType, setCalculusType] = useState<'derivative' | 'integral'>('derivative');
  const [expression, setExpression] = useState('x^2');
  const [variable, setVariable] = useState('x');
  const [result, setResult] = useState<string | null>(null);
  
  // 执行微积分计算
  const calculate = () => {
    if (!expression.trim()) {
      setResult('请输入有效的数学表达式');
      return;
    }
    
    try {
      if (calculusType === 'derivative') {
        const derivative = differentiate(expression, variable);
        setResult(`d/d${variable} (${expression}) = ${derivative}`);
      } else {
        const integral = integrate(expression, variable);
        setResult(`∫ ${expression} d${variable} = ${integral}`);
      }
    } catch (error) {
      setResult('计算错误，请检查表达式格式');
    }
  };
  
  return (
    <div className={cn('w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      <div className="p-4 bg-gray-900">
        <h3 className="text-white text-xl font-semibold text-center">微积分计算</h3>
      </div>
      
      {/* 微积分类型选择 */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setCalculusType('derivative')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              calculusType === 'derivative'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            求导
          </button>
          <button
            onClick={() => setCalculusType('integral')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              calculusType === 'integral'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            积分
          </button>
        </div>
      </div>
      
      {/* 输入区域 */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              {calculusType === 'derivative' ? '求导表达式' : '积分表达式'}
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={calculusType === 'derivative' ? '例如: x^2, sin(x), 3*x^3' : '例如: x^2, sin(x), 3*x^3'}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">变量</label>
            <input
              type="text"
              value={variable}
              onChange={(e) => setVariable(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="x"
              maxLength={1}
            />
          </div>
        </div>
        
        {/* 计算按钮 */}
        <button
          onClick={calculate}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-lg font-medium"
        >
          {calculusType === 'derivative' ? '计算导数' : '计算积分'}
        </button>
        
        {/* 结果显示 */}
        {result && (
          <div className="mt-6 p-4 bg-gray-900 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">计算结果:</p>
            <p className="text-white text-xl font-light text-center">{result}</p>
          </div>
        )}
        
        {/* 使用说明 */}
        <div className="mt-6 p-4 bg-gray-900 rounded-xl text-xs text-gray-400">
          <p className="mb-2 font-medium text-gray-300">支持的表达式格式:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>幂函数: x^2, x^3</li>
            <li>常数乘积: 3*x, 5*x^2</li>
            <li>三角函数: sin(x), cos(x)</li>
            <li>简单加减: x^2+3*x, x^3-2*x</li>
          </ul>
        </div>
      </div>
    </div>
  );
}