class SearchOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .search-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .search-container {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    max-width: 400px;
                    width: 100%;
                }
                .search-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .search-header h2 {
                    margin: 0;
                }
                .search-form {
                    display: flex;
                    flex-direction: column;
                }
                .search-form input, .search-form button {
                    margin-top: 0.5rem;
                }
            </style>
            <div class="search-overlay" data-search-overlay>
                <div class="search-container">
                    <div class="search-header">
                        <h2>Search</h2>
                        <button data-search-cancel>&times;</button>
                    </div>
                    <form data-search-form class="search-form">
                        <input type="text" name="query" placeholder="Search...">
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        const cancelButton = this.shadowRoot.querySelector('[data-search-cancel]');
        const searchForm = this.shadowRoot.querySelector('[data-search-form]');

        if (cancelButton) {
            cancelButton.addEventListener('click', this.handleCancelClick.bind(this));
        }

        if (searchForm) {
            searchForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    handleCancelClick() {
        this.shadowRoot.querySelector('[data-search-overlay]').style.display = 'none';
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData.entries());
        const eventDetail = new CustomEvent('search-form-submitted', {
            detail: filters,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(eventDetail);
    }

    disconnectedCallback() {
        const cancelButton = this.shadowRoot.querySelector('[data-search-cancel]');
        const searchForm = this.shadowRoot.querySelector('[data-search-form]');

        if (cancelButton) {
            cancelButton.removeEventListener('click', this.handleCancelClick.bind(this));
        }

        if (searchForm) {
            searchForm.removeEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }
}

customElements.define('search-overlay', SearchOverlay);
