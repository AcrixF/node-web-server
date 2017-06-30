/**
 * Created by root on 30/06/17.
 */
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

//Se define el motor de vistas de hbs
app.set('view engine', 'hbs');

//Se definen la ruta donde se encontraran las vistas de los .hbs
hbs.registerPartials(__dirname + '/views/partials');

//al utilizar el método de use de la variable app se comienzan a definir las propiedades MIDDLEWARE
app.use((request, response, next) => {
	var now = new Date();
	var log = `Date: ${ now.toString()}, Method: ${request.method} , URL:  ${request.url}`;
	fs.appendFile('server.log', log + `\n` , error => { if (error) console.log(' Unable to append to server log...')});
	
	//console.log( `${ now } : ${request.method} , ${request.url}`);
	next();
});

app.use( (request, response, next) => {
	response.render('maintenance.hbs');
	next();
});

//Se declara la ruta donde se encontraran las vistas en HTML
app.use( express.static(__dirname + '/public'));


//Se define un Helper para la reutilizacion de fragmentos HTNL el cual tiene como identidicador 'getCurrentYear'
hbs.registerHelper('getCurrentYear', () => {
	return  new Date().getFullYear();
});

//Se define un Helper para cambiar las letras minusculas de un texto a mayusculas
hbs.registerHelper('screamIt', text => {
	return text.toUpperCase();
});

//Ruta con path '/' de la pagina principal, la cual contiene una estructura con variables que se inyectaran de forma dinamica en los archivos .hbs
app.get('/', (request, response) => {
	response.render('home.hbs',{
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to my Page'
	})
});

//Ruta con path '/about' de la pagina about, la cual tiene en su definición  una estructura la cual almacena variables que se inyectarán de forma dinámica
app.get('/about' , (request, response) => {
	//response.send(`<h1> About us</h1>`)
	response.render('about.hbs',{
		pageTitle: 'About Page'
	});
})

app.get('/bad', (request, response) => {
	response.send({
		errorMessage: 'Unable to handle request'
	});
});

//Se define el puerto por el cual el servidor escuchara las peticiones
app.listen(3000);
