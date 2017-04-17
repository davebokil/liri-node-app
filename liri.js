// Variables
// =================================================================

// Grabbing data from keys.js and stored in a variable
var keys = require("./keys.js")
// console.log(keys.twitterKeys.consumer_key)

// store the user input to a variable
var command = process.argv[2];

// userInput is the query after the command. Initiate with blank string
var userInput = ""

// take the rest of the user data and store it in userInput variable
for (var i=3; i<process.argv.length; i++){
  if(i>3 && i<process.argv.length){
    userInput = userInput + " " + process.argv[i];
  } else{
    userInput = userInput + process.argv[i];
  }
}
// console.log(userInput)

// spotify require
var spotify = require('spotify');
// request require
var request = require("request");
// node library to read/write
var fs = require("fs");



// User Input 
// =================================================================

// switch to handle each input case
switch (command) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        if (userInput) {
            spotifyRun(userInput);
        } else {
            spotifySign()
        }
        break;

    case "movie-this":
        if (userInput) {
            movie(userInput);
        } else {
            console.log("")
            console.log("* Oops! You forgot to input a movie title")
            console.log("* Here's an awesome movie you might have not seen yet:")
            movie("Mr. Nobody")
        }
        break;

    case "do-what-it-says":
        doWhat();
        break;

    case undefined:
        console.log("")
        console.log('*************************************************************')
        console.log("Welcome to LIRI!")
        console.log(" * LIRI stands for Language Interpretation and Recognition Interface.")
        console.log(" * It is a command line node app that takes in parameters and gives you back data.")
        console.log("")
        console.log("Try these command lines:")
        console.log("")
        console.log("* `node liri.js my-tweets` ::: This will show your last 20 tweets and when they were created at in your terminal/bash window.")
        console.log("")
        console.log("* `node liri.js spotify-this-song <song name here>` ::: This will information about a requested song in your terminal/bash window")
        console.log("")
        console.log("* `node liri.js movie-this <movie name here>` ::: This will output information about a requested movie to your terminal/bash window")
        console.log("")
        console.log("* `node liri.js do-what-it-says` ::: Try this for an echo about a notorious boy band from the 90s!")
        console.log('*************************************************************')
        console.log("")
        break;
}




// Functions
// =================================================================

// Twitter function
// =================================================================
function tweets() {
    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    // Attention!!! my personal twitter feed sucks. Therefore, I'm defering to the last 20 tweets of my favorite news outlet, 'The Intercept'
    client.get('statuses/user_timeline.json?screen_name=theintercept&count=20', function(error, tweets, response) {

        if (error) throw error;

        var tweetArray = []
        var timeArray = []

        for (var i = 0; i < 20; i++) {

            tweetArray.push(tweets[i].text)
            timeArray.push(tweets[i].created_at)
        }
        console.log("")
        console.log('***********************************Program: Twitter Feed************************************')
        console.log("***********************Attention!!! my personal twitter feed sucks.*************************")
        console.log("**********Therefore, I'm defering to the last 20 tweets of my favorite news outlet**********")
        console.log("********************Here are the most recent tweets from 'The Intercept'********************")
        console.log("")
        console.log('============================================================')
        fs.appendFileSync("log.txt", "Here are the 20 most recent tweets from 'The Intercept':"+ "\n" + "\n" + "\n" )
        for (var i = 0; i < 20; i++) {

            console.log("On: " + timeArray[i])
            console.log("The Intercept tweeted: " + tweetArray[i])
            console.log('============================================================')
            fs.appendFileSync("log.txt", "On: " + timeArray[i])
            fs.appendFileSync("log.txt", "The Intercept tweeted: " + tweetArray[i]+ "\n" + "\n" + "\n" )
        }
        console.log("")
    });
}




// Spotify function
// =================================================================
function spotifyRun(song) {
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        // * Console Log information about the song in the terminal/bash window
        console.log("")
        console.log('*****Program: Spotify Song Information*****')
        console.log("")
        fs.appendFileSync("log.txt", "Spotify Song Information: " + "\n" + "\n" + "\n" )

        // * The song's name
        console.log("The Song you requested is: " + data['tracks'].items[0].name)
        fs.appendFileSync("log.txt", "The Song you requested is: " + data['tracks'].items[0].name + "\n" )

        // * Artist(s)
        console.log("The artist is: " + data['tracks'].items[0].album.artists[0].name)
        fs.appendFileSync("log.txt", "The artist is: " + data['tracks'].items[0].album.artists[0].name + "\n" )

        // * The album that the song is from
        console.log("The album this song came from is: " + data['tracks'].items[0].album.name)
        fs.appendFileSync("log.txt", "The album this song came from is: " + data['tracks'].items[0].album.name + "\n" )

        // * A preview link of the song from Spotify
        console.log("Here's a link to preview " + data['tracks'].items[0].name + ": " + data['tracks'].items[0].preview_url)
        console.log("")
        console.log("*******************************************")
        console.log("")
        fs.appendFileSync("log.txt", "Here's a link to preview " + data['tracks'].items[0].name + ": " + data['tracks'].items[0].preview_url + "\n" + "\n" + "\n" )
    });
}



