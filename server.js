
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.get('/epreuves', (req,res) => {
    const { serie, annee } = req.query;
    if(!serie || !annee) {
        return res.status(400).json({error: 'il faut serie et annee dans l URL'});
    }
    const sql = 'SELECT matiere, fichier_url FROM epreuves WHERE serie = ? AND anne = ? ORDER BY matiere';
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
   console.log(`serveur lancé sur http://localhost:${PORT}`);
});