import sqlite3
import uuid
from datetime import datetime

db = sqlite3.connect('tarumt_resorts.db')
c = db.cursor()

now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Room
room_id = 'R-101'
try:
    c.execute('INSERT INTO rooms (room_id, type, status, capacity, price_per_night, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
              (room_id, 'STANDARD', 'AVAILABLE', 2, 150.00, now, now))
except Exception as e:
    pass # Might already exist

# Customer
customer_id = str(uuid.uuid4())
identity_no = '990101-14-5566'
try:
    c.execute('INSERT INTO customers (customer_id, identity_no, name, loyalty_tier, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
              (customer_id, identity_no, 'John Doe', 'GOLD', 1, now, now))
except Exception as e:
    pass

# Booking
confirmation_no = '12345678'
try:
    c.execute('INSERT INTO bookings (confirmation_no, check_in_date, check_out_date, total_amount, is_paid, status, created_at, updated_at, customer_id, room_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              (confirmation_no, now, now, 450.00, 1, 'ACTIVE', now, now, customer_id, room_id))
    print('✅ Successfully seeded Confirmation No: 12345678')
except Exception as e:
    print('Booking insert error:', e)

db.commit()
db.close()
