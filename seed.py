import sqlite3
import random
import uuid
import string
from datetime import datetime, timedelta

def get_random_string(length):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def seed_database():
    print("Connecting to SQLite database (tarumt_resorts.db)...")
    conn = sqlite3.connect('tarumt_resorts.db')
    cursor = conn.cursor()

    now = datetime.now()

    # 1. Seed Rooms
    print("Seeding Rooms...")
    room_types = ['STANDARD', 'DELUXE', 'DOUBLE', 'TWIN', 'SUITES']
    room_statuses = ['AVAILABLE', 'RESERVED', 'CHECKED_IN', 'CHECKED_OUT', 'MAINTENANCE', 'CLEANING']
    
    rooms = []
    for i in range(1, 16):
        room_id = f"{100 + i}"
        r_type = random.choice(room_types)
        capacity = 2 if r_type in ['STANDARD', 'TWIN'] else (4 if r_type == 'SUITES' else 3)
        price = random.randint(100, 500)
        status = random.choice(room_statuses)
        rooms.append((room_id, capacity, now, price, status, r_type, now))
    
    cursor.executemany("""
        INSERT OR IGNORE INTO rooms (room_id, capacity, created_at, price_per_night, status, type, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, rooms)

    # 2. Seed Customers
    print("Seeding Customers...")
    loyalty_tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']
    customer_ids = []
    
    customers = []
    for i in range(1, 16):
        c_id = f"CUST-{get_random_string(6)}"
        customer_ids.append(c_id)
        name = f"Customer {i}"
        tier = random.choice(loyalty_tiers)
        customers.append((c_id, now, True, tier, name, now))

    cursor.executemany("""
        INSERT OR IGNORE INTO customers (customer_id, created_at, is_active, loyalty_tier, name, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, customers)

    # 3. Seed Bookings
    print("Seeding Bookings...")
    booking_statuses = ['ACTIVE', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'REFUNDED']
    bookings = []
    
    for i in range(1, 16):
        booking_id = i
        # Spread dates around today for arrival/departure testing
        days_offset = random.randint(-5, 5)
        stay_duration = random.randint(1, 4)
        
        check_in = now + timedelta(days=days_offset)
        check_out = check_in + timedelta(days=stay_duration)
        
        conf_no = get_random_string(8)
        status = random.choice(booking_statuses)
        
        # Make sure we have some CHECKED_IN for Guest Directory, and some arriving/departing today
        if i <= 3:
            status = 'CHECKED_IN'
            check_in = now - timedelta(days=1)
            check_out = now + timedelta(days=1)
        elif i <= 5:
            status = 'ACTIVE'
            check_in = now
            check_out = now + timedelta(days=2)
        elif i <= 7:
            status = 'CHECKED_IN'
            check_in = now - timedelta(days=2)
            check_out = now
            
        c_id = random.choice(customer_ids)
        r_id = random.choice(rooms)[0]
        total = random.randint(200, 1500)
        
        bookings.append((booking_id, check_in, check_out, conf_no, now, True, status, total, now, c_id, r_id))

    cursor.executemany("""
        INSERT OR REPLACE INTO bookings (booking_id, check_in_date, check_out_date, confirmation_no, created_at, is_paid, status, total_amount, updated_at, customer_id, room_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, bookings)

    # 4. Seed Staffs
    print("Seeding Staffs...")
    roles = ['HOUSEKEEPING', 'FRONT_DESK', 'MANAGER']
    staff_ids = []
    
    staffs = []
    for i in range(1, 11):
        s_id = f"STAFF-{get_random_string(4)}"
        staff_ids.append(s_id)
        role = random.choice(roles)
        staffs.append((s_id, now, f"staff{i}@tarumt.edu.my", True, f"Staff Name {i}", "password123", role, now))

    cursor.executemany("""
        INSERT OR IGNORE INTO staffs (staff_id, created_at, email, is_active, name, password, role, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, staffs)

    # 5. Seed Housekeeping Tasks
    print("Seeding Housekeeping Tasks...")
    hk_statuses = ['DIRTY', 'CLEANING', 'CLEANED']
    tasks = []
    
    for i in range(1, 11):
        r_id = random.choice(rooms)[0]
        s_id = random.choice(staff_ids)
        c_status = random.choice(hk_statuses)
        o_status = 'DIRTY' if c_status == 'CLEANING' else ('CLEANING' if c_status == 'CLEANED' else None)
        tasks.append((i, now, c_status, o_status, f"Routine check {i}", now, r_id, s_id))

    cursor.executemany("""
        INSERT OR REPLACE INTO housekeeping_tasks (task_id, created_at, current_status, old_status, remarks, updated_at, room_id, staff_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, tasks)

    # 6. Seed Points
    print("Seeding Points...")
    points = []
    for i in range(1, 11):
        c_id = random.choice(customer_ids)
        p_id = str(uuid.uuid4())
        expire = now + timedelta(days=365)
        pts = random.randint(100, 1000)
        points.append((p_id, c_id, now, f"Earned from booking", expire, pts))

    cursor.executemany("""
        INSERT OR IGNORE INTO points (id, customer_id, date, description, expire_date, point)
        VALUES (?, ?, ?, ?, ?, ?)
    """, points)

    # 7. Seed Redeem
    print("Seeding Redeem...")
    redeems = []
    for i in range(1, 11):
        c_id = random.choice(customer_ids)
        pts = random.randint(50, 500)
        redeems.append((i, c_id, now, f"Redeemed for breakfast", pts, True))

    cursor.executemany("""
        INSERT OR REPLACE INTO redeem (id, customer_id, date, description, point, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, redeems)

    conn.commit()
    conn.close()
    print("Successfully seeded all tables with at least 10 records each!")

if __name__ == "__main__":
    seed_database()
