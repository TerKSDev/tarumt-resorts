package com.tarumt.tarumt_resorts.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.dao.RoomDAO;
import com.tarumt.tarumt_resorts.dto.RoomDTO;
import com.tarumt.tarumt_resorts.entity.Booking;
import com.tarumt.tarumt_resorts.entity.Room;
import com.tarumt.tarumt_resorts.entity.enums.RoomStatus;
import com.tarumt.tarumt_resorts.entity.enums.BookingStatus;

@Service
public class RoomManagementControl {
    @Autowired
    private RoomDAO roomDao;
    @Autowired
    private BookingDAO bookingDao;

    public RoomDTO[] getAllRoom() {
        try {   
            Room[] rooms = roomDao.findAllBy();
            RoomDTO[] roomDTOs = new RoomDTO[rooms.length];
            
            // 1. Pre-fetch all active and checked-in bookings in a single query as an Array
            Booking[] activeBookings = bookingDao.findActiveAndCheckedInBookings(
                BookingStatus.CHECKED_IN, 
                BookingStatus.ACTIVE
            );
            
            for (int i = 0; i < rooms.length; i++) {
                Room room = rooms[i];
                RoomDTO dto = new RoomDTO();
                
                dto.setRoomId(room.getRoomId());
                dto.setType(room.getType());
                dto.setStatus(room.getStatus());
                dto.setCapacity(room.getCapacity());
                dto.setPricePerNight(room.getPricePerNight());
                dto.setCreatedAt(room.getCreatedAt());
                dto.setUpdatedAt(room.getUpdatedAt());

                if (room.getStatus() == RoomStatus.CHECKED_IN || room.getStatus() == RoomStatus.RESERVED) {
                    // 2. Lookup from the memory Array instead of querying DB
                    Booking activeBooking = null;
                    for (int j = 0; j < activeBookings.length; j++) {
                        if (activeBookings[j].getRoom() != null && activeBookings[j].getRoom().getRoomId().equals(room.getRoomId())) {
                            activeBooking = activeBookings[j];
                            break;
                        }
                    }
                    
                    if (activeBooking != null) {
                        RoomDTO.BookingDTO bookingDTO = new RoomDTO.BookingDTO(
                            activeBooking.getBookingId(),
                            activeBooking.getCheckOutDate(),
                            activeBooking.getStatus().name(),
                            activeBooking.getCustomer().getName()
                        );
                        dto.setBooking(bookingDTO);
                    }
                }

                roomDTOs[i] = dto;
            }
            return roomDTOs;
        } catch (Exception e) {
            System.out.println("Error occurred when fetching room data: " + e.getMessage());
            e.printStackTrace();
            return new RoomDTO[0];
        }
    }
    
    public RoomDTO addRoom(Room room) {
        try {
            if (roomDao.existsById(room.getRoomId())) {
                throw new IllegalArgumentException("Room ID already exists");
            }
            Room savedRoom = roomDao.save(room);
            
            RoomDTO dto = new RoomDTO();
            dto.setRoomId(savedRoom.getRoomId());
            dto.setType(savedRoom.getType());
            dto.setStatus(savedRoom.getStatus());
            dto.setCapacity(savedRoom.getCapacity());
            dto.setPricePerNight(savedRoom.getPricePerNight());
            dto.setCreatedAt(savedRoom.getCreatedAt());
            dto.setUpdatedAt(savedRoom.getUpdatedAt());
            
            return dto;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            System.out.println("Error occurred when adding room data: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error creating room", e);
        }
    }

    public RoomDTO updateRoom(Room room) {
        try {
            if (!roomDao.existsById(room.getRoomId())) {
                throw new IllegalArgumentException("Room not found");
            }
            Room savedRoom = roomDao.save(room);
            
            RoomDTO dto = new RoomDTO();
            dto.setRoomId(savedRoom.getRoomId());
            dto.setType(savedRoom.getType());
            dto.setStatus(savedRoom.getStatus());
            dto.setCapacity(savedRoom.getCapacity());
            dto.setPricePerNight(savedRoom.getPricePerNight());
            dto.setCreatedAt(savedRoom.getCreatedAt());
            dto.setUpdatedAt(savedRoom.getUpdatedAt());
            
            return dto;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            System.out.println("Error occurred when updating room data: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error updating room", e);
        }
    }
}
