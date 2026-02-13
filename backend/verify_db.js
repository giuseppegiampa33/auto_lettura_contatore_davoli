const mysql = require('mysql2/promise');

async function checkDb() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3307,
            user: 'davoli_user',
            password: 'davoli_password',
            database: 'autolettura'
        });

        console.log('Successfully connected to database!');

        const [rows] = await connection.execute('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5');

        console.log(`Found ${rows.length} submissions.`);
        rows.forEach(row => {
            console.log('---');
            console.log(`ID: ${row.id}`);
            console.log(`Utente: ${row.utente}`);
            console.log(`Matricola: ${row.matricola}`);
            console.log(`Created At: ${row.created_at}`);
        });

        await connection.end();
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
}

checkDb();
