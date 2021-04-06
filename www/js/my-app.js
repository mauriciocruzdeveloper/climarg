  
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

    var ciudadesFavoritas = JSON.parse(localStorage.getItem("favoritas"));
    if(!ciudadesFavoritas){ciudadesFavoritas = [];};

    var url="https://ws.smn.gob.ar/map_items/forecast/1"; 
    
    app.request.json(url, function(datos){
        console.log("entra al json...");

        cargaSelect();


        $$("#selLoc").on("change", function(){

            console.log("entra al change");

            nombreCiudad= $$(this).val();

            console.log("nombreCiudad: " + nombreCiudad)

            var miCiudad = datos.find(ciudad => ciudad.name === nombreCiudad);

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

            $$('#imgM').attr('src', 'img/'+idM+'d.png');
            $$('#imgT').attr('src', 'img/'+idT+'n.png');
        });

        $$(".irFavoritos").on("click",function(){
            console.log("entra a irFaboritos. ciudad: " + ciudad);
            guardarCiudadFavorita(ciudad);
            cargaSelect();
        });

        $$(".irQuitarFavoritos").on("click",function(){
            console.log("entra a irQuitarFaboritos. ciudad: " + ciudad);
            quitarCiudadFavorita(ciudad);
            cargaSelect();
        });

        function cargaSelect(){
            console.log("entra a cargaSelect: " + JSON.stringify(ciudadesFavoritas));
            var contenidoHTML = "<option>Seleccione una ciudad</option>";
            for (var i=0;i<ciudadesFavoritas.length;i++){
                contenidoHTML += "<option value='" + ciudadesFavoritas[i] + "'>" + ciudadesFavoritas[i] + "</option>";
            };
            contenidoHTML += "<option>-----------------------------------</option>";
            for (var i = 0; i < datos.length; i++) {
               contenidoHTML += "<option value='"+datos[i].name+"'>" + datos[i].name + "</option>";
            };

            $$("#selLoc").html(contenidoHTML);
        }

        function guardarCiudadFavorita(ciudad){
            console.log("guardarCiudadFavorita : " + ciudad);
            if(ciudad!=""){
                if(!ciudadesFavoritas.find(ciu => ciu === ciudad)){
                    ciudadesFavoritas = localStorage.getItem("favoritas");
                    ciudadesFavoritas = JSON.parse(ciudadesFavoritas);
                    if(ciudadesFavoritas == null) {
                        ciudadesFavoritas = [];
                    };
                    ciudadesFavoritas.push(ciudad);
                    console.log("Hizo push en ciudadesFavoritas: " + JSON.stringify(ciudadesFavoritas));
                    localStorage.setItem("favoritas",JSON.stringify(ciudadesFavoritas));
                };
            };
        }

        function quitarCiudadFavorita(ciudad){
            console.log("quitarCiudadFavorita : " + ciudad);
            if(ciudad!=""){
                ciudadesFavoritas = localStorage.getItem("favoritas");
                ciudadesFavoritas = JSON.parse(ciudadesFavoritas);
                if(ciudadesFavoritas != null) {
                    var arrayTemp = [];
                    for (var i=0;i<ciudadesFavoritas.length;i++){
                        if(ciudadesFavoritas[i]!=ciudad){
                            arrayTemp.push(ciudadesFavoritas[i]);
                        }
                    };
                    ciudadesFavoritas=arrayTemp;
                    console.log("ciudadesFavoritas: " + JSON.stringify(ciudadesFavoritas));
                    localStorage.setItem("favoritas",JSON.stringify(ciudadesFavoritas));
                };
            };
        }

    });
})