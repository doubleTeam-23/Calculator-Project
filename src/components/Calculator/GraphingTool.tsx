import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { parse } from 'mathjs';

interface GraphingToolProps {
  className?: string;
}

// ✅ 使用 mathjs 安全解析表达式（支持 ^、sin、cos、exp 等）
//    额外处理：把 '²' 等超脚本替换为 '^2'，自动补 * （如 2x -> 2*x）
const evaluateFunction = (expression: string, x: number): number => {
  try {
    let expr = String(expression).trim();
    expr = expr.replace(/^y\s*=\s*/, '');
    // 把 ² 替换为 ^2，支持用户输入 y=x²
    expr = expr.replace(/²/g, '^2');
    // 补 *：例如 "2x" -> "2*x"
    expr = expr.replace(/(\d)\s*x/g, '$1*x');
    // 解析并求值（mathjs）
    const node = parse(expr);
    const val = node.evaluate({ x });
    return Number(val); // 确保是 JS number
  } catch (err) {
    return NaN;
  }
};

// 生成数据：确保 x,y 为 number，数据已排序
const generateFunctionData = (
  expression: string,
  start: number = -10,
  end: number = 10,
  steps: number = 1000
): { x: number; y: number }[] => {
  const data: { x: number; y: number }[] = [];
  const stepSize = (end - start) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = start + i * stepSize;
    const y = evaluateFunction(expression, x);
    if (!isNaN(y) && isFinite(y) && Math.abs(y) < 1e6) {
      data.push({ x: Number(x), y: Number(y) });
    }
  }
  // 保证按 x 升序（虽然生成时已升序，但以防万一）
  data.sort((a, b) => a.x - b.x);
  return data;
};

export default function GraphingTool({ className }: GraphingToolProps) {
  const [expression, setExpression] = useState('y=x^2');
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const graphRef = useRef<HTMLDivElement>(null);

  const generateGraph = () => {
    setError(null);
    try {
      const start = -10 / zoom;
      const end = 10 / zoom;
      const newData = generateFunctionData(expression, start, end, 1200); // 采样数可调
      setData(newData);
    } catch (err) {
      setError('无法解析函数表达式，请检查输入格式');
    }
  };

  useEffect(() => {
    const t = setTimeout(generateGraph, 300);
    return () => clearTimeout(t);
  }, [expression, zoom]);

  return (
    <div className={cn('w-full max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden', className)}>
      <div className="p-4 bg-gray-900">
        <h3 className="text-white text-xl font-semibold text-center">函数图像绘制</h3>
      </div>

      <div className="p-4 border-b border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="输入函数，例如 y=x^2 或 y=sin(x)"
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <button onClick={generateGraph} className="px-4 py-3 bg-blue-500 text-white rounded-lg">绘制</button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-gray-400 text-sm">缩放:</div>
          <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-48" />
        </div>
        {error && <div className="mt-2 text-red-500 text-sm text-center">{error}</div>}
      </div>

      <div ref={graphRef} className="p-4 h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            {/* <-- 关键：把 X 轴指定为数值轴 */}
            <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} stroke="#9CA3AF" />
            {/* Y 轴使用自动域，确保显示完整抛物线 */}
            <YAxis type="number" domain={['auto', 'auto']} stroke="#9CA3AF" />
            <Tooltip formatter={(value: any) => [Number(value).toFixed(4), '值']} />
            {/* 使用 monotone 平滑插值（Recharts 支持字符串类型） */}
            <Line type="monotone" dataKey="y" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-gray-900 text-xs text-gray-400">
        <p>示例：y=x^2, y=sin(x), y=sqrt(abs(x)), y=x*sin(x)。输入支持 ^ 次方和 ²。</p>
      </div>
    </div>
  );
}
