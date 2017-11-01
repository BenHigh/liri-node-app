//dont try running with cla's, app runs off recursive inquirer calls to output the desired data


var inq = require("inquirer");

var Twitter = require("twitter");

var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var OMDB = require("omdb-api-pt");

var fs = require("fs");

var twit = new Twitter(keys);

var spot = new Spotify({
	id: 'bd2d51c2e4064f1ca3ced9e672337cf7',
	secret: '18e90b72948a45ec860160a4cef1d7b0'
})

var omdb = new OMDB({
	apiKey: "40e9cece"
})

function getSpot(str){
	spot.search({
		type: 'track',
		query: str
	}, function(err, data){
		if(err){
			console.log(err)
		}
		console.log(data.tracks.items[0].artists[0].name);
		console.log(data.tracks.items[0].name);
		console.log(data.tracks.items[0].preview_url);
		console.log(data.tracks.items[0].album.name);
		interface();
	})
}

function getMov(str){
	omdb.bySearch({search: String(str)}).then(function(data, err){
		if(err){
			console.log(err);
		}
		omdb.byId({imdb: data.Search[0].imdbID}).then(function(data, err){
			if(err){
				console.log(err);
			}
			console.log("");
			console.log(data.Title);
			console.log(data.Year);
			console.log(data.Ratings[0].Value);
			console.log(data.Ratings[1].Value);
			console.log(data.Country);
			console.log(data.Language);
			console.log(data.Plot);
			console.log(data.Actors);
			console.log("");
			interface();
		})
	})
}

//main function for handling the options prompted by inquirer
function respHandler(resp, str){
	if(resp.option === "my-tweets"){
		console.log("made it");
		var params = {
			user_id: "RockosMdrnSwipe",
			count: 20
		}
		twit.get("statuses/user_timeline", params, function(error, tweets, response){
			if(error){
				console.log(error);
			}
			for(i in tweets){
				console.log(tweets[i].text + " created at: " + tweets[i].created_at);
			}
			interface();
		})
	}else if(resp.option === "spotify-this-song"){
		var title = "The Sign Ace of Base";
		if(str){
			title = str;
			getSpot(title);
		}
		else{
			inq.prompt([
				{
				    type: "input",
				    name: "song",
				    message: "Enter a song name:"
				}
			]).then(function(resp){
				if(resp.song){
					title = resp.song;
				}
				getSpot(title);
			});
		}
	}else if(resp.option === "movie-this"){
		var title = "Mr. Nobody";
		if(str){
			title = str;
			getMov(title);
		}
		else{
			inq.prompt([
				{
				    type: "input",
				    name: "title",
				    message: "Enter a movie title:"
				}
			]).then(function(resp){
				if(resp.title){
					title = resp.title;
				}
				getMov(title);
			});
		}
	}else if(resp.option === "do-what-it-says"){
		fs.readFile("random.txt", "utf8", function(err, data){
			if(err){
				console.log(err);
			}
			var dataArr = data.split(",");

			var a = {};
			a.option = dataArr[0].trim();

			respHandler(a, dataArr[1]);
		})
	}
}

function interface(){
	inq.prompt([
		{
			type: "list",
			message: "Options:",
			choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
			name: "option"
		},
	]).then(function(inqResp){
		console.log(inqResp);
		respHandler(inqResp);
	})
}

interface();