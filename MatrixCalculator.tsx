import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MatrixCalculatorProps {
  className?: string;
}

// 矩阵类型定义
type Matrix = number[][];

// 矩阵运算工具函数
const matrixOperations = {
  // 创建空矩阵
  createEmptyMatrix: (rows: number, cols: number): Matrix => 
    Array.from({ length: rows }, () => Array(cols).fill(0)),
  
  // 矩阵加法
  add: (a: Matrix, b: Matrix): Matrix | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) return null;
    
    return a.map((row, i) => 
      row.map((val, j) => val + b[i][j])
    );
  },
  
  // 矩阵减法
  subtract: (a: Matrix, b: Matrix): Matrix | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) return null;
    
    return a.map((row, i) => 
      row.map((val, j) => val - b[i][j])
    );
  },
  
  // 矩阵乘法
  multiply: (a: Matrix, b: Matrix): Matrix | null => {
    if (a[0].length !== b.length) return null;
    
    const result: Matrix = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  },
  
  // 矩阵转置
  transpose: (matrix: Matrix): Matrix => {
    return matrix[0].map((_, colIndex) => 
      matrix.map(row => row[colIndex])
    );
  },
  
  // 计算矩阵的行列式（仅适用于方阵）
  determinant: (matrix: Matrix): number | null => {
    const n = matrix.length;
    if (n === 0 || matrix.some(row => row.length !== n)) return null;
    
    // 基础情况：1x1矩阵
    if (n === 1) return matrix[0][0];
    
    let det = 0;
    
    // 使用第一行展开计算行列式
    for (let j = 0; j < n; j++) {
      // 创建余子式矩阵
      const minor: Matrix = [];
      for (let i = 1; i < n; i++) {
        const minorRow: number[] = [];
        for (let k = 0; k < n; k++) {
          if (k !== j) minorRow.push(matrix[i][k]);
        }
        minor.push(minorRow);
      }
      
      // 递归计算行列式
      const sign = (-1) ** j;
      const minorDet = matrixOperations.determinant(minor);
      if (minorDet === null) return null;
      
      det += sign * matrix[0][j] * minorDet;
    }
    
    return det;
  },
  
  // 矩阵求逆（仅适用于方阵且行列式不为零）
  inverse: (matrix: Matrix): Matrix | null => {
    const n = matrix.length;
    if (n === 0 || matrix.some(row => row.length !== n)) return null;
    
    // 计算行列式
    const det = matrixOperations.determinant(matrix);
    if (det === null || det === 0) return null;
    
    // 创建增广矩阵 [A|I]
    const augmented: Matrix = [];
    for (let i = 0; i < n; i++) {
      augmented[i] = [...matrix[i]];
      for (let j = 0; j < n; j++) {
        augmented[i].push(i === j ? 1 : 0);
      }
    }
    
    // 高斯-约当消元法求逆矩阵
    for (let i = 0; i < n; i++) {
      // 找到主元行
      let pivotRow = i;
      for (let j = i; j < n; j++) {
        if (Math.abs(augmented[j][i]) > Math.abs(augmented[pivotRow][i])) {
          pivotRow = j;
        }
      }
      
      // 交换主元行与当前行
      [augmented[i], augmented[pivotRow]] = [augmented[pivotRow], augmented[i]];
      
      // 归一化主元行
      const pivot = augmented[i][i];
      if (pivot === 0) return null; // 矩阵不可逆
      
      for (let j = i; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      // 消去其他行
      for (let j = 0; j < n; j++) {
        if (j !== i && augmented[j][i] !== 0) {
          const factor = augmented[j][i];
          for (let k = i; k < 2 * n; k++) {
            augmented[j][k] -= factor * augmented[i][k];
          }
        }
      }
    }
    
    // 提取逆矩阵（增广矩阵的右侧部分）
    const inverseMatrix: Matrix = [];
    for (let i = 0; i < n; i++) {
      inverseMatrix[i] = augmented[i].slice(n);
    }
    
    return inverseMatrix;
  }
};

