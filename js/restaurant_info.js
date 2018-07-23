let restaurant;
var map;
let currentRate;

document.addEventListener('DOMContentLoaded', (event) => {
  init();
  
});


document.getElementById("ham").addEventListener('click', function(e) {
  document.getElementById("map-container").classList.toggle('open');
  e.stopPropagation();  
});


// to post favorit restaurant 



document.getElementById("FavoritCheckBox").addEventListener('change', function(e) {
        var checked  = document.getElementById("FavoritCheckBox").checked;
        const restid = getParameterByName('id');


      

  // if(checked == true)
  //  {

      // update idb
      dbPromise.then(function(db){


                    var tx = db.transaction('restaurants', 'readwrite');
                   var restaurantStore = tx.objectStore('restaurants');
                    return restaurantStore.openCursor();
                     }).then( function updateRestaurant(cursor) {
                        if (!cursor) return;
                        //var cursor = event;
                        if(cursor) {
                          if(cursor.value.id == restid) {
                            var updateData = cursor.value;
                              
                            updateData.is_favorite = checked;
                            var request = cursor.update(updateData);
                             
                          }

                          
                          return cursor.continue().then(updateRestaurant);        
                        }                      

      
            }).then(function(){
                    console.log('Added successfully for review store');
            }).then(function(){
                  // update on server
                  fetch('http://localhost:1337/restaurants/'+restid+'/?is_favorite='+checked, {
                       method: 'PUT'
                      })
                    .then(response => response.json())
                    .catch(error => console.error('Error Form favorit:', error))
                    .then(response => {
                      console.log('Restaurant favorit :', response);
                       //alert("Restaurant became favorit successfully.");
                     });
      });

  /*  }
  else
    {

       // update on server
        fetch('http://localhost:1337/restaurants/'+restid+'/?is_favorite=false', {
           method: 'PUT'
          })
        .then(response => response.json())
        .catch(error => console.error('Error Form favorit:', error))
        .then(response => {
          console.log('Restaurant favorit :', response);
          // alert("Restaurant became un favorit successfully.");
         });
    }*/
  e.stopPropagation();  
});


/// to post new review 
document.getElementById("addreview").addEventListener('click', function(e) {
 
var formData = new FormData();

const restid = getParameterByName('id');
const username =document.getElementById("username").value;
const commentname =document.getElementById("commentname").value;


formData.append('restaurant_id', restid);
formData.append('name', username);
formData.append('rating',currentRate);
formData.append('comments',commentname);

dbPromiseReviews.then(function(db){
 var transaction = db.transaction('reviews', 'readonly');
        var objectStore = transaction.objectStore('reviews');
        var index = objectStore.index('reviewid');
        var openCursorRequest = index.openCursor(null, 'prev');
        var maxRevisionObject = null;
          return openCursorRequest;
        
}).then(function(event){

        if (event)
              {
                maxRevisionObject = event.value; //the object with max revision
                rev  =  new Object();
                rev.restaurant_id = restid;
                rev.name = username;
                rev.rating = currentRate;
                rev.comments = commentname;
                rev.id = maxRevisionObject.id +1 ;
                rev.createdAt = new Date();
                rev.updatedAt = new Date();
              }
//return event;
            dbPromiseReviews.then(function(db){

                   var tx = db.transaction('reviews', 'readwrite');
                   var reviewStore = tx.objectStore('reviews');
                    reviewStore.put(rev);
            return tx.complete;
            }).then(function(){
               console.log('Added successfully for review store');

                     
            
}).then(function(){


            dbNew_Reviews.then(function(db){

                   var tx1 = db.transaction('new-review', 'readwrite');
                   var reviewStore = tx1.objectStore('new-review');
                    reviewStore.put(rev);

            return tx1.complete;
            }).then(function(response){

              const ul = document.getElementById('reviews-list');
  
              ul.appendChild(createReviewHTML(rev));

               console.log('Success Form :', response);
                 alert("Review added successfully.");

               console.log('Added successfully for new-review store'); 
             }).then(function(oldresponse){
                fetch('http://localhost:1337/reviews/', {
                 method: 'POST',
                  body: formData
                })
              .then(response => {
                 const result = response.json();
                    console.log('object response result:', result);
                   
                return result;
              })
              .catch(error => 
                 
                console.log('Error Form:', error)
              )
             /* .then(response => {
               if(response)
               {
                console.log('Success Form :', response);
                 alert("Review added successfully.");

            /*   fetch('http://localhost:1337/reviews/?restaurant_id='+restid, {
           method: 'GET'
            
          })*/ //.then(response => response.json()).catch(error => console.error('Error Form:', error))
       // .then(newreviews => {
          //console.log(newreviews.json());
          //console.log('new reviews :', newreviews);

              // populate review in html 
              
              //const ul = document.getElementById('reviews-list');
  
             // ul.appendChild(createReviewHTML(response));

             // container.appendChild(ul);
      //  })
         // }

       // });


         //console.log('restaurantStore Added successfully');
        });


});

});

  e.stopPropagation();  
});






