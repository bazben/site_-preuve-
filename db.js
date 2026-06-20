const mysql = require('mysql2');

//connexion à mysql de XAMPP
const db = mysql.createConnection({
   host: 'localhost',
    user: 'root',
    password: '',
    database: 'exams'
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