"use strict";
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const MovieDB = require('node-themoviedb');


app.get('/', (req, res) => {
    console.log(req.url);
    res.send("<h1>url input : /api/movie-name-year </h1>");
});


app.get('/api/:name', (req, res) => {

    // defining variable that will be used in functions
    const mdb = new MovieDB('42166ef86647bcdebdc7170fda99253b');
    const name = req.params.name;
    const url = `http://content.viaplay.se/pc-se/film/${name}`;

    // FETCHING DATA FROM VIAPLAY CONTENT API 
    const get_data = async url => {
        try {
            // fetch url info and parse it
            const response = await fetch(url);
            const json = await response.json();
            // extracting the imdb id 
            const imdb_id = json._embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb.id; 
            
            return imdb_id;
        } catch (error) {
            res.status(404).send(`Movie can't be found. ${error}. input should be: /api/movie-name-year `);
        }
    };

    
    // Using Find by extern id method to retrieve TMDB_ID using IMDB ID //
    const get_id = async id => {
        // defining the argument for the method call
        const args = {
            pathParameters: {
                'external_id' : id,
            },
            query: {
                'external_source' : 'imdb_id',
            },
            
        };
        // getting the tmdb id
        const response = await mdb.find.byExternalID(args);
        const tmdb_id = JSON.parse(response.data.movie_results[0].id);
        console.log(tmdb_id);

        return tmdb_id;
    };


    // Using getVideo method to get Movie Trailer key// 
    const get_trailer = async id => {
        const args = {
            pathParameters: {
                'movie_id' : id,
            },
        };

        try {
            // getting the movie trailer key
            const response = await mdb.movie.getVideos(args);
            let trailer = (response.data.results.length > 1) ? response.data.results[1].key : response.data.results[0].key;
            // adding the key to a youtube link
            const trailer_link = `https://www.youtube.com/watch?v=${trailer}`;

            // returning json file with trailer url
            res.json({
                url: trailer_link
            });
        } catch(error) {
            res.status(404).send(`Movie has no trailer. ${error}.`);
        }
    };
    
    // calling async functions and chaining them to retrieve trailer
    get_data(url)
        .then(imdb_id => get_id(imdb_id))
        .then(id => get_trailer(id))
        .catch(err => res.status(404).send(error));
     
});


// setting environment variable
const port = process.env.PORT || 3000;

app.listen(port, err => {
    if (err) {
    console.log('there was a problem', err);
    return;
    }
    console.log(`listening on port ${port}` );
});