
const dbPromise = idb.open('New-MWS-DB', 1,function(upgradeDB) {
	switch(upgradeDB.oldVersion)
	{
	
  		case 0 :
  		  var restaurantStore = upgradeDB.createObjectStore('restaurants', {keyPath : 'name'});
 
	}
  


});

const dbPromiseReviews = idb.open('New-MWS-DB-Reviews', 2,function(upgradeDB) {
	switch(upgradeDB.oldVersion)
	{
	
  		case 0 :
  		  var reviewStore = upgradeDB.createObjectStore('reviews', {keyPath : 'id'});
  		case 1 : 
  		 var reviewStore = upgradeDB.transaction.objectStore('reviews');
  		 reviewStore.createIndex('reviewid','id');

	}
  


});

const dbNew_Reviews = idb.open('new-review', 2,function(upgradeDB) {
	switch(upgradeDB.oldVersion)
	{
	
  		case 0 :
  		  var reviewStore = upgradeDB.createObjectStore('new-review', {keyPath : 'id'});
  		case 1 : 
  		 var reviewStore = upgradeDB.transaction.objectStore('new-review');
  		 reviewStore.createIndex('new-reviewid','id');

	}
  


});

/*
dbPromise.then(function(db){
 var tx= db.transaction('restaurants');
 var restaurantStore = tx.objectStore('restaurants');
 //var mobileIndex = pepoleStore.index('Mobile');
 return restaurantStore.getAll();

}).then(function(restaurants){
	restaurants = restaurants;
   console.log('Restaurants obj : ' , restaurants);
});

dbPromiseReviews.then(function(db){
 var tx= db.transaction('reviews');
 var reviewStore = tx.objectStore('reviews');
 //var mobileIndex = pepoleStore.index('Mobile');
 return reviewStore.getAll();

}).then(function(reviews){
	reviews = reviews;
   console.log('Reviews obj : ' , reviews);
});*/