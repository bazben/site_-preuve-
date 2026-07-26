const form = document.getElementById('form');
const message = document.getElementById('message');
const exam = document.getElementById('examen');
const ccn = document.getElementById('ccn');
const serie = document.getElementById('serie');

examen.addEventListener('change', () => {
   if (exam.value !== 'BEPC') {
       ccn.style.display = 'grid'; 
   } else {
       ccn.style.display = 'none';
       serie.value = '';
   }
});

form.addEventListener('submit', async (e) => {
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
       serie: serie.value,
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

form.addEventListener('keydown', e => {
   if (e.key === 'enter') {
       e.preventDefault();
       form.requestSubmit();
   } 
});
