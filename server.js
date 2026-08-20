
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieparser());

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
            
           const sql = `INSERT INTO users (nom, prenom, email, password, serie, examen) VALUES (?,?,?,?,?,?)`;
            db.query(sql, [nom, prenom, email, hashpass, serie, examen], (Err, re) => {
                if (Err) return res.status(500).json({erreur: "erreur lors de la création"});
            
            const token = jwt.sign(
            {id: re.insertId, email: email},
                process.env.JWT_SECRET,
                {expiresIn: '90d'}
            );
            
           res.cookie('token', token, {
                   httpOnly: true,
                    secure: true,
                    sameSite: 'Lax',
                    maxAge: 90 * 24 * 60 * 60 * 1000
                });
            
           db.query('SELECT * FROM users WHERE email =?', [email], async (err, resp) => {
                    res.status(201).json({
                message: "compte créé avec succès",
                user: {nom, prenom, email, date: resp.creea}
            });
                });
                console.log("connexion réussie");
            });
        });
    }catch(err) {
      res.status(500).json({erreur: "Erreur serveur"});
    }
});

app.post('/Loging', async (req, res) => {
   const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).json({erreur: "email et ,ot de pass obligatoires"});
    }
    
    db.query('SELECT * FROM users WHERE email =?', [email], async (err, results) => {
       if(err) return res.status(500).json({erreur: "Erreur serveur"});
        if(results.length === 0) {
            return res.status(401).json({erreur: "email incorrect"});
        }
         const user = results[0];
        
        const okk = await bcrypt.compare(password, user.password);
        if(!okk) {
            return res.status(401).json({erreur: "mot de pass incorrect"});
        }
        const token = jwt.sign(
        {id: user.id, email: email},
            process.env.JWT_SECRET,
        {expiresIn: '90d'}
        );
        res.cookie('token', token, {
                   httpOnly: true,
                    secure: true,
                    sameSite: 'Lax',
                    maxAge: 90 * 24 * 60 * 60 * 1000
                });
            
            res.status(201).json({
                message: "connexion réussie",
              user: {nom: user.nom, prenom: user.prenom, exam: user.examen, email: user.email, date: user.creea}
            });
                console.log("connexion réussie");
            });
        });

app.get('/me', (req,res) => {
   const token = req.cookies.token;
    if(!token) return res.status(401).json({error: "Non connecté"});
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
       if(err) return res.status(401).json({error: "Token invalide"});
           const sql = 'SELECT id, nom, prenom, email, creea, img_url FROM users WHERE id =?';
           db.query(sql, [decoded.id], (err, result) => {
              if (err || result.length === 0) return res.status(401).json({error: 'user introuvable'});
               res.json({user: result[0]});
           });
        
    });
});

async function scraper() {
    try{
    const { data } = await axios.get('https://togobreakingnews.info/category/education/', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const $ = cheerio.load(data);
    let news = [];
    
    $('.p-wrap.p-grid.p-grid-1').each((i, el) => {
       const img = $(el).find('.p-flink img').attr('src');
        
        const title = $(el).find('h2 a').text().trim();
        const link = $(el).find('h2 a').attr('href');
        
        if(title) {
            news.push({id: i + 1, title, link, img});
        }
    });
    return news;
    } catch(err) {
        console.log("Erreur de scraping: ", err);
    }
}

app.get('/news', async (req, res) => {
    const news = await scraper();
    
    res.json({
       total: news.length,
        data: news
    });
});

app.post('/logout', (req, res) => {
   res.clearCookie('token');
    res.json({message: "Déconnecté"});
});

app.listen(PORT, () => {
   console.log(`serveur lancé sur le port ${PORT}`);
});
