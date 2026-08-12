const registerform = document.getElementById('registerform');
const loginform = document.getElementById('loginform');
const chregister = document.getElementById('chregister');
const chlogin = document.getElementById('chlogin');
const message = document.getElementById('message');
const exam = document.getElementById('examen');
const ccn = document.getElementById('ccn');
 const serie = document.getElementById('serie');

chregister.addEventListener('click', e => {
   e.preventDefault();
    loginform.style.display = 'grid';
    registerform.style.display = 'none';
});

chlogin.addEventListener('click', e => {
   e.preventDefault();
    loginform.style.display = 'none';
    registerform.style.display = 'flex';
});

examen.addEventListener('change', () => {
   if (exam.value !== 'BEPC') {
       ccn.style.display = 'flex'; 
   } else {
       ccn.style.display = 'none';
       serie.value = '';
   }
});

registerform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nom =  document.getElementById('nom');
    const prenom = document.getElementById('prenom');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
   const confpassword = document.getElementById('confpassword');
    
    [nom, prenom, password, email, confpassword].forEach(input => {
       input.addEventListener('input', () => {
          input.style.border = '1px solid #ccc';
           input.style.backgroundColor = 'white';
       });
    });
    
   [nom, prenom, password, email, confpassword].forEach(tt => {
       if (!tt.value.trim()) {
           tt.style.border = 'double red';
       }
       
   });
     if (!nom.value.trim() || !prenom.value.trim() || !email.value.trim() || !password.value.trim() || !confpassword.value.trim()) {
        message.style.color = 'red';
        message.innerText = 'remplissez le champ vide';
        message.style.backgroundColor = 'black';
        return;
    }
    
   const data = {
       nom: nom.value.trim(),
       prenom: prenom.value.trim(),
       email: email.value.trim(),
       password: password.value.trim(),
       examen: exam.value,
      serie: exam.value === 'BEPC' ? null : serie.value,
      confpassword: confpassword.value.trim()
   };
    message.innerText = "Loading...";
    message.style.color = 'black';
    
    try {
        const res = await fetch('https://bazben-site-preuve.onrender.com/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'  
            },
            body: JSON.stringify(data)
        });
        const results = await res.json();
        
        if(res.ok) {
            message.style.color = 'green';
            message.innerText = `connexion réussie!  Bienvenue ${results.user.nom} ${results.user.prenom}`;
         setTimeout(() => {window.location = `${exam.value}.html`;}, 2000);
        }else {
            message.style.color = 'red';
            message.innerText = 'Erreur: ' + (results.message || results.erreur || 'Une erreur est survenue');
        }
    }catch(err) {
        message.style.color = 'red';
        message.innerText = 'Erreur de connexion';
        console.log(err);
    }
});

registerform.addEventListener('keydown', e => {
   if (e.key === 'enter') {
       e.preventDefault();
       registerform.requestSubmit();
   } 
});



// PASSAGE A LA ROUTE LOGIN

loginform.addEventListener('submit', async (el) => {
   el.preventDefault();
    const email = document.getElementById('logmail').value;
    const password = document.getElementById('logpassword').value;
    const message = document.getElementById('logmessage');
    
    message.style.color = 'white';
    message.innerText = 'loading...';
    
    try {
        const resp = await fetch('https://bazben-site-preuve.onrender.com/Loging', {
           method: 'POST',
            headers: {
              'content-Type': 'application/json'  
            },
            body: JSON.stringify({ email, password })
        });
        const results = await resp.json();
        console.log("REPONSE SERVEUR: ", results, results.user.exam);
        
        if(resp.ok) {
            message.style.color = 'green';
            message.innerText = `connexion réussie!  Bienvenue ${results.user.nom} ${results.user.prenom}`;
           setTimeout(() => {window.location = `${results.user.exam}.html`;}, 2000);
        }else {
            message.style.color = 'red';
            message.innerText = (results.message || results.erreur || 'Une erreur est survenue');
        }
        
    }catch(err) {
        message.style.color = 'red';
        message.innerText = 'Erreur lors de la connexin';
        console.log(err);
    }
});
