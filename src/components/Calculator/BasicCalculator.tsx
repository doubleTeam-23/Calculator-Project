import { useState, useEffect } from 'react';
import { add, subtract, multiply, divide } from '@/lib/mathUtils';
import { cn } from '@/lib/utils';

interface BasicCalculatorProps {
  className?: string;
}

export default function BasicCalculator({ className }: BasicCalculatorProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);

  // 处理数字输入
  const handleDigit = (digit: string) => {
    if (waitingForNewNumber) {
      setDisplayValue(digit);
      setWaitingForNewNumber(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  // 处理小数点
  const handleDecimal = () => {
    if (waitingForNewNumber) {
      setDisplayValue('0.');
      setWaitingForNewNumber(false);
      return;
    }

    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  // 处理运算符
  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForNewNumber) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculateResult();
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForNewNumber(true);
    setOperator(nextOperator);
  };

  // 计算结果
  const calculateResult = (): number => {
    if (firstOperand === null || operator === null) {
      return parseFloat(displayValue);
    }

    const inputValue = parseFloat(displayValue);
    let result = 0;

    switch (operator) {
      case '+':
        result = add(firstOperand, inputValue);
        break;
      case '-':
        result = subtract(firstOperand, inputValue);
        break;
      case '×':
        result = multiply(firstOperand, inputValue);
        break;
      case '÷':
        result = divide(firstOperand, inputValue);
        break;
      default:
        return inputValue;
    }

    return result;
  };

  // 处理等号
  const handleEquals = () => {
    const result = calculateResult();
    setDisplayValue(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForNewNumber(true);
  };

  // 重置计算器
  const handleClear = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForNewNumber(false);
  };

  // 处理百分比
  const handlePercentage = () => {
    const inputValue = parseFloat(displayValue);
    setDisplayValue(String(inputValue / 100));
    setWaitingForNewNumber(true);
  };

  // 处理正负号
  const handleSignChange = () => {
    const inputValue = parseFloat(displayValue);
    setDisplayValue(String(-inputValue));
  };

  // 计算器按钮布局
  const calculatorButtons = [
    [
      { label: 'C', action: handleClear, className: 'bg-red-500 hover:bg-red-600' },
      { label: '±', action: handleSignChange, className: 'bg-gray-500 hover:bg-gray-600' },
      { label: '%', action: handlePercentage, className: 'bg-gray-500 hover:bg-gray-600' },
      { label: '÷', action: () => handleOperator('÷'), className: 'bg-orange-500 hover:bg-orange-600' },
    ],
    [
      { label: '7', action: () => handleDigit('7') },
      { label: '8', action: () => handleDigit('8') },
      { label: '9', action: () => handleDigit('9') },
      { label: '×', action: () => handleOperator('×'), className: 'bg-orange-500 hover:bg-orange-600' },
    ],
    [
      { label: '4', action: () => handleDigit('4') },
      { label: '5', action: () => handleDigit('5') },
      { label: '6', action: () => handleDigit('6') },
      { label: '-', action: () => handleOperator('-'), className: 'bg-orange-500 hover:bg-orange-600' },
    ],
    [
      { label: '1', action: () => handleDigit('1') },
      { label: '2', action: () => handleDigit('2') },
      { label: '3', action: () => handleDigit('3') },
      { label: '+', action: () => handleOperator('+'), className: 'bg-orange-500 hover:bg-orange-600' },
    ],
    [
      { label: '0', action: () => handleDigit('0'), className: 'col-span-2' },
      { label: '.', action: handleDecimal },
      { label: '=', action: handleEquals, className: 'bg-green-500 hover:bg-green-600' },
    ],
  ];

  return (
    <div className={cn('w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      {/* 显示区域 */}
      <div className="bg-gray-900 p-6">
        <div className="text-right text-white text-4xl font-light h-16 flex items-end justify-end">
          {displayValue}
        </div>
      </div>
      
      {/* 按钮区域 */}
      <div className="p-4 grid grid-cols-4 gap-4">
        {calculatorButtons.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map((button, buttonIndex) => (
              <button
                key={buttonIndex}
                onClick={button.action}
                className={cn(
                  'flex-1 py-4 px-4 rounded-xl text-white text-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95',
                  button.className || 'bg-gray-700 hover:bg-gray-600',
                  button.className === 'col-span-2' ? 'col-span-2' : ''
                )}
              >
                {button.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}