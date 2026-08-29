/**
 * Author: See Wei Jian
 */
package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.HousekeepingControl;
import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.entity.Room;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/housekeeping")
@CrossOrigin(origins = "*")
public class HousekeepingBoundary {

    private final HousekeepingControl housekeepingControl;
    public HousekeepingBoundary(HousekeepingControl housekeepingControl) {
        this.housekeepingControl = housekeepingControl;
    }

    @GetMapping("/rooms")
    public Room[] getRooms() {
        MyList<Room> roomsList = housekeepingControl.getAllRooms();
        Room[] roomArray = new Room[roomsList.size()];
        for (int i = 0; i < roomsList.size(); i++) {
            roomArray[i] = roomsList.get(i);
        }
        return roomArray;
    }

    @PostMapping("/advance")
    public String advanceStatus(
            @RequestParam String roomId,
            @RequestParam(defaultValue = "") String staffId,
            @RequestParam(defaultValue = "") String remarks) {
        return housekeepingControl.advanceRoomStatus(roomId, staffId, remarks);
    }

    @PostMapping("/rollback")
    public String rollback(@RequestParam String roomId) {
        return housekeepingControl.rollbackLastAction(roomId);
    }
}