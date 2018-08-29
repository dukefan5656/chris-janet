'use strict';
const store = (function(){
  videos: []
}());



const API_KEY = 'AIzaSyA0i_skrMX1fC5anAjTd_QV1jRRxwxSo14';

/*
  We want our store to hold an array of "decorated" video objects - i.e. objects that
  have been transformed into ONLY the necessary data we're displaying on our page. 
  (Removes extraneous dataset from Youtube.)
  
  Example decorated video object:
  
  {
    id: '98ds8fbsdy67',
    title: 'Cats dancing the Macarena',
    thumbnail: 'https://img.youtube.com/some/thumbnail.jpg'
  }
*/


// TASK: Add the Youtube Search API Base URL here:
// Documentation is here: https://developers.google.com/youtube/v3/docs/search/list#usage
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * @function fetchVideos
 * Async function, responsible for calling the Youtube API with jQuery, constructing
 * the correct query object, and passing along the callback into the AJAX call.
 * @param {string}   searchTerm
 * @param {function} callback
 */
// TASK:
// 1. Use `searchTerm` to construct the right query object based on the Youtube API docs
//    - Refer to curriculum assignment for help with the required parameters
// 2. Make a getJSON call using the query object and sending the provided callback in
//    as the last argument
//
// TEST IT! Execute this function and console log the results inside the callback.

const fetchVideos = function(searchTerm, dataHolder) {
  const query = {
    order: 'relevance',
    part: 'snippet',
    key: API_KEY,
    q: searchTerm
    
  };

  $.getJSON(BASE_URL, query, dataHolder);
};

//TESTING fetchVideos by pushing in our params
// fetchVideos('cats', callback => {
//   console.log(callback);
// });

/**
 * @function decorateResponse
 * Uses Youtube API response to create an array of "decorated" video objects as
 * defined at the top of the file.
 * @param   {object} response - should match Youtube API response shape
 * @returns {array}
 */

// TASK:
// 1. Map through the response object's `items` array

// 2. Return an array of objects, where each object contains the keys `id`, `title`,
//    `thumbnail` which each hold the appropriate values from the API item object. You
//    WILL have to dig into several nested properties!
//
// TEST IT! Grab an example API response and send it into the function - make sure
// you get back the object you want.
const decorateResponse = function(response) {
  return response.items.map(fannyPack => {
    return {
      id: fannyPack.id.videoId,
      title: fannyPack.snippet.title,
      thumbnail: fannyPack.snippet.thumbnails.default.url,
      description: fannyPack.snippet.description
    };
  });
};
console.log(decorateResponse(MOCK_DATA));
//decorateResponse(MOCK_DATA);

/**
 * @function generateVideoItemHtml
 * Template function, creates an HTML string from a single decorated video object
 * @param   {object} video - decorated video object
 * @returns {string} HTML
 */
// TASK:
// 1. Using the decorated object, return an HTML string containing all the expected
// TEST IT!
const generateVideoItemHtml = function(video) {
  return `<li data-id="${video.id}">
            <h3>${video.title}</h3>
            <img src="${video.thumbnail}"/>
            <p>${video.description}</p>
          </li>
  `;
};

const decoratedArrayOfVideos = decorateResponse(MOCK_DATA);
console.log(generateVideoItemHtml(decoratedArrayOfVideos[2]));

/**
 * @function addVideosToStore
 * Store modification function to set decorated video objects
 * @param {array} videos - decorated video objects
 */
// TASK:
// 1. Set the received array as the value held in store.videos
// TEST IT!
const addVideosToStore = function(videos) {
  store.videos = videos;
};

/**
 * @function render
 * Responsible for scanning store and rendering the video list to DOM
 */
// TASK:
// 1. Map through `store.videos`, sending each `video` through `generateVideoItemHtml`
// 2. Add this array of DOM elements to the appropriate DOM element
// TEST IT!
const render = function() {
  const htmlElements = store.videos.map(fannyPack => generateVideoItemHtml(fannyPack));
  $('.results').html(htmlElements);
};

/**
 * @function handleFormSubmit
 * Adds form "submit" event listener that 1) initiates API call, 2) modifies store,
 * and 3) invokes render
 */
// TASK:
// 2. Add an event listener to the form that will:
//   a) Prevent default event
//   b) Retrieve the search input from the DOM
//   c) Clear the search input field
//   d) Invoke the `fetchVideos` function, sending in the search value
//   e) Inside the callback, send the API response through the `decorateResponse` function
//   f) Inside the callback, add the decorated response into your store using the
//      `addVideosToStore` function
//   g) Inside the callback, run the `render` function
// TEST IT!
const handleFormSubmit = function() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#search-term').val();
    event.target.reset();
    

    fetchVideos(searchTerm, response => {
      const decoratedVideos = decorateResponse(response);
      addVideosToStore(decoratedVideos);
      render();
    });
  });
};

// When DOM is ready:
$(function() {
  handleFormSubmit();
  // TASK:
  // 1. Run `handleFormSubmit` to bind the event listener to the DOM
});
