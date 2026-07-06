
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
     let { serie, annee, exam } = req.query;
    if(exam === 'BEPC'){
        serie = '';
    }
    if(!annee || (exam !== 'BEPC' &&!serie)) {
        return res.status(400).json({error: 'il faut serie et annee dans l URL'});
    }
     let sql;
    let params;
    if(exam === 'BEPC') {
        sql = 'SELECT matiere, fichier_url, exam FROM epreuves WHERE annee = ? AND exam = ?';
        params = [annee, exam];
    } else {
     sql = 'SELECT matiere, fichier_url, exam FROM epreuves WHERE serie = ? AND annee = ? AND exam = ?';
    params = [serie, annee, exam];
        }
    db.query(sql, params, (err, results) => {
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
