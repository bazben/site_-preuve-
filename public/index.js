const brmenu = document.getElementById('brmenu');
const btbut = document.getElementById('brbut');



btbut.addEventListener('click', (e) => {
   if(brmenu.style.display == 'none') {
      brmenu.style.display = 'grid';
       btbut.style.left ='150px';
      brmenu.style.transition = '0.3s';
   }else {
      brmenu.style.display = 'none';
    btbut.style.left = 0;  
      brmenu.style.transition = '0.3s';
   }
});
if(brmenu.style.display == 'none') {
   btbut.style.left = 0;
}




const g_div = document.getElementById('news');
async function news() {
   try {
      const res = await fetch('https://bazben-site-preuve.onrender.com/news');
   const news = await res.json();
   news.data.news1.forEach(d => {
      const div = document.createElement('div');
      div.className = 'news';
      const a = document.createElement('a');
      a.className = 'aa';
   a.href = d.link;
      const img = document.createElement('img');
      img.src = d.img;
      img.className = 'mag';
      a.appendChild(img);
      const h2 = document.createElement('h2');
      h2.textContent = d.title;
      a.appendChild(h2);
      div.appendChild(a);
      g_div.appendChild(div);
      });
       news.data.news2.forEach(d => {
      const div = document.createElement('div');
      div.className = 'news';
      const a = document.createElement('a');
      a.className = 'aa';
   a.href = d.link;
      const img = document.createElement('img');
      img.src = d.img;
      img.className = 'mag';
      a.appendChild(img);
      const h2 = document.createElement('h2');
      h2.textContent = d.title;
      a.appendChild(h2);
      div.appendChild(a);
      g_div.appendChild(div);
      });
   }catch(err) {
      console.log("voici:", err);
   }
   
}

news();
