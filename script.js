let coran = {};

Promise.all([
  fetch('https://api.alquran.cloud/v1/quran/quran-uthmani').then(res => res.json()),
  fetch('https://api.alquran.cloud/v1/quran/fr.hamidullah').then(res => res.json())
])
.then(([arRes, frRes]) => {
  const result = {};
  const arabicSurahs = arRes.data.surahs;
  const frenchSurahs = frRes.data.surahs;
  console.log("ar", arRes);
  console.log("fr", frRes);

  arabicSurahs.forEach((surah, sIndex) => {
    const s = String(surah.number);
    result[s] = {};

    surah.ayahs.forEach((ayah, aIndex) => {
      const a = String(ayah.numberInSurah);
      const frText = frenchSurahs[sIndex]?.ayahs[aIndex]?.text || '[Traduction manquante]';

      result[s][a] = {
        ar: ayah.text,
        fr: frText
      };
    });
  });

  coran = result;
  document.getElementById('loader').style.display = 'none';

  displayVerses('');
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.trim();
    displayVerses(term);
  });
});

function normalizeArabic(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/\ufeff/g, '')
    .replace(/ٱ/g, 'ا')
    .replace(/ـٰ/g, '')
    .replace(/ـ/g, '')
    .trim();
}


function normalizeArabic(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // chakl
    .replace(/\ufeff/g, '')      // BOM
    .replace(/ٱ/g, 'ا')          // alif wasl
    .replace(/ـٰ/g, '')          // madd
    .replace(/ـ/g, '')           // tatweel
    .trim();
}



  function removeDiacritics(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // chakl
      .replace(/ٱ/g, 'ا')      // alif wasl
      .replace(/ـٰ/g, '')      // madd
      .replace(/ـ/g, '')       // tatweel
      .replace(/\u200C|\u200D|\u200E|\u200F|\u202A-\u202E/g, '') // zero-width/invisibles
      .replace(/\s+/g, '');    // tous les espaces visibles et invisibles
  }
  
  
  

function displayVerses(searchTerm) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  const normalizedSearch = removeDiacritics(searchTerm);
  
  for (const sourate in coran) {
    for (const verset in coran[sourate]) {
      const entry = coran[sourate][verset];
      const normalizedText = removeDiacritics(entry.ar);
      console.log("Texte normalisé :", removeDiacritics(entry.ar));
      console.log("Recherche normalisée :", removeDiacritics(searchTerm));


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