// I created a separate function to handle the case of no song provided. The reason is because the sign by ace of base is not the first entry in the spotify object. 
function spotifySign() {


    spotify.search({ type: 'track', query: 'the sign' }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        // * Console Log information about the song in the terminal/bash window
        console.log("")
        console.log('*****Program: Spotify Song Information*****')
        console.log("")
        console.log("** Hey! You forgot to include a song title. **")
        console.log("** Please retry with the command: spotify-this-song <song title> **")
        console.log("")
        console.log("In the meantime, here's some information about a dope song from the 90s:")
        fs.appendFileSync("log.txt", "Hey! You forgot to include a song title. But here's some information about a dope song from the 90s: " + "\n" + "\n" + "\n" )

        // * The song's name
        console.log("Remember that song " + data['tracks'].items[3].name + "?")
        fs.appendFileSync("log.txt", "Remember that song " + data['tracks'].items[3].name + "?" + "\n" )

        // * Artist(s)
        console.log("It was by the artist " + data['tracks'].items[3].album.artists[0].name)
        fs.appendFileSync("log.txt", "It was by the artist " + data['tracks'].items[3].album.artists[0].name + "\n" )

        // * The album that the song is from
        console.log("It was released on an album called: " + data['tracks'].items[3].album.name)
        fs.appendFileSync("log.txt", "It was released on an album called: " + data['tracks'].items[3].album.name + "\n" )

        // * A preview link of the song from Spotify
        console.log("Here's a link to preview 'The Sign': " + data['tracks'].items[3].preview_url)
        console.log("")
        fs.appendFileSync("log.txt", "Here's a link to preview 'The Sign': " + data['tracks'].items[3].preview_url + "\n" )
    });
}



// Movie function
// =================================================================
function movie(userInput) {
    // Run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            console.log("")
            //  * Title of the movie.
            console.log("Title: " + JSON.parse(body).Title);
            fs.appendFileSync("log.txt", "\n" + "Title: " + JSON.parse(body).Title + "\n" )
            //  * Year the movie came out.
            console.log("Release Date: " + JSON.parse(body).Released);
            fs.appendFileSync("log.txt", "Release Date: " + JSON.parse(body).Released + "\n" )
            //  * IMDB Rating of the movie.
            console.log("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
            fs.appendFileSync("log.txt", "The movie's IMDB rating is: " + JSON.parse(body).imdbRating + "\n" )
            //  * Country where the movie was produced.
            console.log("Country of Production: " + JSON.parse(body).Country);
            fs.appendFileSync("log.txt", "Country of Production: " + JSON.parse(body).Country + "\n" )
            //  * Language of the movie.
            console.log("Language: " + JSON.parse(body).Language);
            fs.appendFileSync("log.txt", "Language: " + JSON.parse(body).Language + "\n" )
            //  * Plot of the movie.
            console.log("The plotline: " + JSON.parse(body).Plot);
            fs.appendFileSync("log.txt", "The plotline: " + JSON.parse(body).Plot + "\n" )
            //  * Actors in the movie.
            console.log("Starring: " + JSON.parse(body).Actors);
            fs.appendFileSync("log.txt", "Starring: " + JSON.parse(body).Actors + "\n" )
            //  * Rotten Tomatoes Rating.
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n" )
            //  * Rotten Tomatoes URL.
            console.log("Link to the Rotten Tomatoes page: " + JSON.parse(body).tomatoURL);
            fs.appendFileSync("log.txt", "Link to the Rotten Tomatoes page: " + JSON.parse(body).tomatoURL + "\n" + "\n" )
            console.log("")
        }
    });
}



// Do What it Says function
// =================================================================
// When run, will access information from the random.txt file. 
function doWhat() {

    // read the random.txt file
    fs.readFile("random.txt", "utf8", function(error, data) {

        // Split data at comma
        var dataArr = data.split(",");

        // data is now separated and available as array
        // console.log(dataArr[1]);
        spotifyRun(dataArr[1])
    });
}



