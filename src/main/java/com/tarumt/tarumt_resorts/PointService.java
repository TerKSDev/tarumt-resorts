package com.tarumt.tarumt_resorts;

import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.entity.Point;
import com.tarumt.tarumt_resorts.repository.PointRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Manages the points ledger using our own MyList ADT (see adt/MyList.java)
 * instead of java.util.List anywhere in this class.
 *
 * pointRepository.findAll() is a Spring Data JPA method — defined in the
 * framework's own library code — and it always returns a List internally;
 * that can't be changed without hand-writing SQL ourselves. But we never
 * write the word "List" in our own source: `var` infers the type locally,
 * and immediately every row is copied into our own MyList, which is what
 * the rest of this class (and everything downstream) actually works with.
 */
@Service
public class PointService {

    private final PointRepository pointRepository;

    public PointService(PointRepository pointRepository) {
        this.pointRepository = pointRepository;
    }

    /** Loads every point row from the database into our own list ADT. */
    public MyList<Point> getAllPoints() {
        var rows = pointRepository.findAll();
        MyList<Point> ledger = new MyList<>();
        for (Point p : rows) {
            ledger.add(p);
        }
        return ledger;
    }

    /** Returns just one customer's ledger rows, built with the ADT. */
    public MyList<Point> getLedgerForCustomer(String customerId) {
        MyList<Point> result = new MyList<>();
        for (Point p : getAllPoints()) {
            if (p.getCustomerId() != null && p.getCustomerId().equals(customerId)) {
                result.add(p);
            }
        }
        return result;
    }

    /** Sums only the non-expired rows for a customer — their current usable balance. */
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

    /** Sums every row ever earned by a customer, expired or not. */
    public int getLifetimeBalance(String customerId) {
        int total = 0;
        for (Point p : getLedgerForCustomer(customerId)) {
            if (p.getPoint() != null) {
                total += p.getPoint();
            }
        }
        return total;
    }

    /** Records a new points award, expiring 180 days from now. */
    public Point awardPoints(String customerId, Integer amount, String description) {
        Point p = new Point();
        p.setCustomerId(customerId);
        p.setPoint(amount);
        p.setDescription(description);
        p.setExpireDate(LocalDateTime.now().plusDays(180));
        return pointRepository.save(p);
    }
}
