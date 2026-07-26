
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

app.get('/epreuves/BAC/', (req,res) => {
     const {serie, annee, exam} = req.query;
    if(!serie || !annee) {
        return res.status(400).json({error: 'il faut serie et annee dans l URL'});
    }
   const  sql = 'SELECT matiere, fichier_url, exam FROM epreuves WHERE serie = ? AND annee = ? AND exam = ?';
    db.query(sql, [serie, annee, exam], (err, results) => {
       if (err) {
           console.error(err);
           return res.status(500).json({ error: 'Erreur DB' });
       } 
        res.json(results);
    });
});
app.get('/epreuves/BEPC/', (req,res) => {
     const  annee = req.query.annee;
    if(!annee) {
        return res.status(400).json({error: 'il faut annee dans l URL'});
    }
   const  sql = 'SELECT matiere, fichier_url, exam FROM epreuves WHERE annee = ? AND exam = ?';
    db.query(sql, [annee, 'BEPC'], (err, results) => {
       if (err) {
           console.error(err);
           return res.status(500).json({ error: 'Erreur DB' });
       } 
        res.json(results);
    });
});

app.post('/register', async (req, res) => {
   const { nom, prenom, email, password, confpassword, serie, examen } = req.body;
    if (!email || !password) {
        return res.status(400).json({erreur: "email et mot e pass obligatoires"});
    }
    if (password!== confpassword) {
        return res.status(400).json({erreur: "les mots de pass ne correspondent pas"});
    }
    try{
        db.query('SELECT * FROM users WHERE email =?', [email], async (err, resultats) => {
           if (err) {
               return res.status(500).json({erreur: "Erreur serveur"});
           } 
            if (resultats.length > 0) {
                return res.status(409).json({erreur: "email déjà utilisé"});
            }
            
            const hashpass = await bcrypt.hash(password, 10);
            
            const sql = 'INSERT INTO users (nom, prenom, email, password, serie, examen) VALUES';
            db.query(sql, [nom, prenom, email, hashpass, serie, examen], (Err, re) => {
                if (Err) return res.status(500).json({err: "erreur lors de la création"});
            
            const token = jwt.sign(
            {id: re.insertId, email: email},
                {expiresIn: '90d'}
            );
            
            res.status(201).json({
                message: "compte créé avec succès",
                token: token
            });
            });
        });
    }catch(err) {
      res.status(500).json({erreur: "Erreur serveur"});
    }
});

app.post('/Loging', async (req, res) => {
   const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).json({err: "email et ,ot de pass obligatoires"});
    }
    
    db.query('SELECT * FROM users WHERE email =?', [email], async (err, results) => {
       if(err) return res.status(500).json({erreur: "Erreur serveur"});
        if(results.length === 0) {
            return res.status(401).json({error: "email incorrect"});
        }
         const user = results[0];
        
        const okk = await bcrypt.compare(password, user.password);
        if(!okk) {
            return res.status(401).json({err: "mot de pass incorrect"});
        }
        const token = jwt.sign(
        {id: user.id, email: email},
        {expiresIn: '90d'}
        );
        res.json({
           message: "connexion réussie",
            token: token
        });
    });
});

//Route pour tester

app.listen(PORT, () => {
   console.log(`serveur lancé sur le port ${PORT}`);
});
