class Pokemon {
    constructor(name, url, imageUrl) {
      this.name = name;
      this.url = url;
      this.imageUrl = imageUrl;
    }
    getDisplayName() {
      return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
  }
  
  
  const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=150';
  let pokemonList = [];
  
  const searchInput = document.getElementById('search');
  const totalElement = document.getElementById('total');
  const pokemonListElement = document.getElementById('pokemon-list');
  
  const renderList = (list) => {
    pokemonListElement.innerHTML = '';
    list.forEach(pokemon => {
      const listItem = document.createElement('li');
  
      const img = document.createElement('img');
      img.src = pokemon.imageUrl;
      img.alt = pokemon.name;
      img.style.width = '90px';
  
      const name = document.createElement('span');
      name.textContent = pokemon.getDisplayName();
  
      listItem.appendChild(img);
      listItem.appendChild(name);
      pokemonListElement.appendChild(listItem);
    });
  };
  
  
  async function getFirstPokemonDetails() {
    if (pokemonList.length > 0) {
      try {
        const firstPokemon = pokemonList[0];
        const detailResponse = await fetch(firstPokemon.url);
        const detailData = await detailResponse.json();
        console.log(`Ejemplo: Tipo principal de ${firstPokemon.getDisplayName()} = ${detailData?.types?.[0]?.type?.name ?? 'desconocido'}`);
      } catch (err) {
        console.error('Error al obtener detalles del primer Pokémon:', err);
      }
    }
  }
  
  fetch(API_URL)
  .then(response => response.json())
  .then(async (data) => {
    const { results: allPokemon } = data;
    totalElement.textContent = `Total de Pokémon: ${allPokemon.length}`;

    pokemonList = await Promise.all(
      allPokemon.map(async ({ name, url }) => {
        const detailResponse = await fetch(url);
        const detailData = await detailResponse.json();
        return new Pokemon(name, url, detailData.sprites.front_default);
      })
    );

    renderList(pokemonList);
  })
  .catch(error => {
    console.error('Error al obtener los datos de Pokémon:', error);
  });

  
  searchInput.addEventListener('input', (event) => {
    let searchTerm = event.target.value.toLowerCase();
    const filteredList = pokemonList.filter(pokemon => pokemon.name.includes(searchTerm));
    renderList(filteredList);
  });