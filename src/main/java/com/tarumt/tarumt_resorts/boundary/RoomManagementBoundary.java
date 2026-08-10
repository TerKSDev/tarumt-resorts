package com.tarumt.tarumt_resorts.boundary;

import com.tarumt.tarumt_resorts.control.RoomManagementControl;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.dto.RoomDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/room")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomManagementBoundary {
    @Autowired
    private RoomManagementControl roomManagementControl;

    @GetMapping
    public ResponseEntity<RoomDTO[]> getAllRoom() {
        RoomDTO[] room = roomManagementControl.getAllRoom();
        return ResponseEntity.ok(room);
    }

    @PostMapping("/create")
    public ResponseEntity<?> addRoom(@RequestBody Room roomRequest) {
        try {
            RoomDTO roomDTO = roomManagementControl.addRoom(roomRequest);
            return ResponseEntity.ok(roomDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating room");
        }
    }

    @org.springframework.web.bind.annotation.PutMapping("/update")
    public ResponseEntity<?> updateRoom(@RequestBody Room roomRequest) {
        try {
            RoomDTO roomDTO = roomManagementControl.updateRoom(roomRequest);
            return ResponseEntity.ok(roomDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating room");
        }
    }
}
