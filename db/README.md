Setup and usage for the MySQL database used by this project

Quick steps

- Ensure MySQL/MariaDB is installed and running. For XAMPP users, start Apache and MySQL from the XAMPP Control Panel.
- Decide whether you'll use the repository `db/init.sql` (creates a `taskflow` user) or `db/init_xampp.sql` (XAMPP-friendly, uses `root`).
- Run the SQL file to create the database and tables.

PowerShell examples

1) Using system-installed MySQL (or if you prefer `db/init.sql` which creates a user):

```powershell
# Run from repository root
mysql -u root -p < .\db\init.sql
```

2) Using XAMPP's bundled MySQL/MariaDB (typical XAMPP install path shown):

```powershell
# If you haven't set a root password (XAMPP default), run:
& 'C:\xampp\mysql\bin\mysql.exe' -u root < .\db\init_xampp.sql

# If you set a root password, add -p and you'll be prompted:
& 'C:\xampp\mysql\bin\mysql.exe' -u root -p < .\db\init_xampp.sql
```

phpMyAdmin (XAMPP) import

- Open `http://localhost/phpmyadmin` in your browser, log in as `root` (no password by default), select the Import tab, and choose `db/init_xampp.sql`.

Which SQL file to use

- `db/init.sql`: creates the database and also attempts to create a `taskflow` user and grant privileges. Use this when you control the MySQL root account and want a dedicated user.
- `db/init_xampp.sql`: does not create a user; it only creates the database and tables. This is recommended for XAMPP where `root` often has no password.

Environment variables (.env example)

```
DB_HOST=localhost
# For XAMPP default: DB_USER=root and DB_PASS is empty
DB_USER=taskflow
DB_PASS=ChangeMe123!
DB_NAME=task_flow_db
```

If using XAMPP with root and no password, set:

```
DB_USER=root
DB_PASS=
```

Node.js connection example (using `mysql2` and `dotenv`)

```js
// Install: npm install mysql2 dotenv
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || (process.env.XAMPP ? 'root' : 'taskflow'),
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'task_flow_db',
  waitForConnections: true,
  connectionLimit: 10,
});

async function test() {
  const [rows] = await pool.query('SELECT 1+1 AS solution');
  console.log(rows);
}

test().catch(console.error);
```

XAMPP notes and security

- XAMPP typically runs MySQL/MariaDB with `root` and no password by default. For local development this is convenient but insecure for production.
- For production or shared environments, create a dedicated database user with limited privileges and update your `.env` accordingly.

Next steps I can do for you

- Add a small Node.js script `scripts/db-init.js` that executes either `db/init.sql` or `db/init_xampp.sql` using `mysql2` and reads DB credentials from `.env`.
- Run the XAMPP import locally (I would need the machine's XAMPP path and credentials, or you can run the PowerShell commands above).

If you'd like me to add the Node.js runner, tell me and I'll add the file and an `npm` script to run it.
