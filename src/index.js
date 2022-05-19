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

function onFormSubmit(evt) {
  evt.preventDefault();
  refs.galleryBox.innerHTML = "";
  
  imagesApiService.query = evt.currentTarget.elements.query.value;
  console.log(imagesApiService.query)
  if (ImagesApiService.query === "") {
    return
  } else {
  imagesApiService.fetchImages().then(images => {
    imgsArray = images.hits;
    
      // console.log(ImagesApiService.query)
      refs.galleryBox.insertAdjacentHTML("beforeend", renderGalleryMarkup(imgsArray));
    
    })
  }
  
    // console.log(searchQuery)

}

function onLoadMore() {
  // imagesApiService.incremenyPage();
 imagesApiService.incremenyPage();
  imagesApiService.fetchImages();
  refs.galleryBox.insertAdjacentHTML("beforeend", renderGalleryMarkup(imgsArray));
}



function renderGalleryMarkup(images) {
 
    return images.map(image => 
      `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags }" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${image.likes}Likes</b>
    </p>
    <p class="info-item">
      <b>${image.views}Views</b>
    </p>
    <p class="info-item">
      <b>${image.comments}Comments</b>
    </p>
    <p class="info-item">
      <b>${image.downloads}Downloads</b>
    </p>
  </div>
</div>`

    ).join("")
}
