const form = document.getElementById("form");
const div = document.getElementById("div");

form.addEventListener('submit', async (e) => {
   e.preventDefault();
    const annee = document.getElementById("annee");
    
    div.innerHTML = "loading...";
    try {
        const res = await fetch(`https://bazben-site-preuve.onrender.com/epreuves?annee=${annee}&exam=BEPC`);
        const data = res.json();
        
        if (data.length === 0) {
            div.innerHTML = "aucune épreuve pour le moment";
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
        console.log("voici l'erreur : ", err);
        div.innerHTML = "Erreur lors du chargement";
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
