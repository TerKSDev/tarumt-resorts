//By Tek Shao Xian

package com.tarumt.tarumt_resorts.control;

import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.entity.Point;
import com.tarumt.tarumt_resorts.dao.PointDAO;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PointControl {

    private final PointDAO PointDAO;

    public PointControl(PointDAO PointDAO) {
        this.PointDAO = PointDAO;
    }

    public MyList<Point> getAllPoints() {
        var rows = PointDAO.findAll();
        MyList<Point> ledger = new MyList<>();
        for (Point p : rows) {
            ledger.add(p);
        }
        return ledger;
    }

    public MyList<Point> getLedgerForCustomer(String customerId) {
        MyList<Point> result = new MyList<>();
        for (Point p : getAllPoints()) {
            if (p.getCustomerId() != null && p.getCustomerId().equals(customerId)) {
                result.add(p);
            }
        }
        return result;
    }

    public int getActiveBalance(String customerId) {
        LocalDateTime now = LocalDateTime.now();
        int total = 0;
        for (Point p : getLedgerForCustomer(customerId)) {
            boolean stillActive = p.getExpireDate() == null || p.getExpireDate().isAfter(now);
            if (stillActive && p.getPoint() != null) {
                total += p.getPoint();
            }
        }
        return total;
    }

    public int getLifetimeBalance(String customerId) {
        int total = 0;
        for (Point p : getLedgerForCustomer(customerId)) {
            if (p.getPoint() != null) {
                total += p.getPoint();
            }
        }
        return total;
    }

    public Point awardPoints(String customerId, Integer amount, String description) {
        Point p = new Point();
        p.setCustomerId(customerId);
        p.setPoint(amount);
        p.setDescription(description);
        p.setExpireDate(LocalDateTime.now().plusDays(180));
        return PointDAO.save(p);
    }
}
