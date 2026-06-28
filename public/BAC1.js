const form = document.getElementById('search');
const div = document.getElementById('resultats');

form.addEventListener('submit', async (e) => {
   e.preventDefault() ;
    const serie = document.getElementById('serie').value;
    const annee = document.getElementById('annee').value;
    
    div.innerHTML ='chargement...';
    
    try {
        const res = await fetch(`http://localhost:3000/epreuves?serie=${serie}&annee=${annee}`);
        if (!res.ok) throw new Error('errur serveur');
        const data = await res.json();
        if (data.length === 0) {
            div.innerHTML = 'Aucune épreuve trouvée!';
            return;
        }
        const epreuve = data[0];
        
        div.innerHTML = `
        <h3>${epreuve.matiere}</h3><br>
        <iframe src="${epreuve.fichier_url}" width="100%" height="700px"></iframe>
        
        `;
    }catch(err) {
        console.error(err);
        div.innerHTML = 'Erreur lors du chargement';
    }
});