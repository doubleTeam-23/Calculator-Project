import { useState } from 'react';
import { evaluate } from 'mathjs';
import { cn } from '@/lib/utils';
import {
  sin as sinUtil,
  cos as cosUtil,
  tan as tanUtil,
  factorial as factorialUtil,
  power as powerUtil,
  squareRoot as squareRootUtil,
  reciprocal as reciprocalUtil
} from '@/lib/mathUtils';

interface AdvancedCalculatorProps {
  className?: string;
}

export default function AdvancedCalculator({ className }: AdvancedCalculatorProps) {
  const [input, setInput] = useState(''); // 当前编辑的表达式/输入
  const [result, setResult] = useState<string | null>(null); // 计算结果（字符串）
  const [lastExpression, setLastExpression] = useState<string | null>(null); // 上一次按 = 的表达式（用于显示）
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg'); // 角度模式
  const [justComputed, setJustComputed] = useState(false); // 刚完成一次计算

  // 辅助：把内部显示数值格式化为合适字符串
  const formatNumber = (num: number): string => {
    if (!isFinite(num) || isNaN(num)) return 'NaN';
    // 整数直接显示，非整数保留最多 6 位小数并去掉尾部多余 0
    if (Math.abs(Math.round(num) - num) < 1e-12) return String(Math.round(num));
    return parseFloat(num.toFixed(6)).toString();
  };

  // 将用户输入的表达式转换为 mathjs 可识别的形式
  const sanitizeExpressionForEval = (expr: string): string => {
    if (!expr) return expr;
    let e = String(expr);
    e = e.replace(/×/g, '*').replace(/÷/g, '/');
    // 支持上标 ²、³ 等（仅处理常见的 ²）
    e = e.replace(/²/g, '^2');
    // 将中文全角符号或其他可能的隐式乘法尝试补上 *（例如 2x -> 2*x, )( -> )*( ）
    e = e.replace(/(\d)\s*([a-zA-Zπ(])/g, (_, a, b) => `${a}*${b}`);
    e = e.replace(/\)\s*\(/g, ')*(');
    // 将 π 替换为 mathjs 的 pi
    e = e.replace(/π/g, 'pi');
    // 将百分号 % 解释为除以 100（常见计算器行为）
    // 为避免误替换 e.g. "50%+30" -> "50/100+30"
    e = e.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    return e;
  };

  // 评估表达式，返回 number 或 null（出错）
  const evaluateExpressionValue = (expr: string): number | null => {
    try {
      const sanitized = sanitizeExpressionForEval(expr);
      const val = evaluate(sanitized);
      const num = Number(val);
      if (!isFinite(num) || isNaN(num)) return null;
      return num;
    } catch (err) {
      return null;
    }
  };

  // 当点击数字/运算符等进行输入时的处理（智能链式行为）
  const handleInput = (value: string) => {
    const isOperator = /^[+\-*/%]$/.test(value);
    const isDigitOrDotOrParen = /^[0-9.]$/.test(value) || value === '(' || value === ')';

    if (justComputed) {
      // 如果刚计算完并且用户按下的是运算符 -> 以结果作为起点进行连算
      if (isOperator) {
        const base = result ?? input ?? '0';
        setInput(`${base}${value}`);
        setJustComputed(false);
        setResult(null); // 继续计算时隐藏旧的 result（但 lastExpression 保留）
        return;
      }
      // 如果刚计算完并按下数字或小数点或括号 -> 覆盖输入，开始新的输入
      if (isDigitOrDotOrParen) {
        setInput(value);
        setJustComputed(false);
        setResult(null);
        setLastExpression(null);
        return;
      }
    }

    // 一般情况：追加输入
    setInput(prev => prev + value);
    setResult(null);
    setJustComputed(false);
  };

  // 清空
  const handleClear = () => {
    setInput('');
    setResult(null);
    setLastExpression(null);
    setJustComputed(false);
  };

  // 退格
  const handleBackspace = () => {
    // 如果刚计算完，退格则清除结果并进入编辑上次表达式（用户体验可调整）
    if (justComputed) {
      setInput(''); // 清掉结果作为输入，用户可以重新输入
      setResult(null);
      setLastExpression(null);
      setJustComputed(false);
      return;
    }
    setInput(prev => prev.slice(0, -1));
  };

  // 执行等号计算：评估当前 input 表达式
  const handleEquals = () => {
    if (!input || input.trim() === '') {
      setResult(null);
      setLastExpression(null);
      setJustComputed(false);
      return;
    }

    const originalExpr = input;
    const value = evaluateExpressionValue(originalExpr);

    if (value === null) {
      setResult('错误');
      setLastExpression(originalExpr);
      setJustComputed(true);
      return;
    }

    const formatted = formatNumber(value);
    setLastExpression(originalExpr); // 上一行显示原始表达式
    setResult(formatted); // 下一行显示结果
    setInput(formatted); // 将结果设为下一轮的输入（链式计算基础）
    setJustComputed(true);
  };

  // 角度模式切换
  const toggleAngleMode = () => {
    setAngleMode(prev => (prev === 'deg' ? 'rad' : 'deg'));
  };

  // 对“即时函数”（sin cos tan 等）进行计算：先评估当前 input（或者直接解析数字），再应用函数
  const calculateTrigFunction = (func: (x: number) => number, label?: string) => {
    const val = evaluateExpressionValue(input);
    if (val === null) {
      setResult('输入无效');
      setLastExpression(null);
      setJustComputed(true);
      return;
    }
    const angle = angleMode === 'deg' ? (val * Math.PI) / 180 : val;
    try {
      const out = func(angle);
      const formatted = formatNumber(out);
      const exprLabel = label ?? `f(${input})`;
      setLastExpression(`${exprLabel}(${input}${angleMode === 'deg' ? '°' : ''})`);
      setResult(formatted);
      setInput(formatted);
      setJustComputed(true);
    } catch {
      setResult('计算错误');
      setJustComputed(true);
    }
  };

  // 阶乘
  const handleFactorial = () => {
    const val = evaluateExpressionValue(input);
    if (val === null || !Number.isInteger(val) || val < 0) {
      setResult('请输入非负整数');
      setJustComputed(true);
      return;
    }
    try {
      const out = factorialUtil(val);
      const formatted = String(out);
      setLastExpression(`${val}!`);
      setResult(formatted);
      setInput(formatted);
      setJustComputed(true);
    } catch {
      setResult('计算错误');
      setJustComputed(true);
    }
  };

  // 平方根
  const handleSquareRoot = () => {
    const val = evaluateExpressionValue(input);
    if (val === null) {
      setResult('输入无效');
      setJustComputed(true);
      return;
    }
    try {
      const out = squareRootUtil(val);
      const formatted = formatNumber(out);
      setLastExpression(`√(${input})`);
      setResult(formatted);
      setInput(formatted);
      setJustComputed(true);
    } catch {
      setResult('计算错误');
      setJustComputed(true);
    }
  };

  // 倒数
  const handleReciprocal = () => {
    const val = evaluateExpressionValue(input);
    if (val === null || val === 0) {
      setResult('输入无效或除以0');
      setJustComputed(true);
      return;
    }
    try {
      const out = reciprocalUtil(val);
      const formatted = formatNumber(out);
      setLastExpression(`1/(${input})`);
      setResult(formatted);
      setInput(formatted);
      setJustComputed(true);
    } catch {
      setResult('计算错误');
      setJustComputed(true);
    }
  };

  // 幂运算（指数）
  const handlePower = (exponent: number) => {
    const val = evaluateExpressionValue(input);
    if (val === null) {
      setResult('输入无效');
      setJustComputed(true);
      return;
    }
    try {
      const out = powerUtil(val, exponent);
      const formatted = formatNumber(out);
      setLastExpression(`(${input})^${exponent}`);
      setResult(formatted);
      setInput(formatted);
      setJustComputed(true);
    } catch {
      setResult('计算错误');
      setJustComputed(true);
    }
  };

  // 快速插入 π 和 e：为了链式计算，我们直接插入 mathjs 可识别的名称 pi（或数值）
  const handleInsertPi = () => {
    // 我们插入 'pi' 让 mathjs 识别，用户也可继续输入运算符
    if (justComputed) {
      // 如果刚计算完，插入运算符前缀时需要覆盖还是追加，按覆盖处理
      setInput('pi');
      setJustComputed(false);
      setResult(null);
      setLastExpression(null);
    } else {
      setInput(prev => prev + 'pi');
    }
  };

  const handleInsertE = () => {
    if (justComputed) {
      setInput('e');
      setJustComputed(false);
      setResult(null);
      setLastExpression(null);
    } else {
      setInput(prev => prev + 'e');
    }
  };

  // 按钮表（把立即计算行为改为触发上面的函数）
  const functionButtons = [
    [
      { label: 'sin', action: () => calculateTrigFunction((x) => sinUtil(x), 'sin') },
      { label: 'cos', action: () => calculateTrigFunction((x) => cosUtil(x), 'cos') },
      { label: 'tan', action: () => calculateTrigFunction((x) => tanUtil(x), 'tan') },
      { label: 'cot', action: () => calculateTrigFunction((x) => 1 / tanUtil(x), 'cot') },
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
      { label: 'eˣ', action: () => {
          // 将 e^x 视作 exp(x)
          const val = evaluateExpressionValue(input);
          if (val === null) { setResult('输入无效'); setJustComputed(true); return; }
          const out = Math.exp(val);
          const formatted = formatNumber(out);
          setLastExpression(`e^(${input})`);
          setResult(formatted);
          setInput(formatted);
          setJustComputed(true);
        } 
      },
    ],
    [
      { label: '(', action: () => handleInput('(') },
      { label: ')', action: () => handleInput(')') },
      { label: 'π', action: handleInsertPi },
      { label: 'e', action: handleInsertE },
    ],
  ];

  // 渲染
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

      {/* 输入和结果显示（如果刚计算完：上一行显示表达式，下一行显示结果并将其作为下一轮输入） */}
      <div className="p-6 bg-gray-900">
        <div className="text-right text-gray-400 text-sm mb-1 h-6">
          {justComputed && lastExpression ? lastExpression : ''}
        </div>
        <div className="text-right text-white text-3xl font-light h-12 flex items-end justify-end break-all">
          {justComputed && result ? result : (input || '0')}
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
            onClick={handleEquals} 
            className="py-3 px-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
