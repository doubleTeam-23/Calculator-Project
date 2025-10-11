import { useState } from 'react';
import { 
  decimalToBinary, decimalToHex, binaryToDecimal, hexToDecimal,
  cnyToUsd, usdToCny
} from '@/lib/mathUtils';
import { cn } from '@/lib/utils';

interface UnitConvertersProps {
  className?: string;
}

export default function UnitConverters({ className }: UnitConvertersProps) {
  const [converterType, setConverterType] = useState<'base' | 'currency'>('base');
  
  // 进制转换状态
  const [baseValue, setBaseValue] = useState('');
  const [baseFrom, setBaseFrom] = useState<'decimal' | 'binary' | 'hex'>('decimal');
  const [baseTo, setBaseTo] = useState<'decimal' | 'binary' | 'hex'>('binary');
  const [baseResult, setBaseResult] = useState<string | null>(null);
  
  // 货币转换状态
  const [currencyValue, setCurrencyValue] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState<'cny' | 'usd'>('cny');
  const [currencyTo, setCurrencyTo] = useState<'cny' | 'usd'>('usd');
  const [currencyResult, setCurrencyResult] = useState<string | null>(null);
  
  // 切换转换器类型
  const toggleConverterType = (type: 'base' | 'currency') => {
    setConverterType(type);
  };
  
  // 执行进制转换
  const convertBase = () => {
    if (!baseValue) {
      setBaseResult('请输入数值');
      return;
    }
    
    try {
      let decimalValue: number;
      
      // 先转换为十进制
      switch (baseFrom) {
        case 'decimal':
          decimalValue = parseInt(baseValue, 10);
          break;
        case 'binary':
          decimalValue = binaryToDecimal(baseValue);
          break;
        case 'hex':
          decimalValue = hexToDecimal(baseValue);
          break;
      }
      
      if (isNaN(decimalValue)) {
        setBaseResult('无效的输入');
        return;
      }
      
      // 再转换为目标进制
      let result: string;
      switch (baseTo) {
        case 'decimal':
          result = decimalValue.toString();
          break;
        case 'binary':
          result = decimalToBinary(decimalValue);
          break;
        case 'hex':
          result = decimalToHex(decimalValue);
          break;
      }
      
      setBaseResult(result);
    } catch (error) {
      setBaseResult('转换错误');
    }
  };
  
  // 执行货币转换
  const convertCurrency = () => {
    if (!currencyValue) {
      setCurrencyResult('请输入金额');
      return;
    }
    
    try {
      const amount = parseFloat(currencyValue);
      
      if (isNaN(amount) || amount < 0) {
        setCurrencyResult('请输入有效的金额');
        return;
      }
      
      let result: number;
      if (currencyFrom === 'cny' && currencyTo === 'usd') {
        result = cnyToUsd(amount);
      } else if (currencyFrom === 'usd' && currencyTo === 'cny') {
        result = usdToCny(amount);
      } else {
        // 相同货币直接返回原值
        result = amount;
      }
      
      setCurrencyResult(result.toFixed(2));
    } catch (error) {
      setCurrencyResult('转换错误');
    }
  };
  
  // 交换转换方向
  const swapBaseDirection = () => {
    setBaseFrom(baseTo);
    setBaseTo(baseFrom);
    setBaseValue(baseResult || '');
    setBaseResult(null);
  };
  
  const swapCurrencyDirection = () => {
    setCurrencyFrom(currencyTo);
    setCurrencyTo(currencyFrom);
    setCurrencyValue(currencyResult || '');
    setCurrencyResult(null);
  };
  
  return (
    <div className={cn('w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      <div className="p-4 bg-gray-900">
        <h3 className="text-white text-xl font-semibold text-center">单位转换</h3>
      </div>
      
      {/* 转换器类型选择 */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => toggleConverterType('base')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              converterType === 'base'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            进制转换
          </button>
          <button
            onClick={() => toggleConverterType('currency')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              converterType === 'currency'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            汇率转换
          </button>
        </div>
      </div>
      
      {/* 进制转换 */}
      {converterType === 'base' && (
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">输入值</label>
              <input
                type="text"
                value={baseValue}
                onChange={(e) => setBaseValue(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`输入${
                  baseFrom === 'decimal' ? '十进制' : 
                  baseFrom === 'binary' ? '二进制' : '十六进制'
                }数字`}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">从</label>
                <select
                  value={baseFrom}
                  onChange={(e) => setBaseFrom(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="decimal">十进制</option>
                  <option value="binary">二进制</option>
                  <option value="hex">十六进制</option>
                </select>
              </div>
              
              <button
                onClick={swapBaseDirection}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
              >
                <i className="fa-solid fa-exchange text-white"></i>
              </button>
              
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">到</label>
                <select
                  value={baseTo}
                  onChange={(e) => setBaseTo(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="decimal">十进制</option>
                  <option value="binary">二进制</option>
                  <option value="hex">十六进制</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 转换按钮 */}
          <button
            onClick={convertBase}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-lg font-medium"
          >
            转换
          </button>
          
          {/* 结果显示 */}
          {baseResult !== null && (
            <div className="p-4 bg-gray-900 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">转换结果:</p>
              <p className="text-white text-2xl font-light text-center">{baseResult}</p>
            </div>
          )}
        </div>
      )}
      
      {/* 货币转换 */}
      {converterType === 'currency' && (
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">金额</label>
              <input
                type="number"
                value={currencyValue}
                onChange={(e) => setCurrencyValue(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入金额"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">从</label>
                <select
                  value={currencyFrom}
                  onChange={(e) => setCurrencyFrom(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cny">人民币 (CNY)</option>
                  <option value="usd">美元 (USD)</option>
                </select>
              </div>
              
              <button
                onClick={swapCurrencyDirection}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
              >
                <i className="fa-solid fa-exchange text-white"></i>
              </button>
              
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">到</label>
                <select
                  value={currencyTo}
                  onChange={(e) => setCurrencyTo(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cny">人民币 (CNY)</option>
                  <option value="usd">美元 (USD)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 转换按钮 */}
          <button
            onClick={convertCurrency}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-lg font-medium"
          >
            转换
          </button>
          
          {/* 结果显示 */}
          {currencyResult !== null && (
            <div className="p-4 bg-gray-900 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">转换结果:</p>
              <p className="text-white text-2xl font-light text-center">
                {currencyResult} {currencyTo === 'cny' ? 'CNY' : 'USD'}
              </p>
            </div>
          )}
          
          {/* 汇率说明 */}
          <div className="text-xs text-gray-400 text-center italic">
            * 汇率仅供参考，使用固定模拟汇率
          </div>
        </div>
      )}
    </div>
  );
}