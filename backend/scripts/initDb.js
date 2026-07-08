const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const sqlPath = path.join(__dirname, '..', 'setup.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Executando setup.sql...');
    await connection.query(sql);
    console.log('Banco de dados "nutricao" inicializado com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

run();
