import icons from 'url:../../img/icons.svg';
import Fraction from 'fraction.js'
import View from './View.js'
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `We could not find that recipe. Please try another one!`;
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--update-servings')
      if(!btn) return

      const {updateTo} = btn.dataset;
      
      
      if (+updateTo > 0) handler(+updateTo);

    })
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--bookmark');
      if(!btn) return;
      handler();
    })
  }
  _generateMarkup() {
    return `
      <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cookingTime
              }</span>
            <span class="recipe__info-text">minutes</span>
            </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
              </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '': 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          ${this._data.ingredients
            .map(ing => this._generateMarkupIngredients(ing))
            .join('')}          
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}";
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  _generateMarkupIngredients(ing) {
    return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">
                ${this._formatQuantity(ing.quantity)}                
                </div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>`;
  }

  _formatQuantity(quantity) {
    if (!quantity) return '';

    const f = new Fraction(quantity);
    const value = f.valueOf();

    // Allowed fractions
    const options = [
      { label: '1/3', value: 1 / 3 },
      { label: '2/3', value: 2 / 3 },
      { label: '1/2', value: 1 / 2 },
    ];

    // Add whole numbers (e.g. 1–20, you can adjust the range)
    for (let i = 1; i <= 20; i++) {
      options.push({ label: i.toString(), value: i });
    }

    // Find the closest option
    let closest = options[0];
    let minDiff = Math.abs(value - options[0].value);

    for (const opt of options) {
      const diff = Math.abs(value - opt.value);
      if (diff < minDiff) {
        closest = opt;
        minDiff = diff;
      }
    }

    return closest.label;
  }
}

export default new RecipeView();
