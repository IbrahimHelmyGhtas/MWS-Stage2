//import idb from 'idb';


const dbPromise = idb.open('New-MWS-DB', 1,function(upgradeDB) {
	switch(upgradeDB.oldVersion)
	{
	
  		case 0 :
  		  var restaurantStore = upgradeDB.createObjectStore('restaurants', {keyPath : 'name'});
  		  
  		/*case 3 : 
  		 var restaurantStore = upgradeDB.transaction.objectStore('restaurants');
  		 restaurantStore.createIndex('Mobile','phone');*/

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



 

// read "hello" in "keyval"
/*
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});


dbPromise.then(function(db){
	var tx = db.transaction('keyval', 'readwrite');
	 var keyValStore = tx.objectStore('keyval');
	 keyValStore.put('bar','foo');
	 return tx.complete;
}).then(function(){

	console.log('Added successfully for keyval store');
});*/

/*.then(function(db){
	var tx = db.transaction('pepole', 'readwrite');
	 var pepoleStore = tx.objectStore('pepole');
	 pepoleStore.put(
	 	{
	 		name : "ibrahim",
	 		age :  33,
	 		phone : 0102233444
	 	});
	 pepoleStore.put(
	 	{
	 		name : "mafdy",
	 		age :  25,
	 		phone : 01029292323
	 	});
	 pepoleStore.put(
	 	{
	 		name : "mona",
	 		age :  44,
	 		phone :74448383838
	 	});
	 return tx.complete;
}).then(function(){

	console.log('Pepole Added successfully for keyval store');
}); */



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
});