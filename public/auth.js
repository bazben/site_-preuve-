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
        <div class="vid"></div>
        <P class ="inf">Nom:</P>
        <P class="inf">Prenom:</P>
        <P class="inf">Email:</P>
        <P class="inf">Dte_cretion:</P>
        <button id="logout">Déconnexion</button>
        </div>
        `;
        const cont = document.getElementById('cont');
        document.getElementById('menu').addEventListener('click', () => {
            cont.style.display = 'flex';
        });
        document.getElementById('logout').addEventListener('click', async (e) => {
        e.preventDefault();
            await fetch('https://bazben-site-preuve.onrender.com/', {
               method: 'POST',
                credentials: 'includ'
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
