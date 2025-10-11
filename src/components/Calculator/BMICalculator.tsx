import { useState } from 'react';
import { calculateBMI, getBMICategory } from '@/lib/mathUtils';
import { cn } from '@/lib/utils';

interface BMICalculatorProps {
  className?: string;
}

// 根据BMI推荐衣服尺码（简化版）
const getSizeRecommendation = (bmi: number, height: number): string => {
  // 身高转换为米
  const heightInMeters = height / 100;
  
  // BMI和身高综合考虑的简单尺码推荐逻辑
  if (bmi < 18.5) {
    return heightInMeters < 1.65 ? 'S' : 'M';
  } else if (bmi < 24) {
    return heightInMeters < 1.65 ? 'M' : heightInMeters < 1.75 ? 'L' : 'XL';
  } else if (bmi < 28) {
    return heightInMeters < 1.65 ? 'L' : heightInMeters < 1.75 ? 'XL' : 'XXL';
  } else {
    return heightInMeters < 1.65 ? 'XL' : heightInMeters < 1.75 ? 'XXL' : 'XXXL';
  }
};

export default function BMICalculator({ className }: BMICalculatorProps) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const [sizeRecommendation, setSizeRecommendation] = useState<string | null>(null);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // 计算BMI
  const handleCalculate = () => {
    try {
      let heightValue = parseFloat(height);
      let weightValue = parseFloat(weight);
      
      if (isNaN(heightValue) || isNaN(weightValue) || heightValue <= 0 || weightValue <= 0) {
        setBmiResult(null);
        setBmiCategory('请输入有效的身高和体重');
        setSizeRecommendation(null);
        return;
      }
      
      // 如果是英制单位，转换为公制
      if (unitSystem === 'imperial') {
        // 英寸转厘米
        heightValue = heightValue * 2.54;
        // 磅转千克
        weightValue = weightValue * 0.453592;
      }
      
      const bmi = calculateBMI(heightValue, weightValue);
      const category = getBMICategory(bmi);
      const size = getSizeRecommendation(bmi, heightValue);
      
      setBmiResult(bmi);
      setBmiCategory(category);
      setSizeRecommendation(size);
    } catch (error) {
      setBmiResult(null);
      setBmiCategory('计算错误');
      setSizeRecommendation(null);
    }
  };
  
  return (
    <div className={cn('w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      <div className="p-4 bg-gray-900">
        <h3 className="text-white text-xl font-semibold text-center">BMI计算器</h3>
      </div>
      
      {/* 单位系统选择 */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              unitSystem === 'metric'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            公制 (cm/kg)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${unitSystem === 'imperial'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            英制 (in/lbs)
          </button>
        </div>
      </div>
      
      {/* 输入区域 */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              身高 ({unitSystem === 'metric' ? '厘米' : '英寸'})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`输入身高${unitSystem === 'metric' ? '(cm)' : '(in)'}`}
              min="0"
              step={unitSystem === 'metric' ? "0.1" : "0.01"}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              体重 ({unitSystem === 'metric' ? '千克' : '磅'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`输入体重${unitSystem === 'metric' ? '(kg)' : '(lbs)'}`}
              min="0"
              step={unitSystem === 'metric' ? "0.1" : "0.01"}
            />
          </div>
        </div>
        
        {/* 计算按钮 */}
        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-lg font-medium"
        >
          计算BMI
        </button>
        
        {/* 结果显示 */}
        {(bmiResult !== null || bmiCategory) && (
          <div className="mt-6 space-y-4">
            {bmiResult !== null && (
              <div className="p-4 bg-gray-900 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">您的BMI值:</p>
                <p className="text-white text-3xl font-light text-center">{bmiResult.toFixed(1)}</p>
              </div>
            )}
            
            {bmiCategory && (
              <div className="p-4 bg-gray-900 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">身体质量分类:</p>
                <p className="text-white text-xl font-light text-center">{bmiCategory}</p>
              </div>
            )}
            
            {sizeRecommendation && (
              <div className="p-4 bg-gray-900 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">推荐衣服尺码:</p>
                <p className="text-white text-2xl font-light text-center">{sizeRecommendation}</p>
              </div>
            )}
          </div>
        )}
        
        {/* BMI参考标准 */}
        <div className="mt-6 p-4 bg-gray-900 rounded-xl text-xs text-gray-400">
          <p className="text-center mb-2 font-medium text-gray-300">BMI参考标准</p>
          <div className="grid grid-cols-2 gap-2">
            <div>偏瘦: &lt; 18.5</div>
            <div>正常: 18.5 - 23.9</div>
            <div>超重: 24 - 27.9</div>
            <div>肥胖: ≥ 28</div>
          </div>
        </div>
      </div>
    </div>
  );
}