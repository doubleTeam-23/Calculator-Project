import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme.tsx';

// 侧边栏导航项类型定义
interface NavItem {
  title: string;
  path: string;
  icon: string;
}

// 侧边栏组件
export default function Sidebar() {
  const { isDark } = useTheme();
  
  // 导航项配置
  const navItems: NavItem[] = [
    { title: '高级计算', path: '/advanced', icon: 'fa-superscript' },
    { title: '方程求解', path: '/equations', icon: 'fa-equals' },
    { title: '函数绘图', path: '/graphing', icon: 'fa-chart-line' },
    { title: '微积分', path: '/calculus', icon: 'fa-integral' },
    { title: '矩阵计算', path: '/matrix', icon: 'fa-table' },
    { title: '单位转换', path: '/converters', icon: 'fa-exchange-alt' },
    { title: 'BMI计算', path: '/bmi', icon: 'fa-person' },
  ];

  return (
    <aside className={`w-64 ${isDark ? 'bg-gray-800' : 'bg-white'} border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} h-full transition-all duration-300 ease-in-out`}>
      {/* 侧边栏头部 */}
      <div className="p-4 border-b border-gray-700">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <i className="fa-solid fa-calculator mr-2 text-blue-500"></i>
          科学计算器
        </h2>
      </div>
      
      {/* 导航菜单 */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  cn(
                    'flex items-center px-3 py-3 rounded-lg transition-all duration-200',
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  )
                }
              >
                <i className={`fa-solid ${item.icon} w-5 h-5 mr-3`}></i>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* 侧边栏底部 */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
          <p>科学计算器 v1.0</p>
        </div>
      </div>
    </aside>
  );
}