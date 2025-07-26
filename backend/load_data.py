import psycopg2
import csv
import os

CONN_STR = os.getenv("DATABASE_URL")

# Update CSV paths as needed
def load_products(cursor, csv_path):
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute("""
                INSERT INTO products (name, description, price, stock)
                VALUES (%s, %s, %s, %s)
            """, (
                row['name'],
                '',  # description not in CSV
                row['retail_price'],  # using retail_price as price
                0  # stock not in CSV, default to 0
            ))

def load_customers(cursor, csv_path):
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute("""
                INSERT INTO customers (name, email, address)
                VALUES (%s, %s, %s)
            """, (row['name'], row['email'], row['address']))

def load_orders(cursor, csv_path):
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute("""
                INSERT INTO orders (customer_id, order_date)
                VALUES (%s, %s)
            """, (row['customer_id'], row['order_date']))

def load_order_items(cursor, csv_path):
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute("""
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (row['order_id'], row['product_id'], row['quantity'], row['price']))

def main():
    conn = psycopg2.connect(CONN_STR)
    cursor = conn.cursor()
    # Update paths to your CSV files
    load_products(cursor, './archive/products.csv')
    load_customers(cursor, './archive/customers.csv')
    load_orders(cursor, './archive/orders.csv')
    load_order_items(cursor, './archive/order_items.csv')
    conn.commit()
    cursor.close()
    conn.close()
    print('Data loaded successfully.')

if __name__ == '__main__':
    main()
