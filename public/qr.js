const sec1 = document.getElementById('sec1');
const sec2 = document.getElementById('sec2');
const bt1 = document.getElementById('bt1');
const bt2 = document.getElementById('bt2');
bt1.addEventListener('click', (e) => {
   e.preventDefault();
    sec1.style.display = 'none';
    sec2.style.display = 'grid';
});
bt2.addEventListener('click', (e) => {
   e.preventDefault();
    sec1.style.display = 'grid';
    sec2.style.display = 'none';
});

let instanceQR = null;

    function creerLeQR() {
        const donnees = document.getElementById("user-input").value;
        const conteneur = document.getElementById("qrcode");

        if (donnees.trim() === "") {
            conteneur.innerHTML = "Veuillez entrer un lien ou un texte !";
            return;
        }

        // Nettoyer le QR Code précédent
        conteneur.innerHTML = "";

        // Utilisation immédiate de la bibliothèque chargée par Internet
        instanceQR = new QRCode(conteneur, {
            text: donnees,
            width: 200,
            height: 200,
            colorDark : "#010006",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

let scanner = new Html5Qrcode('reader');

function demarrer() {
    scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
       function(text) {
        document.getElementById('result').innerText = text;
           scanner.stop();
        }
    );
}

document.getElementById('fichier').addEventListener('change',
                                                   function(){
    const file = this.files[0];
    if(!file) return;
    scanner.scanFile(file, true)
    .then(function(text){
        document.getElementById('result').innerText = text;
    })
    .catch(function(err){
        console.log(err);
    });
}
                                                   );
