const API_ALL = "https://akabab.github.io/superhero-api/api/all.json";
const API_ID = "https://akabab.github.io/superhero-api/api/id/"; 
const cardsContainer = document.getElementById("cardsContainer"); 
const loading = document.getElementById("loading"); 
const searchInput = document.getElementById("searchInput"); 
const searchBtn = document.getElementById("searchBtn");

let allHeroes = [];

// Cria o card do personagem
function createCard(character) { 
  const card = document.createElement("article"); 
  card.className = "card";

  const thumb = document.createElement("div"); 
  thumb.className = "thumb";

const img = document.createElement("img"); 
img.alt = character.name;
img.src = character.images?.md || "https://via.placeholder.com/300x300?text=No+Image";
thumb.appendChild(img);


const h3 = document.createElement("h3"); 
h3.textContent = character.name;

const publisher = document.createElement("p");
publisher.textContent = "Editora: " + (character.biography?.publisher || "-");

const meta = document.createElement("div"); 
meta.className = "meta";

const stat1 = document.createElement("div"); stat1.className = "stat"; 
stat1.textContent = "Gênero: " + (character.appearance?.gender || "-");

const stat2 = document.createElement("div"); stat2.className = "stat"; 
stat2.textContent = "Altura: " + (character.appearance?.height || "-");

meta.appendChild(stat1); 
meta.appendChild(stat2);

card.appendChild(thumb); 
card.appendChild(h3); 
card.appendChild(publisher); 
card.appendChild(meta);
 return card;
} 

//Carrega todos os personagens  
async function init() { loading.textContent = "Carregando personagens...";

const res = await fetch(API_ALL); 
allHeroes = await res.json();

loading.style.display = "none"; 
cardsContainer.innerHTML = "";
allHeroes.slice(0, 20).forEach((hero) => { cardsContainer.appendChild(createCard(hero)); 

}); 
}

// Busca por nome 
 function searchByName(name) { 
  cardsContainer.innerHTML = ""; 
  loading.textContent = "Buscando...";
  const results = allHeroes.filter((hero) => hero.name.toLowerCase().includes(name.toLowerCase()) );
  loading.textContent = "";
  if (results.length === 0) { cardsContainer.innerHTML = "<p>Nenhum personagem encontrado.</p>";
    return; 
  }
  results.forEach((hero) => { cardsContainer.appendChild(createCard(hero)); 

  });
 }

 searchBtn.addEventListener("click", () => { const q = searchInput.value.trim(); 
  if (!q) return alert("Digite um nome para buscar."); 
  searchByName(q); 
});
window.addEventListener("DOMContentLoaded", init);

