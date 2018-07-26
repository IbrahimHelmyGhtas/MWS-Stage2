var staticCacheName = 'MWS-Stage-idbFirstTest32';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'js/SW.js',
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
              console.log('get it online');
              console.log('response', response);
          return response;
        }
         console.log('get it offline');


        /* dbPromise.then(function(db){
 var tx= db.transaction('restaurants');
 var restaurantStore = tx.objectStore('restaurants');

 return restaurantStore.getAll();

}).then(function(restaurants){
   console.log('Offline Restaurants obj : ' , restaurants);
});*/

      var promis = fetch(event.request);
      if(promis)
       { return promis;}
      else
      {
         dbPromise.then(function(db){
          var tx= db.transaction('restaurants');
        var restaurantStore = tx.objectStore('restaurants');

        return restaurantStore.getAll();

           }).then(function(restaurants){
       console.log('Offline Restaurants obj : ' , restaurants);
        });

      }

        //return fetch(event.request);
     })

    );

});


