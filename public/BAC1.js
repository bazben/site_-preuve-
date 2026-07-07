const form = document.getElementById('search');
const div = document.getElementById('resultats');

form.addEventListener('submit', async (e) => {
   e.preventDefault() ;
    const serie = document.getElementById('serie').value;
    const annee = document.getElementById('annee').value;
    
    div.innerHTML ='chargement...';
    
    try {
        const res = await fetch(`https://bazben-site-preuve.onrender.com/epreuves/BAC?serie=${serie}&annee=${annee}&exam='BAC1'`);
        if (!res.ok) throw new Error('errur serveur');

        const data = await res.json();
        if (data.length === 0) {
            div.innerHTML = 'Aucune épreuve trouvée!';
            return;
        }
       div.innerHTML ='';
       data.forEach(epreuve => {
        div.innerHTML += `
        <h3>${epreuve.matiere}</h3><br>
         <iframe src="https://docs.google.com/gview?url=${encodeURIComponent(epreuve.fichier_url)}&embedded=true" width="100%" height="200%"></iframe>
         <button onclick="download('${epreuve.fichier_url}', '${epreuve.matiere}')">Télécharger</button>
        
        `;
            });
    }catch(err) {
        console.error(err);
        div.innerHTML = 'Erreur lors du chargement';
    }
});
async function download(url, nom) {
    const resp = await fetch(url);
    const blob = await resp.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nom;
    link.click();
    URL.revokeObjectURL(link.href);
    
}
