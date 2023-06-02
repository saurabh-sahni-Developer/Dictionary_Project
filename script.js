// Function to generate a word card
function createWordCard(word, meaning) {
  const card = document.createElement('div');
  card.className = 'word-card';

  const heading = document.createElement('h2');
  heading.textContent =  word;

  const definition = document.createElement('p');
  definition.textContent = 'Meaning: '+  meaning;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete';

  // Event listener for delete button
  deleteButton.addEventListener('click', function() {
    card.remove();
    removeWordFromLocalStorage(word);
  });

  card.appendChild(heading);
  card.appendChild(definition);
  card.appendChild(deleteButton);

  return card;
}

// Function to fetch word data from the API
async function getWordData(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const meaning = data[0]?.meanings[0]?.definitions[0]?.definition;
      return meaning;
    } else {
      throw new Error(`Network response was not ok. Status code: ${response.status}`);
    }
  } catch (error) {
    alert('Enter a valid word');
    console.log('Error:', error.message);
    return null;
  }
}

// Function to save word to localStorage
function saveWordToLocalStorage(word, meaning) {
  const searches = getSearchesFromLocalStorage() || [];
  searches.push({ word, meaning });
  localStorage.setItem('searches', JSON.stringify(searches));
}

// Function to remove word from localStorage
function removeWordFromLocalStorage(word) {
  const searches = getSearchesFromLocalStorage() || [];
  const updatedSearches = searches.filter(search => search.word !== word);
  localStorage.setItem('searches', JSON.stringify(updatedSearches));
}

// Function to get searches from localStorage
function getSearchesFromLocalStorage() {
  const searches = localStorage.getItem('searches');
  return searches ? JSON.parse(searches) : null;
}

// Function to handle search
async function handleSearch() {
  const searchInput = document.getElementById('search-input');
  const word = searchInput.value.trim();

  if (word) {
    const meaning = await getWordData(word);
    if (meaning) {
      const wordCard = createWordCard(word, meaning);

      const searchWordCardContainer = document.getElementById('search-word-card-container');
      searchWordCardContainer.innerHTML = '';
      searchWordCardContainer.appendChild(wordCard);

      // const wordCardsContainer = document.getElementById('word-cards-container');
      // wordCardsContainer.appendChild(wordCard);

      saveWordToLocalStorage(word, meaning);

      searchInput.value = '';
    } else {
      console.log('No data found for the entered word.');
    }
  } else {
    alert('Please enter a word');
    console.log('Please enter a word to search.');
  }
}

// Event listener for search button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', handleSearch);

// Render word cards from localStorage on page load


// Function to render word cards from localStorage
function renderWordCardsFromLocalStorage(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const searches = getSearchesFromLocalStorage();
  if (searches && searches.length > 0) {
    searches.forEach(search => {
      const wordCard = createWordCard(search.word, search.meaning);
      container.appendChild(wordCard);
    });
  } else {
    // container.textContent = 'No search history found.';
    const message = document.createElement('p');
    message.classList.add('message');
    message.textContent = 'No search history found.';
    container.appendChild(message);
  }
}


