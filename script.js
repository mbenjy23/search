let coran = {};

fetch('coran.json')
  .then(res => res.json())
  .then(data => {
    coran = data;
    displayVerses('');
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const term = e.target.value.trim();
      displayVerses(term);
    });
  });

  function removeDiacritics(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // chakl
      .replace(/ٱ/g, 'ا')      // alif wasl
      .replace(/ـٰ/g, '')      // madd avec tatweel
      .replace(/ـ/g, '');      // tatweel seul
  }
  
  
  

function displayVerses(searchTerm) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  const normalizedSearch = removeDiacritics(searchTerm);
  
  for (const sourate in coran) {
    for (const verset in coran[sourate]) {
      const entry = coran[sourate][verset];
      const normalizedText = removeDiacritics(entry.ar);

      if (!normalizedSearch || normalizedText.includes(normalizedSearch)) {
        const div = document.createElement('div');
        div.className = 'verse';
        div.innerHTML = `
          <div><strong>Sourate ${sourate}, Verset ${verset}</strong></div>
          <div class="ar">${entry.ar}</div>
          <div class="fr">${entry.fr}</div>
        `;
        results.appendChild(div);
      }
    }
  }
}
