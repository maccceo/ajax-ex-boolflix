//init template aggiunta film dei risultati con Handlebars.js
var source   = document.getElementById("movie-template").innerHTML;
var template = Handlebars.compile(source);
var content;

$(document).ready(function() {
	//AVVIO RICERCA
	//al click di Vai
	$("#vai").click(function() {
		searchMovie($("#input").val());
		searchTV($("#input").val());
	});
	//alla pressione di invio
	$("#input").keyup(function(event) {
		if (event.which == 13 && $("#input").val().length > 0) {
			searchMovie($("#input").val());
			searchTV($("#input").val());
		}
	});
});




function searchMovie (keyword) {
	//preparo url API con stringa da cercare
	var url = "https://api.themoviedb.org/3/search/movie?api_key=2728da4b07bc915efd24213fdc2a734&language=it_IT&query=" + keyword;

	$.ajax({
		url : url,
		method : "GET",
		success : function (data,stato) {
			if (stato == "success") {
				showMovie(data);
			} else {
			console.log("Problemi con l'API; " + stato);
			}
		},
		error : function (richiesta,stato,errori) {
			alert("E' avvenuto un errore. "+errore);
		}
	});
}

function showMovie(data) {
	console.log(data);
	// passo tutti i film trovati
	for (var i = 0; i < data.total_results; i++) {
		//preaparo bandiera e stelline
		language = flagGenerator(data.results[i].original_language);
		stars = starsGenerator(data.results[i].vote_average);
		//visualizzo il titolo originale solo se è diverso dall'altro
		if (data.results[i].title === data.results[i].original_title) {
			context = {
				title: data.results[i].title,
				lang: language,
				vote: stars
			};
		} else {
			context = {
				title: data.results[i].title,
				originalTitle: "(" + data.results[i].original_title + ")",
				lang: language,
				vote: stars
			};
		}
		// visualizzo il film nella pagina
		$("#results").append(template(context));
	}
}

function showTV(data) {
	console.log(data);
	// passo tutti le serie TV trovate
	for (var i = 0; i < data.total_results; i++) {
		//preaparo bandiera e stelline
		language = flagGenerator(data.results[i].original_language);
		stars = starsGenerator(data.results[i].vote_average);
		//visualizzo il titolo originale solo se è diverso dall'altro
		if (data.results[i].name === data.results[i].original_name) {
			context = {
				title: data.results[i].name,
				lang: language,
				vote: stars
			};
		} else {
			context = {
				title: data.results[i].name,
				originalTitle: "(" + data.results[i].original_name + ")",
				lang: language,
				vote: stars
			};
		}
		// visualizzo la serie TV nella pagina
		$("#results").append(template(context));
	}
}

function searchTV (keyword) {
	//preparo url API con stringa da cercare
	var url = "https://api.themoviedb.org/3/search/tv?api_key=2728da4b07bc915efd24213fdc2a734&language=it_IT&query=" + keyword;

	$.ajax({
		url : url,
		method : "GET",
		success : function (data,stato) {
			if (stato == "success") {
				showTV(data);
			} else {
			console.log("Problemi con l'API; " + stato);
			}
		},
		error : function (richiesta,stato,errori) {
			alert("E' avvenuto un errore. "+errore);
		}
	});
}

function starsGenerator(vote) {
	if(vote === 0) {
		return "Il film non è stato valutato."
	} else {
		var stars = "";
		vote = Math.ceil(vote / 2);
		for (var i = 0; i < vote; i++) {
			stars += '<i class="fas fa-star"></i>';
		}
		return stars;
	}
}

function flagGenerator(code) {
	var flag = '<img src="resources/flags/';
	switch (code) {
		case "de":
			flag = flag + 'de.ico" alt="deutsch">';
			break;
		case "en":
			flag = flag + 'en.ico" alt="english">';
			break;
		case "es":
			flag = flag + 'es.ico" alt="espanol">';
			break;
		case "fr":
			flag = flag + 'fr.ico" alt="français">';
			break;
		case "hi":
			flag = flag + 'hi.ico" alt="hindian">';
			break;
		case "it":
			flag = flag + 'it.ico" alt="italiano">';
			break;
		case "ja":
			flag = flag + 'ja.ico" alt="japan">';
			break;
		case "pt":
			flag = flag + 'pt.ico" alt="português">';
			break;
		case "ru":
			flag = flag + 'ru.ico" alt="русский">';
			break;
		case "zh":
			flag = flag + 'zh.ico" alt="普通话">';
			break;
		default:
			return code;
	}
	return flag;
}