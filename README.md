a REST API for providing clients with trailer URLs.

I used Express.js framework for its' flexibility.

The API consists of several asynchronous functions that depend on each others return values.

The /api/:name route takes in a movie-year input and has 3 main functions as follows :

- get_data(url), this function takes in the URL input and returns the imdb_id value (string)

- get_id(id), takes in an imdb_id and makes a call to the node-themoviedb to get the tmdb_id (integer), using find.byExternalID method.

- and lastly get_trailer(id), takes in an integer (tmdb_id) and makes a call to the movie.getVideos method to get back the key for the trailer, which later is added to the base youtube URL, and finally sent in JSON form to client.


To make it easier and cleaner, instead of calling functionions within each other, I have written each function seperatly, and then called the first function and chained others in dependecy order.



