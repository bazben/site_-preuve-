const mysql = require('mysql2');

//connexion à mysql de XAMPP
const db = mysql.createConnection({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
   ssl: {rejectUnauthorized: true }
});

//Test de connexion
db.connect(err => {
   if(err) {
       console.log('erreur de connection :', err);
       return;
   } 
    console.log('connecté à Mysql');
});

module.exports = db;
