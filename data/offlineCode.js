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