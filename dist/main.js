let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []
var firstload = false;

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */


document.getElementById("mapImage").addEventListener('click', function(e) {
  initMap();
  e.stopPropagation();  
});


document.addEventListener('DOMContentLoaded', (event) => {
 
   
  init();

  updateRestaurants();

  fetchNeighborhoods();
  fetchCuisines();
  //fetchReviewsHTML();
 
  
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

fetchReviewsHTML = () => {
  DBHelper.fetchReviewsHTML((error, reviews) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.reviews = reviews;
      fillReviewsHTML(self.reviews);  ///fillReviewsHTML
    }
  });
}


fillReviewsHTML = (reviews = self.reviews) => {
  console.log('rev test',reviews);
 /* const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });*/
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });


 
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
      lazyLoadImages();



    }

  })

}


var lazyImageObserver;
function lazyLoadImages() {
 var lazyLoadImages = Array.from(document.getElementsByClassName('lazy'));
 var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
     lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
           lazyImage.src = lazyImage.dataset.src;
                lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
             //console.log('img not observed',lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      //console.log('img observed',lazyImage);
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to a more compatible method here
  }


/**
 * Lazy load offscreen images

if ("IntersectionObserver" in window) {
    lazyImageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                let lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.srcset = lazyImage.dataset.srcset;
                lazyImageObserver.unobserve(lazyImage);

            }
        });
    });
} */


}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });

  if(firstload == true)
    addMarkersToMap();

  firstload = true;
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  /*image.className = 'lazy restaurant-img';
   var path = DBHelper.imageUrlForRestaurant(restaurant);
  image.src = "/img/clear.gif";
  image.srcset = path;
  //image.data-srcset = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name;*/


  image.classList.add('restaurant-img');
  image.classList.add('lazy');

  image.width = "300px";

 const imageUrl = DBHelper.imageUrlForRestaurant(restaurant);
  image.dataset.src = imageUrl;

  const imagePath = imageUrl.substring(0, imageUrl.lastIndexOf('.'));
  const imageType = imageUrl.substring(imageUrl.lastIndexOf('.'), imageUrl.length);

  image.src = `img/clear.webp`;

  image.dataset.srcset =
    `${imagePath}-300w${imageType} 300w,` +
    `${imagePath}-550w${imageType} 550w`;

  image.dataset.sizes =
    `(min-width: 1024px) 300px,` +
    `(min-width: 720px) 300px,` +
    `(min-width: 480px) 300px,` +
    `(max-width: 479px) 550px`;

  image.alt = `A view from the restaurant ${restaurant.name}`;

  if (lazyImageObserver) {
    lazyImageObserver.observe(image);
  }

  li.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
