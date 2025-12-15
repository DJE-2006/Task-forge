#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isXampp = process.argv.includes('--xampp');
const sqlFile = isXampp ? 'db/init_xampp.sql' : 'db/init.sql';

async function initDb() {
  try {
    console.log(`📂 Reading SQL file: ${sqlFile}`);
    const sqlPath = path.join(__dirname, '..', sqlFile);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔌 Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || (isXampp ? 'root' : 'taskflow'),
      password: process.env.DB_PASS || '',
      multipleStatements: true,
    });

    console.log('⚙️  Executing SQL...');
    await connection.query(sql);

    console.log('✅ Database initialized successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

initDb();