document.getElementById("firstStar").addEventListener('click', function(e) {
  currentRate =1;
  document.getElementById("firstStar").classList.toggle('checked');
  var exist = document.getElementById("firstStar").classList.contains('checked');
  if(exist == true)
  {
    currentRate =1;
  }
  else
  {
    currentRate =0;
    document.getElementById("firstStar").classList.remove('checked');
    document.getElementById("secondStar").classList.remove('checked');
    document.getElementById("thirdStar").classList.remove('checked');
     document.getElementById("fourthStar").classList.remove('checked');
     document.getElementById("fifthStar").classList.remove('checked');
  }

  e.stopPropagation();  
});

document.getElementById("secondStar").addEventListener('click', function(e) {
 
 
  document.getElementById("secondStar").classList.toggle('checked');

   var exist = document.getElementById("secondStar").classList.contains('checked');
  if(exist == true)
  {
    currentRate =2;
    document.getElementById("firstStar").classList.add('checked');
  }
  else
  { currentRate =0;
    document.getElementById("firstStar").classList.remove('checked');
    document.getElementById("secondStar").classList.remove('checked');
    document.getElementById("thirdStar").classList.remove('checked');
     document.getElementById("fourthStar").classList.remove('checked');
     document.getElementById("fifthStar").classList.remove('checked');
  }

  e.stopPropagation();  
});

document.getElementById("thirdStar").addEventListener('click', function(e) {
  
  
  document.getElementById("thirdStar").classList.toggle('checked');
  var exist = document.getElementById("thirdStar").classList.contains('checked');
  if(exist == true)
  {
    currentRate =3;
    document.getElementById("firstStar").classList.add('checked');
    document.getElementById("secondStar").classList.add('checked');
  }
  else
  {
     currentRate =0;
    document.getElementById("firstStar").classList.remove('checked');
    document.getElementById("secondStar").classList.remove('checked');
    document.getElementById("thirdStar").classList.remove('checked');
     document.getElementById("fourthStar").classList.remove('checked');
     document.getElementById("fifthStar").classList.remove('checked');
  }

  e.stopPropagation();  
});

document.getElementById("fourthStar").addEventListener('click', function(e) {
  
 
  document.getElementById("fourthStar").classList.toggle('checked');

  var exist = document.getElementById("fourthStar").classList.contains('checked');
  if(exist == true)
  {
    currentRate =4;
    document.getElementById("firstStar").classList.add('checked');
    document.getElementById("secondStar").classList.add('checked');
    document.getElementById("thirdStar").classList.add('checked');
  }
  else
  {
    currentRate =0;
    document.getElementById("firstStar").classList.remove('checked');
    document.getElementById("secondStar").classList.remove('checked');
    document.getElementById("thirdStar").classList.remove('checked');
     document.getElementById("fourthStar").classList.remove('checked');
     document.getElementById("fifthStar").classList.remove('checked');
  }
  e.stopPropagation();  
});

document.getElementById("fifthStar").addEventListener('click', function(e) {
  
  
  document.getElementById("fifthStar").classList.toggle('checked');


  var exist = document.getElementById("fifthStar").classList.contains('checked');
  if(exist == true)
  {
    currentRate =5;
    document.getElementById("firstStar").classList.add('checked');
    document.getElementById("secondStar").classList.add('checked');
    document.getElementById("thirdStar").classList.add('checked');
     document.getElementById("fourthStar").classList.add('checked');
  }
  else
  {
    currentRate =0;
    document.getElementById("firstStar").classList.remove('checked');
    document.getElementById("secondStar").classList.remove('checked');
    document.getElementById("thirdStar").classList.remove('checked');
     document.getElementById("fourthStar").classList.remove('checked');
     document.getElementById("fifthStar").classList.remove('checked');
  }

  e.stopPropagation();  
});





/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });

    DBHelper.fetchReviewsByRestaurantId(id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error(error);
        return;
      }
      fillReviewsHTML();
      //callback(null, reviews)
    });

  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.alt = 'restaurant : ' + restaurant.name
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }

  if(  restaurant.is_favorite == "true")
  {
      document.getElementById("FavoritCheckBox").checked = true;
      //alert('loaded favorit');
  }
  else
  {
      document.getElementById("FavoritCheckBox").checked = false;
     // alert('loaded un favorit');
  }
  // fill reviews
  //fillReviewsHTML(); may be back
}





/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {

 
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}




/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.classList.add("UserNameReview");
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date(review.createdAt).toLocaleString("en-US");
  date.classList.add("UserDateReview");
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = ` Rating : ${review.rating}`;
  rating.classList.add("RateClass");

  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.classList.add("UserCommentReview");
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
