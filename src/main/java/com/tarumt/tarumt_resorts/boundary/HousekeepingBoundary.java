package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.HousekeepingControl;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.enums.HousekeepingStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/housekeeping")
@CrossOrigin(origins = "*")
public class HousekeepingBoundary {

    @Autowired
    private HousekeepingControl control;

    // 前端调用这个获取列表
    @GetMapping("/rooms")
    public List<Room> getRooms() {
        return control.getAllRooms();
    }

    // 前端调用这个更新状态
    @PostMapping("/update")
    public String updateStatus(
            @RequestParam String roomId, 
            @RequestParam String newStatus, 
            @RequestParam(defaultValue = "") String remarks) {
        return control.updateRoomStatus(roomId, HousekeepingStatus.valueOf(newStatus), remarks);
    }

    // 前端调用这个执行撤销
    @PostMapping("/rollback")
    public String rollback() {
        return control.rollbackLastAction();
    }
}