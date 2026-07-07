
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// servir le dossier public/
app.use(express.static(path.join(__dirname, 'public')));

// renvoie du index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/epreuves', (req,res) => {
     const {serie, annee} = req.query;
    if(!serie || !annee) {
        return res.status(400).json({error: 'il faut serie et annee dans l URL'});
    }
   const  sql = 'SELECT matiere, fichier_url, exam FROM epreuves WHERE serie = ? AND anne = ?';
    db.query(sql, [serie, annee], (err, results) => {
       if (err) {
           console.error(err);
           return res.status(500).json({ error: 'Erreur DB' });
       } 
        res.json(results);
    });
});

//Route pour tester

app.listen(PORT, () => {
   console.log(`serveur lancé sur le port ${PORT}`);
});
