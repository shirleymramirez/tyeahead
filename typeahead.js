const BASE_URL = 'https://api.frontendexpert.io/api/fe/glossary-suggestions';

// Write your code here.
const urlEndpoint = new URL(BASE_URL);

const inputElement = document.getElementById('typeahead');
const listElement = document.getElementById('suggestions-list');

inputElement.addEventListener('input', handleInput);
listElement.addEventListener('click', handleSuggestionClick);

function debounce(callback, time) {
  let timerId;

  const debounced = function(...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, time);
  };

  debounced.cancel = function() {
    clearTimeout(timerId);
  }

  return debounced;
}

async function callApi(urlEndpoint, searchText) {
  urlEndpoint.searchParams.set('text', searchText);
  const res = await fetch(urlEndpoint);
  const json = await res.json();
  return json;
}

async function getSuggestionList(urlEndpoint, searchText) {
  const suggestionData = await callApi(urlEndpoint, searchText);
  const fragment = document.createDocumentFragment();

  suggestionData.forEach(suggestion => {
    const li = document.createElement('li');
    li.textContent = suggestion;
    fragment.appendChild(li);
  });

  listElement.replaceChildren(fragment);
}

const getSuggestionListDebounced = debounce(getSuggestionList, 500);

function clearSuggestionsList() {
  listElement.innerHTML = '';
}

async function handleInput(e) {
  const searchText = e.target.value;

  if(searchText === '') {
    getSuggestionListDebounced.cancel();
    clearSuggestionsList();
    return;
  }

  getSuggestionListDebounced(urlEndpoint, searchText);
}

function handleSuggestionClick(e) {
  const selectedItemText = e.target.closest('li')?.textContent;
  inputElement.value = selectedItemText;
  clearSuggestionsList();
}
