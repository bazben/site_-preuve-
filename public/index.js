const g_div = document.getElementById('news');
async function news() {
   try {
      const res = await fetch('https://bazben-site-preuve.onrender.com/news');
   const news = await res.json();
   news.data.forEach(d => {
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
