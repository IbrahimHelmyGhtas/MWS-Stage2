self.addEventListener('sync', function (event) {
    if (event.tag === 'syncReviews') {
        event.waitUntil((function () {
            if (typeof idb === "undefined" || typeof DBHelper === "undefined") {
                self.importScripts('js/dbhelper.js', 'js/idb.js');
            }

            let promiseArray = [];
            DBHelper.getDB();
            DBHelper.restaurantDBPromise.then(function (db) {
                if (!db) return;

                var tx = db.transaction('restaurants', 'readwrite');
                var store = tx.objectStore('restaurants');

                return store.openCursor();
            }).then(function addReview(cursor) {
                if (!cursor) return;

                var restaurant = cursor.value;
                var reviews = restaurant.reviews;

                if (reviews) {
                    reviews.forEach(element => {
                        if (element.offline) {
                            delete element.offline;
                            promiseArray.push(fetch(`${DBHelper.SERVER_URL}/reviews/`, {
                                method: 'post',
                                headers: {
                                    "Content-Type": "application/json; charset=utf-8",
                                },
                                body: JSON.stringify(element)
                            }).then(response => response.json()));
                        }
                    });
                }

                return cursor.continue().then(addReview);
            }).then(function () {
                return Promise.all(promiseArray).then(function () {
                    console.log(`Success! Promise all`);
                }).catch(function (error) {
                    throw 'Silenced Exception! ' + error;
                });
            });
        })());
    }
});




/// old fetch function review

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

  }



  /// old restaurant fetch 

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

  }