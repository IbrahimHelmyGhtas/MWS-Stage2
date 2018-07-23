importScripts('js/idb.js');
importScripts('js/indexDB.js');
importScripts('js/dbhelper.js');

var staticCacheName = 'MWS-Stage-idbFirstTest166'; 
var CACHE_CONTAINING_ERROR_MESSAGES ='MWS-errors';
var CACHE_DYNAMIC_NAME ='MWS-dynamic-cache'; 
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'js/main.js',
        //'js/idb.js',
        'js/dbhelper.js',  
        'js/indexDB.js',
        'js/restaurant_info.js',
        'css/mini-css.css',
        //'css/custome-styles.css',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg', 
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
        //'https://maps.googleapis.com/maps/api/js?key=AIzaSyAhgkahpB5UZ-keXKZz1U8CS9wkdrLxMTA&libraries=places&callback=initMap'
     
      ]);
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(

caches.keys().then(function(cacheNames){
  return Promise.all(
  
  cacheNames.filter(function(cacheName){
    return cacheName.startsWith('MWS-') && cacheName != staticCacheName
  }).map(function(cacheName){
    return caches.delete(cacheName);
  })


    );
  

})
    
  );
});  

//console.log("test activate sw3");

self.addEventListener('fetch', function(event) {
//console.log('helooo');

/*event.respondWith(

      fetch('http://localhost:1337/restaurants').then(function(response){
if(response.status === 404)
{
  return new Response("not found");
}
const restaurants =  response;
//return response;
      }).catch(function(){
        return new Response("Opps something wrong with network")
      })
  );*/
  //console.log('service worker fetch');
  event.respondWith(
    caches.match(event.request).then(function(response){
        if(response)
        { 
          /*  if(response.status === 404)
              {
                return new Response("not found");
              }
              console.log('get it o');*/
              console.log('get it from cache');
              console.log('response', response);
          return response;
        }
      
        else
        {
              //fetch from internet
             return fetch(event.request).then(function(res) {
             return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
               })
            .catch(function(err) {       // fallback mechanism
              return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
        // console.log('get it offline');
 

        /* dbPromise.then(function(db){
 var tx= db.transaction('restaurants');
 var restaurantStore = tx.objectStore('restaurants');

 return restaurantStore.getAll();

}).then(function(restaurants){
   console.log('Offline Restaurants obj : ' , restaurants);
});*/

     // var promis = fetch(event.request);
    // if(promis)
     //  { return promis;}
    //  else
    //  {
     /*    dbPromise.then(function(db){
          var tx= db.transaction('restaurants');
        var restaurantStore = tx.objectStore('restaurants');

        return restaurantStore.getAll();

           }).then(function(restaurants){
             restaurants;
       console.log('Offline Restaurants obj : ' , restaurants);
        });*/

     // }

        //return fetch(event.request);
     })

    );

});



self.addEventListener('sync', function (event) {

   // self.registration.showNotification("Sync event fired!");
  if (event.tag === 'myFirstSync') {
      event.waitUntil(
        


        getDataFromOutbox().then(function(messages) {
          // Post the messages to the server
          return fetch('http://localhost:1337/reviews/', {
          method: 'POST',
          body: JSON.stringify(messages),
          headers: { 'Content-Type': 'application/json' }
          }).then(() => {
          // Success! Remove them from the outbox       
          removeDataFromOutbox();
          });
      })
      //console.log('re establish connection test')




      );
    }
});



/*      if (event.tag == 'myF') {
        console.log(event.request.url);
      event.waitUntil(
        
      )}
    }); */

    function getDataFromOutbox(){
    return dbNew_Reviews
    .then(function(db){
        var tx = db.transaction('new-review', 'readonly');
      var store = tx.objectStore('new-review');
      //console.log(url);
      return store.getAll();
    })
    .then(function(data){
      console.log(data);
    })
    .catch(function(err){
      console.log(err);
    });
  }

  function removeDataFromOutbox(){
    return dbNew_Reviews
    .then(function(db){
      var tx = db.transaction('new-review', 'readwrite');
      var store = tx.objectStore('new-review');
      return store.clear();
    })
    .then(function(){
      console.log('deleted')
    })
    .catch(function(e){
      console.log(e);
    });
}

