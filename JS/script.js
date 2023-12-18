const characterContainer = document.querySelector('.cards-list');
const paginationContainer = document.getElementById('pagination');
let isSearchActive;
let currentPage = 1;

async function fetchCharacters(page) {
    try {
        const response = await api.get(`/character?page=${page}`);
        const characters = response.data.results;
        renderCharacters(characters);
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
}

function renderContent(data) {
    characterContainer.innerHTML = '';
    if (isSearchActive) {
        renderCharacters(data);
    } else {
        renderPaginationButtons();
        renderCharacters(data);
    }
}
function renderCharacters(characters) {
    characterContainer.innerHTML = '';
    characters.forEach(async character => {
        const card = document.createElement('div');
        const content = document.createElement('div');
            let cardClass;
            if (character.status == "Alive") {
                cardClass = 'dot-alive'
                } else if (character.status === "Dead") {
                    cardClass = 'dot-dead'
                } else {
                    cardClass = 'dot-unknown'
                }
            card.classList.add('card')
            content.classList.add('content')
            const episodeLink = await getEpisode(character.episode[character.episode.length - 1])
            card.innerHTML = `
            <img class="card-image" src="${character.image}">`
            content.innerHTML = `
                <h2 class="card-title" > ${character.name}</h2>
                <h3 class="card-status" ><span class="dot ${cardClass}"></span>${character.status} - ${character.species}</h3>
                <p class="card-location">
                    Última localização conhecida <br> ${character.location.name}</p>
                <p class="card-episode">
                    Visto pela última vez em: ${episodeLink}</p>`;

            card.append(content);
            characterContainer.append(card);
       
        async function getEpisode(link) {
            const response = await api.get(link)
            return response.data.name
         }    
        });
}

async function getEpisode(link) {
    const response = await api.get(link);
    return response.data.name;
}

function renderPaginationButtons() {
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => onPrevButtonClick());
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => onNextButtonClick());
    paginationContainer.appendChild(nextButton);

}

async function onPrevButtonClick() {
    if (currentPage > 1) {
        currentPage--;
        await fetchCharacters(currentPage);
        const paginationText = document.querySelector('h2');
        paginationText.innerText = `Page ${currentPage}`;
    }
}

async function onNextButtonClick() {
    const totalPages = 42;
    if (currentPage < totalPages) {
        currentPage++;
        await fetchCharacters(currentPage);
        const paginationText = document.querySelector('h2');
        paginationText.innerText = `Page ${currentPage}`;
    }
}

async function searchCharacters() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput !== '') {
        isSearchActive = true;
        try {
            const response = await api.get(`/character?name=${searchInput}`);
            const searchedCharacter = response.data.results;
            renderContent(searchedCharacter);
        } catch (error) {
            console.error('Error searching characters:', error);
        }
    } else {
        isSearchActive = false;
        await fetchCharacters(currentPage);
    }
}

async function init() {
    await fetchCharacters(currentPage);
    renderPaginationButtons();
    fetchEverything();
}

init();

async function fetchEverything() {
    const footer = document.getElementById('footer-content');
    const response1 = await api.get('/episode');
    const episodes = (response1.data.info.count);
    const response2 = await api.get('/character');
    const characters = (response2.data.info.count);
    const response3 = await api.get('/location');
    const locations = (response3.data.info.count);
    footer.innerHTML = `<h2> Episodes:${episodes}      Characters:${characters}      Locations:${locations} </h2>`;
}

function reload() {
    location.reload();
}