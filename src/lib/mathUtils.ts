import { toast } from 'sonner';

// 基础数学运算
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    toast.error('除数不能为零');
    return NaN;
  }
  return a / b;
};

// 高级数学函数
export const factorial = (n: number): number => {
  if (n < 0) {
    toast.error('阶乘仅适用于非负整数');
    return NaN;
  }
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

export const power = (base: number, exponent: number): number => {
  return Math.pow(base, exponent);
};

export const squareRoot = (n: number): number => {
  if (n < 0) {
    toast.error('平方根仅适用于非负数');
    return NaN;
  }
  return Math.sqrt(n);
};

export const reciprocal = (n: number): number => {
  if (n === 0) {
    toast.error('无法计算零的倒数');
    return NaN;
  }
  return 1 / n;
};

// 三角函数（输入为弧度）
export const sin = (x: number): number => Math.sin(x);
export const cos = (x: number): number => Math.cos(x);
export const tan = (x: number): number => {
  const result = Math.tan(x);
  if (Math.abs(result) > 1e15) {
    toast.error('正切函数在此点无定义');
    return NaN;
  }
  return result;
};

export const cotan = (x: number): number => {
  const tanValue = Math.tan(x);
  if (Math.abs(tanValue) < 1e-15 || Math.abs(tanValue) > 1e15) {
    toast.error('余切函数在此点无定义');
    return NaN;
  }
  return 1 / tanValue;
};

// 温度转换（摄氏度与华氏度）
export const celsiusToFahrenheit = (c: number): number => (c * 9/5) + 32;
export const fahrenheitToCelsius = (f: number): number => (f - 32) * 5/9;

// BMI计算
export const calculateBMI = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) {
    toast.error('身高和体重必须为正数');
    return NaN;
  }
  const heightInMeters = height / 100; // 转换为米
  return weight / (heightInMeters * heightInMeters);
};

// 获取BMI分类
export const getBMICategory = (bmi: number): string => {
  if (isNaN(bmi)) return '无效数据';
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '超重';
  return '肥胖';
};

// 简单的一元一次方程求解 (ax + b = 0)
export const solveLinearEquation = (a: number, b: number): number | null => {
  if (a === 0) {
    if (b === 0) {
      toast.info('方程有无数解');
      return null;
    } else {
      toast.info('方程无解');
      return null;
    }
  }
  return -b / a;
};

// 一元二次方程求解 (ax² + bx + c = 0)
export const solveQuadraticEquation = (a: number, b: number, c: number): { x1: number, x2: number } | null => {
  if (a === 0) {
    toast.error('这不是二次方程');
    return null;
  }
  
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant < 0) {
    toast.info('方程无实根');
    return null;
  } else if (discriminant === 0) {
    const x = -b / (2 * a);
    return { x1: x, x2: x };
  } else {
    const sqrtDiscriminant = Math.sqrt(discriminant);
    return {
      x1: (-b + sqrtDiscriminant) / (2 * a),
      x2: (-b - sqrtDiscriminant) / (2 * a)
    };
  }
};

// 简单的进制转换
export const decimalToBinary = (num: number): string => {
  if (num < 0) return '-' + decimalToBinary(-num);
  if (num === 0) return '0';
  
  let binary = '';
  let n = Math.floor(num);
  
  while (n > 0) {
    binary = (n % 2) + binary;
    n = Math.floor(n / 2);
  }
  
  return binary;
};

export const decimalToHex = (num: number): string => {
  if (num < 0) return '-' + decimalToHex(-num);
  if (num === 0) return '0';
  
  const hexDigits = '0123456789ABCDEF';
  let hex = '';
  let n = Math.floor(num);
  
  while (n > 0) {
    hex = hexDigits[n % 16] + hex;
    n = Math.floor(n / 16);
  }
  
  return hex;
};

export const binaryToDecimal = (binary: string): number => {
  if (!/^[01]+$/.test(binary)) {
    toast.error('无效的二进制数');
    return NaN;
  }
  
  return parseInt(binary, 2);
};

export const hexToDecimal = (hex: string): number => {
  if (!/^[0-9A-Fa-f]+$/.test(hex)) {
    toast.error('无效的十六进制数');
    return NaN;
  }
  
  return parseInt(hex, 16);
};

// 模拟汇率转换（使用固定汇率，实际应用中应从API获取）
const EXCHANGE_RATE = {
  CNY_TO_USD: 0.14, // 1人民币 = 0.14美元（模拟数据）
  USD_TO_CNY: 7.15  // 1美元 = 7.15人民币（模拟数据）
};

export const cnyToUsd = (amount: number): number => {
  if (amount < 0) {
    toast.error('金额不能为负数');
    return NaN;
  }
  return amount * EXCHANGE_RATE.CNY_TO_USD;
};

export const usdToCny = (amount: number): number => {
  if (amount < 0) {
    toast.error('金额不能为负数');
    return NaN;
  }
  return amount * EXCHANGE_RATE.USD_TO_CNY;
};