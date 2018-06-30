var staticCacheName = 'MWS-Stage-idbFirstTest52';
var CACHE_CONTAINING_ERROR_MESSAGES ='MWS-errors';
var CACHE_DYNAMIC_NAME ='MWS-dynamic-cache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'js/main.js',
        'js/dbhelper.js',  
        'js/indexDB.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'css/custome-styles.css',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg', 
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg'
       // 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAhgkahpB5UZ-keXKZz1U8CS9wkdrLxMTA&libraries=places&callback=initMap'
     
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


