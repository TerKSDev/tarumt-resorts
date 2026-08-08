import { useState, useEffect } from "react";
import { type MetaFunction } from "react-router";
import StatCard from "../../../components/StatCard";
import { 
  Brush, Sparkles, ClipboardCheck, Trash2, Undo2, Clock, CheckCircle2, AlertCircle
} from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Housekeeping | TARUMT Resorts" },
];

// 定义 TypeScript 接口
interface Room {
  roomId: string;
  type: string;
  status: string;
}

export default function Housekeeping() {
  // 状态管理
  const [rooms, setRooms] = useState<Room[]>([]);
  // 历史记录暂时还是用简单的状态来存前端显示，实际上也可以从后端拉取
  const [historyStack, setHistoryStack] = useState<any[]>([]);

  // 1. 获取后端房间数据
  const fetchRooms = async () => {
    try {
      // 确保这里的 8080 端口是你 Spring Boot 运行的端口
      const response = await fetch("http://localhost:8081/api/housekeeping/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  // 页面加载时拉取数据
  useEffect(() => {
    fetchRooms();
  }, []);

  // 2. 更新房间状态的函数
  const handleUpdateStatus = async (roomId: string, currentStatus: string) => {
    // 简单的状态流转逻辑
    let newStatus = "CLEANING";
    if (currentStatus === "DIRTY") newStatus = "CLEANING";
    else if (currentStatus === "CLEANING") newStatus = "MAINTENANCE"; // 假设
    else if (currentStatus === "MAINTENANCE") newStatus = "AVAILABLE";

    try {
      const response = await fetch(`http://localhost:8081/api/housekeeping/update?roomId=${roomId}&newStatus=${newStatus}&remarks=UpdatedViaWeb`, {
        method: 'POST'
      });
      
      if (response.ok) {
        alert(`Room ${roomId} updated to ${newStatus}`);
        
        // 前端记录一下 UI 历史（只是为了好看）
        setHistoryStack(prev => [{
          id: Date.now(), room: roomId, from: currentStatus, to: newStatus, time: new Date().toLocaleTimeString()
        }, ...prev]);

        fetchRooms(); // 重新拉取最新列表
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 3. 撤销操作 (Rollback)
  const handleRollback = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/housekeeping/rollback", {
        method: 'POST'
      });
      const resultText = await response.text();
      alert(resultText); // 弹出后端返回的信息（比如 "Rolled back room R101 to DIRTY"）
      
      // 把前端显示的历史记录移除第一条
      setHistoryStack(prev => prev.slice(1));

      fetchRooms(); // 重新拉取最新列表
    } catch (error) {
      console.error("Rollback failed:", error);
    }
  };

  // 统计房间数量
  const dirtyCount = rooms.filter(r => r.status === 'DIRTY').length;
  const cleaningCount = rooms.filter(r => r.status === 'CLEANING').length;
  const availableCount = rooms.filter(r => r.status === 'AVAILABLE').length;

  return (
    <main className="flex flex-col flex-1 min-h-screen gap-6 p-6">
      
      {/* 顶部统计卡片 */}
      <div className="grid sm:grid-cols-2 grid-cols-1 xl:grid-cols-4 gap-4 w-full">
        <StatCard title="Dirty Rooms" value={dirtyCount.toString()} icon={Trash2} color="rose" />
        <StatCard title="Cleaning In Progress" value={cleaningCount.toString()} icon={Brush} color="amber" />
        <StatCard title="Ready For Check-In" value={availableCount.toString()} icon={Sparkles} color="emerald" />
        <StatCard title="Maintenance" value={rooms.filter(r => r.status === 'MAINTENANCE').length.toString()} icon={ClipboardCheck} color="indigo" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        {/* 客房列表 */}
        <div className="xl:col-span-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 pb-4">
            <div>
              <h2 className="text-lg font-semibold">Room Status Management</h2>
              <p className="text-sm text-surface-500">Update housekeeping sequence sequentially.</p>
            </div>
            <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-all">
              Generate Report
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {rooms.length === 0 ? <p className="text-surface-500">No rooms found in database.</p> : null}
            {rooms.map((room) => (
              <div key={room.roomId} className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center font-bold">
                    {room.roomId}
                  </div>
                  <div>
                    <h3 className="font-semibold">{room.type}</h3>
                    <span className="text-xs text-surface-500 font-medium">Status: {room.status}</span>
                  </div>
                </div>
                {/* 触发更新的按钮 */}
                <button 
                  onClick={() => handleUpdateStatus(room.roomId, room.status)}
                  className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 text-sm font-medium rounded-lg"
                >
                  Update Next Status →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 操作栈与撤销 */}
        <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-brand-200 pb-4">
            <div className="flex items-center gap-2 text-brand-700">
              <Clock size={20} />
              <h2 className="text-lg font-semibold">Action Stack</h2>
            </div>
            {/* 触发撤销的按钮 */}
            <button 
              onClick={handleRollback}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-sm font-semibold transition-all"
            >
              <Undo2 size={16} />
              Roll Back
            </button>
          </div>

          <div className="flex flex-col gap-3 relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-brand-200 z-0"></div>
            {historyStack.length === 0 ? <p className="text-xs text-surface-500 z-10">No recent actions.</p> : null}
            {historyStack.map((history, index) => (
              <div key={history.id} className={`relative z-10 flex gap-4 p-3 rounded-xl border ${index === 0 ? 'bg-white border-brand-300 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${index === 0 ? 'bg-brand-100 text-brand-600' : 'bg-surface-200 text-surface-500'}`}>
                  {index === 0 ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold">Room {history.room} updated</h4>
                  <p className="text-xs text-surface-500">
                    {history.from} → <span className="font-medium text-brand-600">{history.to}</span>
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