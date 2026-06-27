const mysql = require('mysql2');

//connexion à mysql de XAMPP
const db = mysql.createConnection({
   host: process.env.DB_HOST || 'localhost',
   port: process.env.DB_PORT || 3000,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'exams' || 'railway',
   ssl: process.env.DB_HOST ? {rejectUnauthorized: false } : false
});

//Test de connexion
db.connect(err =>{
   if(err) {
       console.log('erreur de connection :', err);
       return;
   } 
    console.log('connecté à Mysql');
});

module.exports = db;
