var staticCacheName = 'MWS-Stage-2';
/*
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        
        'js/main.js',
        'js/dphelper.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'css/custome-styles.css',
        'img/1.jpg',
      //  'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
       // 'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ]);
    })
  );
});*/

console.log("test activate sw2");

self.addEventListener('fetch', function(event) {
//console.log('helooo');
//console.log('ya111',event.request);
event.respondWith(

//  new Response('Hello !')
      fetch(DBHelper.DATABASE_URL).then(function(response){
if(response.status === 404)
{
  return new Response("not found");
}
return response;
      }).catch(function(){
        return new Response("Opps something wrong with network")
      })
  );
});


