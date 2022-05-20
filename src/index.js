import './sass/main.scss';
const axios = require('axios').default;
// all modules
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";
import ImagesApiService from "./js/api-service"

const imagesApiService = new ImagesApiService()
const refs = {
    searchForm: document.querySelector("#search-form"),
    searchBtn: document.querySelector("button"),
    loadMoreBtn: document.querySelector(".load-more"),
    galleryBox: document.querySelector(".gallery"),
}



let imgsArray = [];

refs.searchForm.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMore);
refs.galleryBox.addEventListener("click", onGalleryItemClick)

function onFormSubmit(evt) {
  evt.preventDefault();
  refs.galleryBox.innerHTML = "";
  refs.loadMoreBtn.classList.add("-is-hidden");
  
  imagesApiService.query = evt.currentTarget.elements.query.value;
  if (ImagesApiService.query === "") {
    return
  } else {
    imagesApiService.resetPage()
    imagesApiService.fetchImages().then(images => {
    imgsArray = images.hits;
    
      if (imgsArray.length === 0) {
      showMessage()
    } else {
      appendImagesMarkup();
    }
    })
  }
  
}

function appendImagesMarkup() {
   refs.galleryBox.insertAdjacentHTML("beforeend", renderGalleryMarkup(imgsArray));
      refs.loadMoreBtn.classList.remove("-is-hidden");
      let gallery = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: 250,
});
}

function showMessage() {

       refs.loadMoreBtn.classList.add("-is-hidden");
      Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
}

function onLoadMore() {
  imagesApiService.incrementPage();

  imagesApiService.fetchImages().then(images => {
   
    imgsArray = images.hits;
    
    refs.galleryBox.insertAdjacentHTML("beforeend", renderGalleryMarkup(imgsArray));
     
    // gallery.refresh();
  })
 
}

function renderGalleryMarkup(images) {
  return images.map(image => 
      `<div class="photo-card">
  <a href="${image.largeImageURL}" ><img class="gallery-img" src="${image.webformatURL}" alt="${image.tags }" loading="lazy" /></a>
  <ul class="info-list">
    <li class="info-item"> <b>Likes</b><span class="value">${image.likes}</span>
     
    </li>
    <li class="info-item"><b>Views</b><span class="value">${image.views}</span>
      
    </li>
    <li class="info-item"> <b>Comments</b><span class="value">${image.comments}</span>
     
    </li>
    <li class="info-item"><b>Downloads</b><span class="value">${image.downloads}</span>
      
    </li>
  </ul></div>
`

    ).join("")
}
function onGalleryItemClick(event) {
   event.preventDefault();
  const isGalleryImage = event.target.classList.contains("gallery-img");
  if (!isGalleryImage) {
    return;
  }
}

