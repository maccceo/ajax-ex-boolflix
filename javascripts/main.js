//init template aggiunta film dei risultati con Handlebars.js
var source   = document.getElementById("movie-template").innerHTML;
var template = Handlebars.compile(source);
var content;

$(document).ready(function() {
	//AVVIO RICERCA
	//al click di Vai
	$("#vai").click(function() {
		//passo contenuto Searchbar
		searchMovie($("#input").val());
		searchTV($("#input").val());
	});
	//alla pressione di invio (se l'utente ha scritto qualcosa)
	$("#input").keyup(function(event) {
		if (event.which == 13 && $("#input").val().length > 0) {
			//passo contenuto Searchbar
			searchMovie($("#input").val());
			searchTV($("#input").val());
		}
	});
});




function searchMovie (keyword) {
	$.ajax({
		url : "https://api.themoviedb.org/3/search/movie",
		method : "GET",
		data: {
		  api_key: "2728da4b07bc915efd24213fdc2a734c",
		  language: "it-IT",
		  query: keyword
		},
		success : function (data,stato) {
			if (stato == "success") {
				print("movie", data.results);
			} else {
			console.log("Problemi con l'API; " + stato);
			}
		},
		error : function (richiesta,stato,errori) {
			alert("E' avvenuto un errore. "+errori);
		}
	});
}

function searchTV (keyword) {
	$.ajax({
		url : "https://api.themoviedb.org/3/search/tv",
		method : "GET",
		data: {
		  api_key: "2728da4b07bc915efd24213fdc2a734c",
		  language: "it-IT",
		  query: keyword
		},
		success : function (data,stato) {
			if (stato == "success") {
				print("tv", data.results);
			} else {
			console.log("Problemi con l'API; " + stato);
			}
		},
		error : function (richiesta,stato,errori) {
			alert("E' avvenuto un errore. "+errori);
		}
	});
}

function print(type, data) {
	console.log(data);

	// elemento HTML che popolo con i dati recuperati dall'API
	var results = $("#results");

	// passo tutti i film trovati
	for (var i = 0; i < data.length; i++) {

		//prendo i primi 5 attori comunicati dall'API
		var actors = getActors(data[i],type);
		console.log("Perchè qua non ho niente? " + actors);

		//setto titolo e titolo originale (l'API movie lo chiama diversamente dall'API tv)
		var title = "";
		var originalTitle = "";
		var contentType = "";
		var bg = "";
		if (type == "movie") {
			title = data[i].title;
			originalTitle = data[i].original_title;
			contentType = "Film"; 
			bg = "movie--cinemabg";
		} else {
			title = data[i].name;
			originalTitle = data[i].original_name;
			contentType = "Serie Tv";
			bg = "movie--tvbg";
		}

		//nascondo il titolo originale se è uguale al titolo
		if (title === originalTitle) {
			originalTitle = "";
		} else {
			originalTitle = "(" + originalTitle + ")";
		}

		//inizializzo poster (se c'è)
		if (data[i].poster_path === null) {
			var img = "<p class='movie__bigTitle'>" + title + "</p>";
		} else {
			var img = '<img src="https://image.tmdb.org/t/p/w342/' + data[i].poster_path + '" alt="copertina">';
			// tolgo sfondo default per necessità css
			bg = "";
		}

		//inizializzo trama (se c'è)
		var overview = "";
		if (data[i].overview.length > 0) {
			overview = "<strong>Trama:</strong> " + data[i].overview;
		}

		context = {
			bg: bg,
			poster: img,
			type: contentType,
			title: title,
			originalTitle: originalTitle,
			lang: flagGenerator(data[i].original_language),
			vote: starsGenerator(data[i].vote_average),
			overview: overview
		}
	
		// visualizzo il film nella pagina
		results.append(template(context));

		// $(".movie__poster").parent().addClass("movie__bigTitleBg");
	}
}

function getActors(movie,type) {
	$.ajax({
		url : "https://api.themoviedb.org/3/" + type + "/" + movie.id + "/credits",
		method : "GET",
		data: {
		  api_key: "2728da4b07bc915efd24213fdc2a734c"
		},
		success : function (data,stato) {
			if (stato == "success") {
				// primi 5 attori del cast (oggetto completo con parametri inutili)
				var rawCast = data.cast.slice(0,5);
				// estraggo solo i nomi degli attori e li pusho in un array
				var actors = [];
				for (var key in rawCast) {
					actors.push(rawCast[key].name);
				}
				console.log("Ho trovato i seguenti attori: " + actors);
				return actors;
			} else {
				console.log("Problemi con l'API; " + stato);
			}
		},
		error : function (richiesta,stato,errori) {
			console.log("errore");
		}
	});
}

function starsGenerator(vote) {
	if (vote === 0) {
		return "Il film non è stato valutato.";
	} else {
		vote = Math.ceil(vote / 2);
		var stars = "";
		for (var i = 0; i < 5; i++) {
			if (i < vote) {
				stars += '<i class="fas fa-star"></i>';
			} else {
				stars += '<i class="far fa-star"></i>';
			}
		}
		return stars;
	}
}

function flagGenerator(lang) {
	var availableFlag = [
	  "it",
	  "en",
	  "de",
	  "es",
	  "fr",
	  "hi",
	  "ja",
	  "pt",
	  "ru",
	  "zh"
	];
	var flag = "";

	if (availableFlag.includes(lang)) {
		flag = "<img src='resources/flags/" + lang + ".ico'>";
	} else {
		flag = lang;
	}
	return flag;
}