export default function MatrixCalculator({ className }: MatrixCalculatorProps) {
  const [matrixType, setMatrixType] = useState<'single' | 'double'>('single');
  const [operation, setOperation] = useState<'transpose' | 'inverse' | 'add' | 'subtract' | 'multiply'>('transpose');
  const [matrixSize, setMatrixSize] = useState({ rows: 2, cols: 2 });
  const [matrixASize, setMatrixASize] = useState({ rows: 2, cols: 2 });
  const [matrixBSize, setMatrixBSize] = useState({ rows: 2, cols: 2 });
  const [matrixA, setMatrixA] = useState<Matrix>(matrixOperations.createEmptyMatrix(2, 2));
  const [matrixB, setMatrixB] = useState<Matrix>(matrixOperations.createEmptyMatrix(2, 2));
  const [result, setResult] = useState<Matrix | string | null>(null);
  
  // 更新矩阵A的大小
  const handleMatrixASizeChange = (rows: number, cols: number) => {
    setMatrixASize({ rows, cols });
    setMatrixA(matrixOperations.createEmptyMatrix(rows, cols));
    setResult(null);
  };
  
  // 更新矩阵B的大小
  const handleMatrixBSizeChange = (rows: number, cols: number) => {
    setMatrixBSize({ rows, cols });
    setMatrixB(matrixOperations.createEmptyMatrix(rows, cols));
    setResult(null);
  };
  
  // 更新矩阵A的值
  const handleMatrixAChange = (i: number, j: number, value: string) => {
    const newMatrix = [...matrixA];
    newMatrix[i] = [...newMatrix[i]];
    newMatrix[i][j] = parseFloat(value) || 0;
    setMatrixA(newMatrix);
    setResult(null);
  };
  
  // 更新矩阵B的值
  const handleMatrixBChange = (i: number, j: number, value: string) => {
    const newMatrix = [...matrixB];
    newMatrix[i] = [...newMatrix[i]];
    newMatrix[i][j] = parseFloat(value) || 0;
    setMatrixB(newMatrix);
    setResult(null);
  };
  
  // 执行矩阵运算
  const performOperation = () => {
    try {
      setResult(null);
      
      switch (operation) {
        case 'transpose':
          const transposed = matrixOperations.transpose(matrixA);
          setResult(transposed);
          break;
          
        case 'inverse':
          const inverse = matrixOperations.inverse(matrixA);
          if (inverse === null) {
            setResult('矩阵不可逆或不是方阵');
          } else {
            setResult(inverse);
          }
          break;
          
        case 'add':
          if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            setResult('矩阵维度不匹配，无法相加');
            return;
          }
          const sum = matrixOperations.add(matrixA, matrixB);
          setResult(sum || '无法计算');
          break;
          
        case 'subtract':
          if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            setResult('矩阵维度不匹配，无法相减');
            return;
          }
          const difference = matrixOperations.subtract(matrixA, matrixB);
          setResult(difference || '无法计算');
          break;
          
        case 'multiply':
          if (matrixA[0].length !== matrixB.length) {
            setResult('矩阵维度不匹配，无法相乘');
            return;
          }
          const product = matrixOperations.multiply(matrixA, matrixB);
          setResult(product || '无法计算');
          break;
      }
    } catch (error) {
      setResult('计算错误，请检查输入');
    }
  };
  
  // 渲染矩阵输入表格
  const renderMatrixInput = (
    matrix: Matrix, 
    onChange: (i: number, j: number, value: string) => void, 
    size: { rows: number; cols: number }
  ) => {
    return (
      <div className="grid grid-cols-{size.cols} gap-2">
        {Array.from({ length: size.rows }).map((_, i) => (
          Array.from({ length: size.cols }).map((_, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={matrix[i][j] || ''}
              onChange={(e) => onChange(i, j, e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="any"
            />
          ))
        ))}
      </div>
    );
  };
  
  // 渲染矩阵结果
  const renderMatrixResult = (matrix: Matrix) => {
    return (
      <div className="grid grid-cols-{matrix[0]?.length || 1} gap-2">
        {matrix.map((row, i) => (
          row.map((val, j) => (
            <div 
              key={`result-${i}-${j}`}
              className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-center"
            >
              {val.toFixed(2)}
            </div>
          ))
        ))}
      </div>
    );
  };
  
  return (
    <div className={cn('w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      <div className="p-4 bg-gray-900">
        <h3 className="text-white text-xl font-semibold text-center">矩阵计算</h3>
      </div>
      
      {/* 矩阵类型选择 */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setMatrixType('single');
              setOperation('transpose');
            }}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              matrixType === 'single'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            单个矩阵
          </button>
          <button
            onClick={() => {
              setMatrixType('double');
              setOperation('add');
            }}
            className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
              matrixType === 'double'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            两个矩阵
          </button>
        </div>
      </div>
      
      {/* 操作选择 */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        {matrixType === 'single' ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOperation('transpose')}
              className={`py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                operation === 'transpose'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              转置矩阵
            </button>
            <button
              onClick={() => setOperation('inverse')}
              className={`py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                operation === 'inverse'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              逆矩阵
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOperation('add')}
              className={`py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                operation === 'add'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              矩阵加法
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={`py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                operation === 'subtract'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              矩阵减法
            </button>
            <button
              onClick={() => setOperation('multiply')}
              className={`py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                operation === 'multiply'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              矩阵乘法
            </button>
          </div>
        )}
      </div>
      
      {/* 矩阵输入区域 */}
      <div className="p-6 space-y-6">
        {/* 单个矩阵操作 */}
        {matrixType === 'single' && (
          <div className="space-y-6">
            {/* 矩阵大小选择 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">矩阵大小</label>
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">行数</label>
                  <select
                    value={matrixASize.rows}
                    onChange={(e) => handleMatrixASizeChange(parseInt(e.target.value), matrixASize.cols)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">列数</label>
                  <select
                    value={matrixASize.cols}
                    onChange={(e) => handleMatrixASizeChange(matrixASize.rows, parseInt(e.target.value))}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* 矩阵A输入 */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">矩阵A</label>
              {renderMatrixInput(matrixA, handleMatrixAChange, matrixASize)}
            </div>
          </div>
        )}
        
        {/* 两个矩阵操作 */}
        {matrixType === 'double' && (
          <div className="space-y-8">
            {/* 矩阵A */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm text-gray-400">矩阵A</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={matrixASize.rows}
                    onChange={(e) => handleMatrixASizeChange(parseInt(e.target.value), matrixASize.cols)}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}行</option>
                    ))}
                  </select>
                  <select
                    value={matrixASize.cols}
                    onChange={(e) => handleMatrixASizeChange(matrixASize.rows, parseInt(e.target.value))}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}列</option>
                    ))}
                  </select>
                </div>
              </div>
              {renderMatrixInput(matrixA, handleMatrixAChange, matrixASize)}
            </div>
            
            {/* 操作符 */}
            <div className="text-center">
              <span className="text-white text-xl font-bold">
                {operation === 'add' && '+'}
                {operation === 'subtract' && '-'}
                {operation === 'multiply' && '×'}
              </span>
            </div>
            
            {/* 矩阵B */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm text-gray-400">矩阵B</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={matrixBSize.rows}
                    onChange={(e) => handleMatrixBSizeChange(parseInt(e.target.value), matrixBSize.cols)}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}行</option>
                    ))}
                  </select>
                  <select
                    value={matrixBSize.cols}
                    onChange={(e) => handleMatrixBSizeChange(matrixBSize.rows, parseInt(e.target.value))}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}列</option>
                    ))}
                  </select>
                </div>
              </div>
              {renderMatrixInput(matrixB, handleMatrixBChange, matrixBSize)}
            </div>
          </div>
        )}
        
        {/* 计算按钮 */}
        <div>
          <button
            onClick={performOperation}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-lg font-medium"
          >
            {matrixType === 'single' 
              ? operation === 'transpose' ? '计算转置矩阵' : '计算逆矩阵'
              : operation === 'add' ? '矩阵相加' : operation === 'subtract' ? '矩阵相减' : '矩阵相乘'
            }
          </button>
        </div>
        
        {/* 结果显示 */}
        {result !== null && (
          <div className="mt-6">
            <label className="block text-sm text-gray-400 mb-3">计算结果</label>
            {Array.isArray(result) 
              ? renderMatrixResult(result) 
              : (
                <div className="p-4 bg-gray-900 rounded-xl text-center">
                  <p className="text-white text-lg">{result}</p>
                </div>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
}