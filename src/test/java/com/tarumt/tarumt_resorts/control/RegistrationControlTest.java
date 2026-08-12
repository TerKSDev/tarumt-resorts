package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.dao.BookingDAO;
import com.tarumt.tarumt_resorts.dao.CustomerDAO;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class RegistrationControlTest {

    @Test
    void enqueueGuestStoresGuestInArrayQueue() {
        CustomerDAO customerDAO = Mockito.mock(CustomerDAO.class);
        BookingDAO bookingDAO = Mockito.mock(BookingDAO.class);
        RegistrationControl control = new RegistrationControl(customerDAO, bookingDAO);

        RegistrationControl.QueueItem item = new RegistrationControl.QueueItem();
        item.setName("Alice Tan");
        item.setIdentityNo("990101-10-1234");
        item.setGuests(2);

        RegistrationControl.QueueItem created = control.enqueueGuest(item);

        assertNotNull(created);
        assertEquals("990101-10-1234", created.getIdentityNo());

        RegistrationControl.QueueItem[] queue = control.getQueue();
        assertEquals(1, queue.length);
        assertEquals(created.getId(), queue[0].getId());
    }
}
