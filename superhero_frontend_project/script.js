/*
 
*/

const TOKEN = "97a89643062525edf425a622684f4e3b";
const BASE = `https://superheroapi.com/api.php/${TOKEN}`;

// PROXY para liberar imagem que a SuperHero API bloqueia
const PROXY = "https://cors-anywhere.herokuapp.com/";

const cardsContainer = document.getElementById('cardsContainer');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function createCard(character){
  const card = document.createElement('article');
  card.className = 'card';

  const thumb = document.createElement('div');
  thumb.className = 'thumb';

  const img = document.createElement('img');
  img.alt = character.name;

  // IMAGEM CORRIGIDA (via proxy)
  const originalImg = character.image?.url;
  img.src = originalImg 
    ? PROXY + originalImg 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  const h3 = document.createElement('h3');
  h3.textContent = character.name;

  const publisher = document.createElement('p');
  publisher.textContent =
    character.biography?.publisher
      ? 'Editora: ' + character.biography.publisher
      : 'Editora: -';

  const meta = document.createElement('div');
  meta.className = 'meta';

  const stat1 = document.createElement('div');
  stat1.className = 'stat';
  stat1.textContent =
    'Gênero: ' + (character.appearance?.gender || '-');

  const stat2 = document.createElement('div');
  stat2.className = 'stat';
  stat2.textContent =
    'Altura: ' + (character.appearance?.height?.[1] || '-');

  meta.appendChild(stat1);
  meta.appendChild(stat2);

  thumb.appendChild(img);

  card.appendChild(thumb);
  card.appendChild(h3);
  card.appendChild(publisher);
  card.appendChild(meta);

  return card;
}

async function fetchById(id){
  try{
    const res = await fetch(`${BASE}/${id}`);
    const data = await res.json();
    if (data.response === 'error') return null;
    return data;
  }catch(err){
    console.error('fetchById error', id, err);
    return null;
  }
}

async function searchByName(name){
  try{
    loading.textContent = 'Buscando...';
    cardsContainer.innerHTML = '';

    const res = await fetch(`${BASE}/search/${encodeURIComponent(name)}`);
    const data = await res.json();

    if (!data.results) {
      loading.textContent = 'Nenhum personagem encontrado.';
      return;
    }

    loading.textContent = '';

    data.results.forEach(ch => {
      const card = createCard(ch);
      cardsContainer.appendChild(card);
    });
  }catch(err){
    console.error('searchByName', err);
    loading.textContent = 'Erro ao buscar.';
  }
}

async function init(){
  loading.style.display = 'block';
  loading.textContent = 'Carregando personagens...';

  const ids = Array.from({length: 20}, (_,i) => i+1);
  const promises = ids.map(id => fetchById(id));
  const results = await Promise.all(promises);

  loading.style.display = 'none';
  cardsContainer.innerHTML = '';

  results.forEach(ch => {
    if (ch) cardsContainer.appendChild(createCard(ch));
  });
}

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if(!q) return alert('Digite o nome do personagem para buscar');
  searchByName(q);
});

searchInput.addEventListener('keyup', (e) => {
  if(e.key === 'Enter') searchBtn.click();
});

window.addEventListener('DOMContentLoaded', init);
