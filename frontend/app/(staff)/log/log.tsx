import { type MetaFunction } from "react-router";
import StatCard from "../../../components/StatCard";
// 引入适合 Housekeeping 的图标
import { 
  Brush, 
  Sparkles, 
  ClipboardCheck, 
  Trash2, 
  Undo2, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Housekeeping | TARUMT Resorts" },
];

export default function Housekeeping() {
  // 这里未来会替换为调用 Spring Boot 后端的 API 数据
  const mockRooms = [
    { id: "R101", type: "Deluxe", status: "DIRTY" },
    { id: "R102", type: "Standard", status: "CLEANING_IN_PROGRESS" },
    { id: "R103", type: "Suite", status: "INSPECTED" },
    { id: "R104", type: "Standard", status: "READY" },
  ];

  const mockHistoryStack = [
    { id: 1, room: "R103", from: "CLEANING", to: "INSPECTED", time: "10:45 AM" },
    { id: 2, room: "R102", from: "DIRTY", to: "CLEANING", time: "10:30 AM" },
    { id: 3, room: "R101", from: "OCCUPIED", to: "DIRTY", time: "10:00 AM" },
  ];

  return (
    <main className="flex flex-col flex-1 min-h-screen gap-6 p-6">
      
      {/* 1. 顶部状态卡片 (完美契合你的 StatCard 风格) */}
      <div className="grid sm:grid-cols-2 grid-cols-1 xl:grid-cols-4 gap-4 w-full">
        <StatCard
          title="Dirty Rooms"
          value="12"
          icon={Trash2}
          color="rose"     // 红色警告
          mutation={3}     // 假设新增了3间脏房
        />
        <StatCard 
          title="Cleaning In Progress" 
          value="5" 
          icon={Brush} 
          color="amber"    // 橙色处理中
        />
        <StatCard
          title="Inspected"
          value="8"
          icon={ClipboardCheck}
          color="indigo"   // 蓝色已检查
        />
        <StatCard
          title="Ready For Check-In"
          value="24"
          icon={Sparkles}
          color="emerald"  // 绿色可入住
          mutation={5}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        {/* 2. 客房列表 & 状态更新 (占据 2/3 宽度) */}
        <div className="xl:col-span-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">Room Status Management</h2>
              <p className="text-sm text-surface-500">Update housekeeping sequence sequentially.</p>
            </div>
            <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-all">
              Generate Report
            </button>
          </div>

          {/* 模拟列表 */}
          <div className="flex flex-col gap-3">
            {mockRooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center font-bold text-surface-700 dark:text-surface-300">
                    {room.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-surface-50">{room.type}</h3>
                    <span className="text-xs text-surface-500 font-medium">Status: {room.status}</span>
                  </div>
                </div>
                {/* 状态流转按钮 */}
                <button className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-50 rounded-lg text-sm font-medium transition-all">
                  Update Next Status →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 操作栈与撤销 (占据 1/3 宽度) - 核心分数所在！ */}
        <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-brand-200 dark:border-brand-800 pb-4">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
              <Clock size={20} />
              <h2 className="text-lg font-semibold">Action Stack</h2>
            </div>
            {/* 撤销按钮 (Rollback) */}
            <button className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-lg text-sm font-semibold transition-all">
              <Undo2 size={16} />
              Roll Back
            </button>
          </div>

          <p className="text-xs text-surface-500">
            * Last action is at the top (LIFO). Click Roll Back to undo the latest status change.
          </p>

          <div className="flex flex-col gap-3 relative">
            {/* 左侧的时间线连接线 */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-brand-200 dark:bg-brand-800 z-0"></div>
            
            {mockHistoryStack.map((history, index) => (
              <div key={history.id} className={`relative z-10 flex gap-4 p-3 rounded-xl border ${index === 0 ? 'bg-white dark:bg-surface-900 border-brand-300 dark:border-brand-700 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${index === 0 ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-400' : 'bg-surface-200 text-surface-500 dark:bg-surface-800'}`}>
                  {index === 0 ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                    Room {history.room} updated
                  </h4>
                  <p className="text-xs text-surface-500">
                    {history.from} → <span className="font-medium text-brand-600 dark:text-brand-400">{history.to}</span>
                  </p>
                  <span className="text-[10px] text-surface-400 mt-1">{history.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}