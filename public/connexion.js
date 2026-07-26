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
    registerform.style.display = 'grid';
});

examen.addEventListener('change', () => {
   if (exam.value !== 'BEPC') {
       ccn.style.display = 'grid'; 
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
            message.innerText = 'connexion réussie! Token: ' + results.token.substring(0,20) + '...';
            const copy = document.createElement('button');
            copy.type = 'button';
            message.appendChild(copy);
            const petit = document.createElement('span');
            message.appendChild(petit);
            copy.innerText = "copier";
            copy.addEventListener('click', async (e) => {
                e.preventDefault();
               try {
                   await navigator.clipboard.writeText(results.token); 
                   petit.innerText = 'copié';
                   petit.style.color = 'green';
                   setTimeout(() => {petit.innerText = '';}, 2000);
               } catch (err) {
                petit.innerText = 'non copié';
                   petit.style.color = 'red';
               }
                
            });
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
