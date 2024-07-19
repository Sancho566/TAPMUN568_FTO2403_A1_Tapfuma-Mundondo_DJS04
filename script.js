import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import './book-preview.js';
import './search-overlay.js';

let page = 1;
let matches = books;

/**
 * Appends a list of book previews to the DOM.
 * @param {Array} bookList - The list of books to display.
 */
function appendBooksToList(bookList) {
    const fragment = document.createDocumentFragment();
    bookList.forEach(book => {
        const element = document.createElement('book-preview');
        element.setAttribute('author', authors[book.author]);
        element.setAttribute('id', book.id);
        element.setAttribute('image', book.image);
        element.setAttribute('title', book.title);
        fragment.appendChild(element);
    });
    document.querySelector('[data-list-items]').appendChild(fragment);
}

/**
 * Populates a select element with options.
 * @param {HTMLElement} element - The select element to populate.
 * @param {Object} options - The options to add to the select element.
 * @param {string} firstOptionText - The text for the first option.
 */
function populateSelect(element, options, firstOptionText) {
    const fragment = document.createDocumentFragment();
    const firstElement = document.createElement('option');
    firstElement.value = 'any';
    firstElement.innerText = firstOptionText;
    fragment.appendChild(firstElement);

    for (const [id, name] of Object.entries(options)) {
        const optionElement = document.createElement('option');
        optionElement.value = id;
        optionElement.innerText = name;
        fragment.appendChild(optionElement);
    }

    element.appendChild(fragment);
}

/**
 * Applies the chosen theme to the document.
 * @param {string} theme - The chosen theme ('day' or 'night').
 */
function applyTheme(theme) {
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}

/**
 * Initializes event listeners for the application.
 */
function initializeEventListeners() {
    const listItems = document.querySelector('[data-list-items]');
    const searchOverlay = document.querySelector('[data-search-overlay]');
    const settingsOverlay = document.querySelector('[data-settings-overlay]');
    const listButton = document.querySelector('[data-list-button]');
    const listActive = document.querySelector('[data-list-active]');
    const searchForm = document.querySelector('[data-search-form]');
    const settingsForm = document.querySelector('[data-settings-form]');

    listItems.addEventListener('book-preview-clicked', (event) => {
        const active = books.find(book => book.id === event.detail.id);
        if (active) {
            displayBookDetails(active);
        }
    });

    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        searchOverlay.open = false;
    });

    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        settingsOverlay.open = false;
    });

    document.querySelector('[data-header-search]').addEventListener('click', () => {
        searchOverlay.open = true;
        document.querySelector('[data-search-title]').focus();
    });

    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        settingsOverlay.open = true;
    });

    document.querySelector('[data-list-close]').addEventListener('click', () => {
        listActive.open = false;
    });

    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        applyTheme(theme);
        settingsOverlay.open = false;
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        matches = filterBooks(filters);
        renderBooks();
    });

    listButton.addEventListener('click', () => {
        appendBooksToList(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
        page += 1;
        listButton.disabled = matches.length <= page * BOOKS_PER_PAGE;
    });
}

/**
 * Filters books based on the provided filters.
 * @param {Object} filters - The filters to apply.
 * @returns {Array} - The filtered list of books.
 */
function filterBooks(filters) {
    return books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return genreMatch && titleMatch && authorMatch;
    });
}

/**
 * Renders the list of books.
 */
function renderBooks() {
    page = 1;
    document.querySelector('[data-list-items]').innerHTML = '';
    appendBooksToList(matches.slice(0, BOOKS_PER_PAGE));
    const listButton = document.querySelector('[data-list-button]');
    listButton.disabled = matches.length <= BOOKS_PER_PAGE;
    document.querySelector('[data-list-message]').classList.toggle('list__message_show', matches.length === 0);
    listButton.innerText = `Show more (${Math.max(matches.length - BOOKS_PER_PAGE, 0)})`;
}

/**
 * Displays the details of the selected book.
 * @param {Object} book - The book to display.
 */
function displayBookDetails(book) {
    const listActive = document.querySelector('[data-list-active]');
    listActive.open = true;
    document.querySelector('[data-list-blur]').src = book.image;
    document.querySelector('[data-list-image]').src = book.image;
    document.querySelector('[data-list-title]').innerText = book.title;
    document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
    document.querySelector('[data-list-description]').innerText = book.description;
}

// Initialization
populateSelect(document.querySelector('[data-search-genres]'), genres, 'All Genres');
populateSelect(document.querySelector('[data-search-authors]'), authors, 'All Authors');

const prefersDarkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.querySelector('[data-settings-theme]').value = prefersDarkScheme ? 'night' : 'day';
applyTheme(prefersDarkScheme ? 'night' : 'day');

appendBooksToList(matches.slice(0, BOOKS_PER_PAGE));
initializeEventListeners();
document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
