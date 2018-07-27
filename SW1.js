/*importScripts('js/idb.js');
importScripts('js/indexDB.js');
importScripts('js/dbhelper.js');*/

var staticCacheName = 'MWS-Stage-idbFirstTest252'; 
var CACHE_CONTAINING_ERROR_MESSAGES ='MWS-errors';
var CACHE_DYNAMIC_NAME ='MWS-dynamic-cache'; 
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'dist/main-min.js',
        'dist/idb-min.js',
        'dist/dbhelper-min.js',  
        'dist/indexDB-min.js',
        'dist/restaurant_info-min.js',
        //'dist/mini-css.min.css',
        //'css/custome-styles.css',
        'dist/intersection-observer-min.js',
        'img/1.webp',
        'img/2.webp',
        'img/3.webp', 
        'img/4.webp',
        'img/5.webp',
        'img/6.webp',
        'img/7.webp',
        'img/8.webp',
        'img/9.webp',
        'img/rest1.webp',
        'img/rest2.webp',
        'img/rest3.webp', 
        'img/rest4.webp',
        'img/rest5.webp',
        'img/rest6.webp',
        'img/rest7.webp',
        'img/rest8.webp',
        'img/rest9.webp',
        'img/rest10.webp',
        'img/map-icon2.webp'
       
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


self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request).then(function(response){
        if(response)
        { 
          
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
    
     })

    );

});



self.addEventListener('sync', function (event) {

   // self.registration.showNotification("Sync event fired!");
  if (event.tag === 'myFirstSync') {
    //  event.waitUntil(
        


     /*   getDataFromOutbox().then(function(messages) {
          // Post the messages to the server
          return fetch('http://localhost:1337/reviews/', {
          method: 'POST',
          body: JSON.stringify(messages),
          headers: { 'Content-Type': 'application/json' }
          }).then(function(rev)  {
          // Success! Remove them from the outbox       
          removeDataFromOutbox();
          //return rev;
          });
          //return messages;
      })*/
      //console.log('re establish connection test')




     // )
    }
});







