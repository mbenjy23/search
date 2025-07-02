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

function displayVerses(searchTerm) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  for (const sourate in coran) {
    for (const verset in coran[sourate]) {
      const entry = coran[sourate][verset];
      if (!searchTerm || entry.ar.includes(searchTerm)) {
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
