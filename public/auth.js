document.addEventListener('DOMContentLoaded', async () => {
   const auth = document.getElementById('auth');
    
    try {
        const res = await fetch('https://bazben-site-preuve.onrender.com/me', {
           method: 'GET',
            credentials: 'include'
        });
        
        if(!res.ok) throw new Error("Non connecté");
        
        const data = await res.json();
        const user = data.user;
        console.log("user: ", user);
        auth.innerHTML = `
        <a href="#" id="menu">
        <div class="menu">
            <div class="vid"></div>
        <span class="s">${data.user.nom} ${data.user.prenom}</span>
        </div>
        </a>
         <div id="cont">
        <img src="${data.user.img_url}" alt="Photo de profil" id="img">
        <P class ="inf">Nom: ${data.user.nom}</P>
        <P class="inf">Prenom: ${data.user.prenom}</P>
        <P class="inf">Email: ${data.user.email}</P>
        <P class="inf">Dte_cretion: ${data.user.creea}</P>
        <button id="logout">Déconnexion</button>
        </div>
        `;
        const cont = document.getElementById('cont');
        document.getElementById('menu').addEventListener('click', (e) => {
            e.stopPropagation();
            cont.style.display = 'flex';
        });
        document.addEventListener('click', () => {
            cont.style.display = 'none';
        });
        document.getElementById('logout').addEventListener('click', async (e) => {
        e.preventDefault();
            await fetch('https://bazben-site-preuve.onrender.com/logout', {
               method: 'POST',
                credentials: 'include'
            });
            location.reload();
        });
    }catch(err) {
        auth.innerHTML = `
        <a href="connexion.html">
         <div class="menu">
            <div class="vid"></div>
        <span class="s">Se connecter</span>
        </div>
        </a>
        `;
    }
});
