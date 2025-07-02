let coran = {};

fetch('coran.json')
  .then(res => res.json())
  .then(data => {
    coran = data;
    document.getElementById('searchInput').addEventListener('input', handleSearch);
  });

function handleSearch() {
  const searchTerm = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (searchTerm.length < 2) return;

  for (const sourate in coran) {
    for (const verset in coran[sourate]) {
      const entry = coran[sourate][verset];
      if (entry.ar.includes(searchTerm)) {
        const div = document.createElement('div');
        div.className = 'verse';
        div.innerHTML = `
          <div><strong>Sourate ${sourate}, Verset ${verset}</strong></div>
          <div class="ar">${entry.ar}</div>
          <div class="fr">${entry.fr}</div>
        `;
        resultsDiv.appendChild(div);
      }
    }
  }
}
