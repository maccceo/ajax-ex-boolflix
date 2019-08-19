//init template aggiunta film dei risultati con Handlebars.js
var source   = document.getElementById("movie-template").innerHTML;
var template = Handlebars.compile(source);
var content, html;

$(document).ready(function() {
	//AVVIO RICERCA
	//al click di Vai
	$("#vai").click(function() {
		searchMovie($("#input").val());
	});
	//alla pressione di invio
	$("#input").keyup(function(event) {
		if (event.which == 13 && $("#input").val().length > 0) {
			searchMovie($("#input").val());
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
				showResult(data);
			} else {
			console.log("Problemi con l'API; " + stato);
			}
		},
		error : function (richiesta,stato,errori) {
			alert("E' avvenuto un errore. "+errore);
		}
	});
}

function showResult(data) {
	// passo tutti i film trovati
	for (var i = 0; i < data.total_results; i++) {
		// prelevo i dati che mi servono
		context = {
			title: data.results[i].title,
			originalTitle: data.results[i].original_title,
			lang: data.results[i].original_language,
			vote: data.results[i].vote_average
		};
		// li "complilo" nel template
		html = template(context);
		// visualizzo il film nella pagina
		$("#results").append(html);
	}
}
