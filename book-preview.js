class BookPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const author = this.getAttribute('author') || 'Unknown Author';
        const id = this.getAttribute('id') || 'Unknown ID';
        const image = this.getAttribute('image') || 'default-image.jpg';
        const title = this.getAttribute('title') || 'Untitled';

        this.render();
        this.addEventListeners();
    }

    render() {
        const author = this.getAttribute('author');
        const id = this.getAttribute('id');
        const image = this.getAttribute('image');
        const title = this.getAttribute('title');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --preview-border: 1px solid #ccc;
                    --preview-border-radius: 4px;
                    --preview-padding: 16px;
                    --preview-background: white;
                    --preview-image-width: 100px;
                    --preview-image-height: 150px;
                    --preview-info-margin-top: 8px;
                    --preview-title-font-size: 1em;
                    --preview-author-font-size: 0.8em;
                    --preview-author-color: #555;
                }
                .preview {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: var(--preview-border);
                    border-radius: var(--preview-border-radius);
                    padding: var(--preview-padding);
                    background: var(--preview-background);
                    cursor: pointer;
                }
                .preview__image {
                    width: var(--preview-image-width);
                    height: var(--preview-image-height);
                    object-fit: cover;
                }
                .preview__info {
                    margin-top: var(--preview-info-margin-top);
                    text-align: center;
                }
                .preview__title {
                    font-size: var(--preview-title-font-size);
                    margin: 0;
                }
                .preview__author {
                    font-size: var(--preview-author-font-size);
                    color: var(--preview-author-color);
                }
            </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" alt="Book cover of ${title}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${author}</div>
                </div>
            </button>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector('.preview').addEventListener('click', this.handleClick.bind(this));
    }

    handleClick() {
        const id = this.getAttribute('id');
        const event = new CustomEvent('book-preview-clicked', {
            detail: { id },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('.preview').removeEventListener('click', this.handleClick.bind(this));
    }
}

customElements.define('book-preview', BookPreview);
