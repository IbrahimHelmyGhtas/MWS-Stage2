/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337  // 8000 // Change this to your server port
    //return `http://localhost:${port}/data/restaurants.json`;
    return `http://localhost:${port}/restaurants`;
  }

  static get Reviews_DATABASE_URL() {
    const port = 1337  // 8000 // Change this to your server port
    //return `http://localhost:${port}/data/restaurants.json`;
    return `http://localhost:${port}/reviews/?restaurant_id=`;
  }

  /**
   * Fetch all restaurants.
   */


static fetchRestaurantsFast(callback)
{
 return  fetch(DBHelper.DATABASE_URL, { 
                       method: 'GET'
                      })
                    .then(response => { 

                      const restaurants = response.json();
                             // const restaurants = json;//.restaurants;
                               console.log('data',response); 
                              console.log('restaurants',restaurants);
                                  return restaurants;
                                }).then(restaurants =>{
                               dbPromise.then(function(db){
                                    var tx = db.transaction('restaurants', 'readwrite');
                                    var restaurantStore = tx.objectStore('restaurants');
                                      //var arr = new Array(restaurants);
                                    restaurants.forEach(function(rest){
                                      restaurantStore.put(rest);
                                    });
                                     
                                      return tx.complete;
                                  }).then(function(){

                                   console.log('restaurantStore Added successfully');
                                  });
                          callback(null, restaurants)
                      })
                    .catch(error => {

                        //const msg = (`Request failed. Returned status of ${error}`);
        
                      console.log('Error Form favorit:', error);
                     // return null;
                        callback(error, null);
                    })
}

  static fetchRestaurants(callback) {
   let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json;//.restaurants;
        console.log('restaurants',restaurants);


        /// add in index DB 

        dbPromise.then(function(db){
          var tx = db.transaction('restaurants', 'readwrite');
          var restaurantStore = tx.objectStore('restaurants');

          restaurants.forEach(function(rest){
            restaurantStore.put(rest);
          });
           
            return tx.complete;
        }).then(function(){

         console.log('restaurantStore Added successfully');
        });



        callback(null, restaurants);
      } else { // Oops!. Got an error from server.

         //test fetch offline
          dbPromise.then(function(db){
          var tx= db.transaction('restaurants');
        var restaurantStore = tx.objectStore('restaurants');

        return restaurantStore.getAll();

           }).then(function(restaurants){
            callback(null, restaurants);
       console.log('Offline Restaurants obj : ' , restaurants);
        });



        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();

/*fetch(DBHelper.DATABASE_URL)

.then( response => response.json())
.catch(function(ex){
  console.log(`Request failed.${ex}`);
});*/






  }




  static fetchReviewsFast(restid,callback) {
   return  fetch(DBHelper.Reviews_DATABASE_URL + restid, { 
                       method: 'GET'
                      })
                    .then(response => { 
        const json = response.json();
        const reviews = json;//.restaurants;
        console.log('reviews',reviews);
          return reviews;}).then(reviews=>{

        /// add in index DB 

        dbPromiseReviews.then(function(db){
          var tx = db.transaction('reviews', 'readwrite');
          var reviewStore = tx.objectStore('reviews');

          reviews.forEach(function(rev){
            reviewStore.put(rev);
          });
           
            return tx.complete;
           
        }).then(function(){

         console.log('reviewStore Added successfully');
         
        }) 


          callback(null, reviews);
      }) 
       .catch(error => {

dbPromiseReviews.then(function(db){
          var tx= db.transaction('reviews');
        var reviewStore = tx.objectStore('reviews');

        return reviewStore.getAll();

           }).then(function(reviews){
            callback(null, reviews);
       console.log('Offline Reviews obj : ' , reviews);
        });
                        //const msg = (`Request failed. Returned status of ${error}`);
        
                      console.log('Error Form favorit:', error);
                     // return null;
                        callback(error, null);
                    })
          



       
  
    

/*fetch(DBHelper.DATABASE_URL)

.then( response => response.json())
.catch(function(ex){
  console.log(`Request failed.${ex}`);
});*/






  }


  static fetchReviews(restid,callback) {
   let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.Reviews_DATABASE_URL + restid);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const reviews = json;//.restaurants;
        console.log('reviews',reviews);


        /// add in index DB 

        dbPromiseReviews.then(function(db){
          var tx = db.transaction('reviews', 'readwrite');
          var reviewStore = tx.objectStore('reviews');

          reviews.forEach(function(rev){
            reviewStore.put(rev);
          });
           
            return tx.complete;
        }).then(function(){

         console.log('reviewStore Added successfully');
        });



        callback(null, reviews);
      } else { // Oops!. Got an error from server.

         //test fetch offline
          dbPromiseReviews.then(function(db){
          var tx= db.transaction('reviews');
        var reviewStore = tx.objectStore('reviews');

        return reviewStore.getAll();

           }).then(function(reviews){
            callback(null, reviews);
       console.log('Offline Reviews obj : ' , reviews);
        });



        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();

/*fetch(DBHelper.DATABASE_URL)

.then( response => response.json())
.catch(function(ex){
  console.log(`Request failed.${ex}`);
});*/






  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurantsFast((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }


  /**
   * Fetch a reviews by its ID.
   */
  static fetchReviewsByRestaurantId(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchReviewsFast(id,(error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        const reviewsList = reviews.filter(r => r.restaurant_id == id);
        if (reviewsList) { // Got the restaurant
          callback(null, reviewsList);
        } else { // Restaurant does not exist in the database
          callback('Reviews does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurantsFast((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurantsFast((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurantsFast((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurantsFast((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }


  static fetchReviewsHTML(id,callback) { 
    // Fetch all restaurants
    DBHelper.fetchReviewsFast(id,(error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
       // const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
       // const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, reviews);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurantsFast((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
