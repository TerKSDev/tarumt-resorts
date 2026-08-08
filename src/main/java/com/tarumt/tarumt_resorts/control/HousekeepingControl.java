package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.dao.HousekeepingTaskDAO;
import com.tarumt.tarumt_resorts.dao.RoomDAO;
import com.tarumt.tarumt_resorts.entity.HousekeepingTask;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.enums.HousekeepingStatus;
import com.tarumt.tarumt_resorts.entity.enums.RoomStatus;
import com.tarumt.tarumt_resorts.utility.CustomStack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HousekeepingControl {

    @Autowired
    private RoomDAO roomDAO;

    @Autowired
    private HousekeepingTaskDAO taskDAO;

    // 【重要】你的撤销栈，放在内存中
    private CustomStack actionStack = new CustomStack();

    // --- 1. 获取所有房间 ---
    public List<Room> getAllRooms() {
        return roomDAO.findAll();
    }

    // --- 2. 更新客房状态并压入 Stack ---
    public String updateRoomStatus(String roomId, HousekeepingStatus newStatus, String remarks) {
        Room room = roomDAO.findById(roomId).orElse(null);
        if (room == null) return "Room not found!";

        // 修复报错 1：获取房间当前的 RoomStatus，并转换为 HousekeepingStatus 记录在日志里
        RoomStatus currentRoomStatus = room.getStatus(); 
        HousekeepingStatus oldStatus;
        try {
            oldStatus = HousekeepingStatus.valueOf(currentRoomStatus.name());
        } catch (IllegalArgumentException e) {
            // 如果 RoomStatus 里有 HousekeepingStatus 里没有的状态，给个默认值
            oldStatus = HousekeepingStatus.DIRTY; 
        }

        // A. 创建 Task 并存入数据库
        HousekeepingTask task = new HousekeepingTask();
        task.setRoom(room);
        task.setOldStatus(oldStatus);
        task.setCurrentStatus(newStatus);
        task.setRemarks(remarks);
        HousekeepingTask savedTask = taskDAO.save(task);

        // B. 【拿高分的重点】压入你自己写的栈里
        actionStack.push(savedTask);

        // C. 更新房间表的最新状态
        // 修复报错 2：尝试把 HousekeepingStatus 转换回 RoomStatus 存进 Room 里
        try {
            RoomStatus newRoomStatus = RoomStatus.valueOf(newStatus.name());
            room.setStatus(newRoomStatus);
        } catch (IllegalArgumentException e) {
            // 如果无法转换，比如 newStatus 是 CLEANING_IN_PROGRESS，但 RoomStatus 没有这个
            // 这里我们保持房间状态为 CLEANING 作为妥协
            room.setStatus(RoomStatus.CLEANING); 
        }
        roomDAO.save(room);

        return "Successfully updated room " + roomId + " to " + newStatus;
    }

    // --- 3. 瞬间撤销功能 (Rollback) ---
    public String rollbackLastAction() {
        if (actionStack.isEmpty()) {
            return "No recent actions to rollback.";
        }

        // A. 从 Stack 中弹出最后一条操作
        HousekeepingTask lastTask = actionStack.pop();
        Room room = lastTask.getRoom();
        HousekeepingStatus statusToRestore = lastTask.getOldStatus();

        // B. 恢复房间的状态
        // 修复报错 3：把 HousekeepingStatus 转换回 RoomStatus 存进 Room 里
        try {
            RoomStatus restoredRoomStatus = RoomStatus.valueOf(statusToRestore.name());
            room.setStatus(restoredRoomStatus);
        } catch (IllegalArgumentException e) {
            // 妥协处理，如果找不到精确匹配
            room.setStatus(RoomStatus.AVAILABLE); 
        }
        roomDAO.save(room);

        // C. 在数据库里也记录一下这次“撤销”行为
        HousekeepingTask rollbackTask = new HousekeepingTask();
        rollbackTask.setRoom(room);
        rollbackTask.setOldStatus(lastTask.getCurrentStatus());
        rollbackTask.setCurrentStatus(statusToRestore);
        rollbackTask.setRemarks("System Rollback");
        taskDAO.save(rollbackTask);

        return "Rolled back room " + room.getRoomId() + " to " + statusToRestore;
    }
}