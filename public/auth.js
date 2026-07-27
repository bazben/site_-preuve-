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
        
        auth.innerHTML = `
        <div class="menu">
            <div class="vid"></div>
        <span class="s">${user.nom} ${user.prenom}</span>
            <button id="logout">Déconnexion</button>
        </div>
        `;
        document.getElementById('logout').addEventListener('click', async (e) => {
        e.preventDefault();
            await fetch('https://bazben-site-preuve.onrender.com/', {
               method: 'POST',
                credentials: 'includ'
            });
        });
    }catch(err) {
        auth.innerHTML = `
        <div class="menu">
            <div class="vid"></div>
        <span class="s"></span>
            <button id="logout">Déconnexion</button>
        </div>
        `;
    }
});