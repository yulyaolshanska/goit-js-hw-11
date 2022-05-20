const API_KEY = "27514706-1af0f4bdda68331af5d6dbbc9";
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
    
}
    fetchImages() {
   
 return fetch(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=safesearch&page=${this.page}&per_page=40`).then(response => response.json())
    }
    
    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
    incrementPage() {
        this.page += 1;
        console.log(this.page)
    }
    resetPage() {
         this.page = 1;
    }

  }  
