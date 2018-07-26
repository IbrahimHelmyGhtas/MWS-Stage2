const dbPromise=idb.open("New-MWS-DB",1,function(e){switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"name"})}}),dbPromiseReviews=idb.open("New-MWS-DB-Reviews",2,function(e){switch(e.oldVersion){case 0:e.createObjectStore("reviews",{keyPath:"id"});case 1:e.transaction.objectStore("reviews").createIndex("reviewid","id")}}),dbNew_Reviews=idb.open("new-review",2,function(e){switch(e.oldVersion){case 0:e.createObjectStore("new-review",{keyPath:"id"});case 1:e.transaction.objectStore("new-review").createIndex("new-reviewid","id")}});dbPromise.then(function(e){return e.transaction("restaurants").objectStore("restaurants").getAll()}).then(function(e){e=e,console.log("Restaurants obj : ",e)}),dbPromiseReviews.then(function(e){return e.transaction("reviews").objectStore("reviews").getAll()}).then(function(e){e=e,console.log("Reviews obj : ",e)});