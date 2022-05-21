import './sass/main.scss';
const axios = require('axios').default;
// all modules
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";
import ImagesApiService from "./js/api-service"


const refs = {
    searchForm: document.querySelector("#search-form"),
    searchBtn: document.querySelector("button"),
    loadMoreBtn: document.querySelector(".load-more"),
    galleryBox: document.querySelector(".gallery"),
}

const imagesApiService = new ImagesApiService()
let imgsArray = [];
let gallery = null;
let totalHits = null;

refs.searchForm.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMore);
refs.galleryBox.addEventListener("click", onGalleryItemClick)

function onFormSubmit(evt) {
  evt.preventDefault();
  clearImgContainer()
  imagesApiService.query = evt.currentTarget.elements.query.value;
  if (imagesApiService.query === "") {
     Notiflix.Notify.warning(`Please, enter your request in the input field`, {
          timeout: 4000,
        });
    return
  } else {
    imagesApiService.resetPage()
    imagesApiService.fetchImages().then(images => {
      totalHits = images.totalHits
     
    imgsArray = images.hits;
    if (imgsArray.length === 0) {
        showMessage()
      }
      if (imgsArray.length < 40) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {
          timeout: 4000,
        });
        
        appendImagesMarkup(imgsArray);
        refs.loadMoreBtn.classList.add("-is-hidden");
        newSimpleLightbox();
   
    } else {
       Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {
          timeout: 4000,
        });
        appendImagesMarkup(imgsArray);
        newSimpleLightbox();
    }
    }).catch(error => console.log(error));
  }
  
}

function onLoadMore() {
  imagesApiService.incrementPage();
  imagesApiService.fetchImages().then(images => {
   imgsArray = images.hits;
    if (imgsArray.length < 40) {
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`, {
          timeout: 4000,
      });
      refs.loadMoreBtn.classList.add("-is-hidden");
   }
   refs.galleryBox.insertAdjacentHTML("beforeend", renderGalleryMarkup(imgsArray));
   refreshSimpleLightbox();
  }).catch(error => {
      return console.log(error);
    });
 
}

function clearImgContainer() {
 refs.galleryBox.innerHTML = "";
  refs.loadMoreBtn.classList.add("-is-hidden");
}

function appendImagesMarkup(array) {
   refs.galleryBox.insertAdjacentHTML("beforeend", renderGalleryMarkup(array));
   refs.loadMoreBtn.classList.remove("-is-hidden");
    
}

function showMessage() {
    Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`, {
          timeout: 4000,
        });
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
`).join("")
}

function onGalleryItemClick(event) {
   event.preventDefault();
  const isGalleryImage = event.target.classList.contains("gallery-img");
  if (!isGalleryImage) {
    return;
  }
}

function newSimpleLightbox() {
  gallery = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: 250,
});
}

function refreshSimpleLightbox() {
  gallery.refresh()
}

