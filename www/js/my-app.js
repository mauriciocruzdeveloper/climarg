  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
    ]
  
  });

var mainView = app.views.create('.view-main');

function guardarCiudadFavorita(ciudad){
    console.log("guardarCiudadFavorita : " + ciudad);
    if(ciudad!=""){
        var ciudadesFavoritas = localStorage.getItem("favoritas");
        ciudadesFavoritas = JSON.parse(ciudadesFavoritas);
        if(ciudadesFavoritas == null) {
            ciudadesFavoritas = [];
        };
        ciudadesFavoritas.push(ciudad);
        localStorage.setItem("favoritas",JSON.stringify(ciudadesFavoritas));
    };
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized 
    var indiceCiudad= 0;
    var ciudad = "";
    var ciudadesFavoritas = [];

    var url="https://ws.smn.gob.ar/map_items/forecast/1"; 
    
    app.request.json(url, function(datos){
        var contenidoHTML="<option>Seleccione una ciudad</option>";
        for (var i = 0; i < datos.length; i++) {
           contenidoHTML+= "<option value="+i+">" + datos[i].name + "</option>";
        };
        $$("#selLoc").html(contenidoHTML);

        $$("#selLoc").on("change", function(){
            indiceCiudad= $$(this).val();

            miCiudad = datos[indiceCiudad] 
            ciudad = miCiudad.name;
            tempM = miCiudad.weather.morning_temp;
            tempT = miCiudad.weather.afternoon_temp;
            idM = miCiudad.weather.morning_id;
            idT = miCiudad.weather.afternoon_id;
            descM = miCiudad.weather.morning_desc;
            descT = miCiudad.weather.afternoon_desc;

            $$('#ciudad').html(ciudad);
            $$('#tempM').html(tempM + " °C");
            $$('#descM').html(descM);
            $$('#tempT').html(tempT + " °C");
            $$('#descT').html(descT);

            $$('#imgM').attr('src', 'http://openweathermap.org/img/w/'+idM+'d.png');
            $$('#imgT').attr('src', 'http://openweathermap.org/img/w/'+idT+'n.png');
        });

    });

    $$(".irFavoritos").on("click",function(){
        console.log("entra a irFaboritos. ciudad: " + ciudad);
        guardarCiudadFavorita(ciudad);
    });
})