
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// if(module.hot) {
//   module.hot.accept()
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //  1. Loading Recipe
    recipeView.renderSpinner();
    
    // 0. Update results view to work selected search results
    resultsView.update(model.getSearchResultsPage());
    
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    
    //  2. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function() {
  try {
    // 1. Get Search query
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if(!query) return;

    // 2. Load search result
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial  Pagination
    paginationView.render(model.state.search);
    
  } catch (err) {
      console.log(err);
      resultsView.renderError();
  }
}

const controlPagination = function(goToPage) {
  // Render NEW Page
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings)

  // Update the recipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {

  // 1) Add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipes = async function(newRecipe) {
  try {

    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
  
    await model.uploadRecipe(newRecipe)
    // Render recipe

    recipeView.render(model.state.recipe);

    // Success
    addRecipeView.renderMessage();

    // Render bookmark view

    bookmarksView.render(model.state.bookmarks)

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    // Close form window
    setTimeout(function() {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000)

  } catch (err) {
    console.error('💀', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipes);
}

init();
