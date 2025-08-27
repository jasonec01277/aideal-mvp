import psycopg
try:
    conn = psycopg.connect(
        host='127.0.0.1',
        port=55432,
        dbname='aideal',
        user='appuser',
        password='app1234',
        connect_timeout=5,
    )
    with conn.cursor() as cur:
        cur.execute('select current_user, current_database();')
        print('DB SAYS:', cur.fetchone())
    conn.close()
    print('HOST CONNECT OK')
except Exception as e:
    print('HOST CONNECT FAILED:', e)
