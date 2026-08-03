package com.tarumt.tarumt_resorts;

import com.tarumt.tarumt_resorts.adt.MyList;
import com.tarumt.tarumt_resorts.entity.Point;
import com.tarumt.tarumt_resorts.repository.PointRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Manages the points ledger using our own MyList ADT (see adt/MyList.java)
 * instead of relying on java.util collections for the ledger logic itself.
 *
 * JpaRepository.findAll() still returns java.util.List<Point> — that's a
 * constraint of the Spring Data JPA framework and can't be changed — but as
 * soon as the rows come back from the database, they're loaded into our own
 * MyList and every bit of ledger logic (per-customer lookup, filtering out
 * expired rows, summing balances) runs on that ADT, not on the JPA list.
 */
@Service
public class PointService {

    private final PointRepository pointRepository;

    public PointService(PointRepository pointRepository) {
        this.pointRepository = pointRepository;
    }

    /** Loads every point row from the database into our own list ADT. */
    public MyList<Point> getAllPoints() {
        List<Point> rows = pointRepository.findAll();
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

    /** Converts the ADT back to a plain List — only needed at the API boundary, since Jackson needs a java.util collection to serialize to JSON. */
    public List<Point> toJavaList(MyList<Point> list) {
        List<Point> out = new java.util.ArrayList<>();
        for (Point p : list) {
            out.add(p);
        }
        return out;
    }
}
