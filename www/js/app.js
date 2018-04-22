// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var casilinoApp = angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.directives','app.services'])

.config([
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|maps|geo|tel):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.factory('pazienteInterface', function(){
    indicazioniVis = "nascondi";
    photocrumbVis = "nascondi";
    
    
    // Inserire funzioni di tipo toggle
    return {
        getIndicazioniVis : function (){
            return indicazioniVis;
        },
        
        setIndicazioniVis : function (visibility) {
            indicazioniVis = visibility;
        },
        
        getPhotocrumbVis : function () {
            return photocrumbVis;
        },
        
        setPhotocrumbVis : function (visibility) {
            photocrumbVis = visibility;
        }
        
        
        
    };

    
});

/**
 * -----------------------------------------------------------------------------
 * Scanner Barcode
 * -----------------------------------------------------------------------------
 */

casilinoApp.controller("ScanController", function($scope, $cordovaBarcodeScanner) {
    $scope.barcode = "";
	
    $scope.scanBarcode = function() {
        
        try {
            ionic.Platform.ready (function(){
                $cordovaBarcodeScanner.scan().then(function(imageData) {
                    alert(imageData.text);

                }, function(error) {
                    console.log("An error happened -> " + error);
                });                
            });


        }
        catch (e) {
            alert (e.message);
        }
    };
 
});


/**
 * -----------------------------------------------------------------------------
 * Scavenger - Informazioni paziente
 * -----------------------------------------------------------------------------
 */

casilinoApp.controller("ScavengerController", function (
        $scope, 
        $http, 
        $state,
        $cordovaBarcodeScanner) {
            
    $scope.infoClass = "nascondi";
    $scope.codicePaziente = window.localStorage.getItem("paziente-id");
	
    $scope.scanBarcode = function() {
        try {
            ionic.Platform.ready (function(){
                $cordovaBarcodeScanner.scan().then(function(imageData) {
                    window.localStorage.setItem("paziente-id", imageData.text);
                    $scope.codicePaziente = imageData.text;
                    
                }, function(error) {
                    console.log("An error happened -> " + error);
                });                
            });


        }
        catch (e) {
            alert (e.message);
        }
        
        
    };
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $scope.getJson = function () {
        // $scope.esito = "Funziona";
        $scope.infoClass = "nascondi";
        $scope.indicazioniVis = "nascondi";
        
       
        if ($scope.codicePaziente === null || $scope.codicePaziente ==="") {
            alert("Inserire il codice del paziente");
        }
        else {

        $http.get("http://207.154.201.210/casilino/paziente/info")
            .success(function (data) {
                $scope.info = data;
                $scope.info.ricoveroIndirizzoUser = data.ricoveroIndirizzo;

                indirizzo = data.ricoveroIndirizzo;
                    if (indirizzo !== null && indirizzo.substring(0,3) === "PC|") {

                        reparto = indirizzo.substring(3);
                        $scope.info.ricoveroIndirizzoUser = "";
                        window.localStorage.setItem('route-arrivo', reparto);
                        
                        window.localStorage.removeItem("route-partenza");
                        window.localStorage.removeItem("route-partenzePossibili");
                    }
                    else {
                        $scope.info.ricoveroIndirizzoUser = data.ricoveroIndirizzo;
                    }
                    // console.log(data);

                if (data.ricoveroStruttura === null) {
                    $scope.infoClass = "mostra";
                    $scope.indicazioniVis = 'nascondi';
                    $scope.labradioVis = 'mostra';
                }
                else {
                    $scope.infoClass = "mostra";
                    $scope.indicazioniVis = 'mostra';
                    $scope.labradioVis = 'nascondi';
                }

            })
            .error(function (data) {
                alert("ERROR \n______________\n" + data);
            });
                            
        }

        
    };
    
    
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        
    $scope.navigaRicovero = function (indirizzo) {
        if (typeof(indirizzo) === 'undefined') {return;}
        if (indirizzo === null) {return;}
        if (indirizzo === "null") {return;}
        
        
        if (indirizzo.substring(0,3) === "PC|") {
            $state.go("route-info");
            return;    
                       
        }
        
        


        var userOS = "";

        ionic.Platform.ready(function() {
            if (ionic.Platform.isIPad()){
                userOS = "ios";
            }
            if (ionic.Platform.isIOS()){
                userOS = "ios";
            }
            if (ionic.Platform.isAndroid()){
                userOS = "android";
            }
        });
            
            
            
        try {
            indirizzo = encodeURI(indirizzo);


            if (userOS == 'ios') {
                indirizzo = "maps:q=" + indirizzo;
            }
            else {
                indirizzo = "https://maps.google.com/maps/dir//" + indirizzo;
            }
            
            window.open(indirizzo, "_system", 'location=yes');
            return false;
        }
        catch (e) {
            alert(e.message);
        };
        
            
            
    };
});


/**
 * -----------------------------------------------------------------------------
 * Affollamento
 * -----------------------------------------------------------------------------
 */

casilinoApp.controller("AffollamentoController", function ($scope, $http) {

    $scope.affollamento = ["info", "altro"];

    $http.get("http://207.154.201.210/casilino/affollamento/affollamento")
        .success(function(data) {
            $scope.affollamento.info = data;
        })
        .error(function(data) {
            $scope.affollamento.info=("ERROR \n______________\n" + data);
        });
});


/**
 * -----------------------------------------------------------------------------
 * Tempi di attesa
 * -----------------------------------------------------------------------------
 */

casilinoApp.controller("AttesaController", function ($scope, $http) {

	$scope.attesa = ["info", "omini"];

        $scope.generaOmini = function (codice, num) {
            
            imgurl = "<img src=\"img/man-" + codice + ".png\"> ";
            markup = imgurl.repeat(num);

            return (markup);
            
        };

        $http.get("http://207.154.201.210/casilino/affollamento/attesa")
            .success(function(data) {
		$scope.attesa.info = data;
                

                $scope.attesa.info.medico.attesa.r = $scope.generaOmini('rosso', $scope.attesa.info.medico.attesa.r);
                $scope.attesa.info.medico.attesa.g = $scope.generaOmini('giallo', $scope.attesa.info.medico.attesa.g);
                $scope.attesa.info.medico.attesa.v = $scope.generaOmini('verde', $scope.attesa.info.medico.attesa.v);                
                $scope.attesa.info.medico.attesa.b = $scope.generaOmini('bianco', $scope.attesa.info.medico.attesa.b);                
                
                $scope.attesa.info.chirurgico.attesa.r = $scope.generaOmini('rosso', $scope.attesa.info.chirurgico.attesa.r);
                $scope.attesa.info.chirurgico.attesa.g = $scope.generaOmini('giallo', $scope.attesa.info.chirurgico.attesa.g);
                $scope.attesa.info.chirurgico.attesa.v = $scope.generaOmini('verde', $scope.attesa.info.chirurgico.attesa.v);                
                $scope.attesa.info.chirurgico.attesa.b = $scope.generaOmini('bianco', $scope.attesa.info.chirurgico.attesa.b);                
                
                $scope.attesa.info.ginecologico.attesa.r = $scope.generaOmini('rosso', $scope.attesa.info.ginecologico.attesa.r);
                $scope.attesa.info.ginecologico.attesa.g = $scope.generaOmini('giallo', $scope.attesa.info.ginecologico.attesa.g);
                $scope.attesa.info.ginecologico.attesa.v = $scope.generaOmini('verde', $scope.attesa.info.ginecologico.attesa.v);                
                $scope.attesa.info.ginecologico.attesa.b = $scope.generaOmini('bianco', $scope.attesa.info.ginecologico.attesa.b);                

                $scope.attesa.info.ortopedico.attesa.r = $scope.generaOmini('rosso', $scope.attesa.info.ortopedico.attesa.r);
                $scope.attesa.info.ortopedico.attesa.g = $scope.generaOmini('giallo', $scope.attesa.info.ortopedico.attesa.g);
                $scope.attesa.info.ortopedico.attesa.v = $scope.generaOmini('verde', $scope.attesa.info.ortopedico.attesa.v);                
                $scope.attesa.info.ortopedico.attesa.b = $scope.generaOmini('bianco', $scope.attesa.info.ortopedico.attesa.b);       
                
                $scope.attesa.info.bassaintensita.attesa.r = $scope.generaOmini('rosso', $scope.attesa.info.bassaintensita.attesa.r);
                $scope.attesa.info.bassaintensita.attesa.g = $scope.generaOmini('giallo', $scope.attesa.info.bassaintensita.attesa.g);
                $scope.attesa.info.bassaintensita.attesa.v = $scope.generaOmini('verde', $scope.attesa.info.bassaintensita.attesa.v);                
                $scope.attesa.info.bassaintensita.attesa.b = $scope.generaOmini('bianco', $scope.attesa.info.bassaintensita.attesa.b);       
                
                
                // :::::::::::::::::::::: trattamento

                $scope.attesa.info.medico.trattamento.r = $scope.generaOmini('rosso', $scope.attesa.info.medico.trattamento.r);
                $scope.attesa.info.medico.trattamento.g = $scope.generaOmini('giallo', $scope.attesa.info.medico.trattamento.g);
                $scope.attesa.info.medico.trattamento.v = $scope.generaOmini('verde', $scope.attesa.info.medico.trattamento.v);                
                $scope.attesa.info.medico.trattamento.b = $scope.generaOmini('bianco', $scope.attesa.info.medico.trattamento.b);                
                
                $scope.attesa.info.chirurgico.trattamento.r = $scope.generaOmini('rosso', $scope.attesa.info.chirurgico.trattamento.r);
                $scope.attesa.info.chirurgico.trattamento.g = $scope.generaOmini('giallo', $scope.attesa.info.chirurgico.trattamento.g);
                $scope.attesa.info.chirurgico.trattamento.v = $scope.generaOmini('verde', $scope.attesa.info.chirurgico.trattamento.v);                
                $scope.attesa.info.chirurgico.trattamento.b = $scope.generaOmini('bianco', $scope.attesa.info.chirurgico.trattamento.b);                
                
                $scope.attesa.info.ginecologico.trattamento.r = $scope.generaOmini('rosso', $scope.attesa.info.ginecologico.trattamento.r);
                $scope.attesa.info.ginecologico.trattamento.g = $scope.generaOmini('giallo', $scope.attesa.info.ginecologico.trattamento.g);
                $scope.attesa.info.ginecologico.trattamento.v = $scope.generaOmini('verde', $scope.attesa.info.ginecologico.trattamento.v);                
                $scope.attesa.info.ginecologico.trattamento.b = $scope.generaOmini('bianco', $scope.attesa.info.ginecologico.trattamento.b);                

                $scope.attesa.info.ortopedico.trattamento.r = $scope.generaOmini('rosso', $scope.attesa.info.ortopedico.trattamento.r);
                $scope.attesa.info.ortopedico.trattamento.g = $scope.generaOmini('giallo', $scope.attesa.info.ortopedico.trattamento.g);
                $scope.attesa.info.ortopedico.trattamento.v = $scope.generaOmini('verde', $scope.attesa.info.ortopedico.trattamento.v);                
                $scope.attesa.info.ortopedico.trattamento.b = $scope.generaOmini('bianco', $scope.attesa.info.ortopedico.trattamento.b);                   
                
                $scope.attesa.info.bassaintensita.trattamento.r = $scope.generaOmini('rosso', $scope.attesa.info.bassaintensita.trattamento.r);
                $scope.attesa.info.bassaintensita.trattamento.g = $scope.generaOmini('giallo', $scope.attesa.info.bassaintensita.trattamento.g);
                $scope.attesa.info.bassaintensita.trattamento.v = $scope.generaOmini('verde', $scope.attesa.info.bassaintensita.trattamento.v);                
                $scope.attesa.info.bassaintensita.trattamento.b = $scope.generaOmini('bianco', $scope.attesa.info.bassaintensita.trattamento.b);                      
            
                // :::::::::::::::::::::: Osservazione/ricovero
                
                $scope.attesa.info.totale_oss.r = $scope.generaOmini('rosso', $scope.attesa.info.totale_oss.r);
                $scope.attesa.info.totale_oss.g = $scope.generaOmini('giallo', $scope.attesa.info.totale_oss.g);
                $scope.attesa.info.totale_oss.v = $scope.generaOmini('verde', $scope.attesa.info.totale_oss.v);                
                $scope.attesa.info.totale_oss.b = $scope.generaOmini('bianco', $scope.attesa.info.totale_oss.b);   

            })
            .error(function(data) {
                $scope.attesa.info=("ERROR \n______________\n" + data);
            });
        
       
});


/**
 * -----------------------------------------------------------------------------
 * Home page
 * -----------------------------------------------------------------------------
 */

casilinoApp.controller("HomeController", function ($scope, $http) {

    $scope.navigatore = function (indirizzo) {
        var userOS = "";

        ionic.Platform.ready(function() {
            if (ionic.Platform.isIPad()){
                userOS = "ios";
            }
            if (ionic.Platform.isIOS()){
                userOS = "ios";
            }
            if (ionic.Platform.isAndroid()){
                userOS = "android";
            }
        });


        try {
            indirizzo = encodeURI(indirizzo);

            if (userOS == 'ios') {
                indirizzo = "maps:q=" + indirizzo;
            }
            else {
                indirizzo = "https://maps.google.com/maps/dir//" + indirizzo;
            }
            
            window.open(indirizzo, "_system", 'location=yes');
            return false;
        }
        catch (e) {
            alert(e.message);
        };
    };
});


/**
 * -----------------------------------------------------------------------------
 * Photocrumb
 * -----------------------------------------------------------------------------
 */

casilinoApp.controller("PhotocrumbController", function (
        $scope, 
        $http, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate) 
        {
    
    
    $scope.mostraphotocrumb = "mostra";
    
    $scope.partenzePossibili = [];
    
    
    $scope.route = function (partenza, arrivo) {
        $scope.txtRoute = new Array();
        $scope.imgRoute = new Array();
        $scope.slideIndex = 0;
        
        httpurl = "http://207.154.201.210/casilino/photocrumb/route/";
        
        $http.get(httpurl + partenza + "/" + arrivo)
                .success(function (data) {
                    
                    baseUrl = "http://207.154.201.210/casilino/public/img/crumbs/";
                    // console.log(data);
                    for (var id in data) {
                        
                        $scope.txtRoute.push(data[id]);
                        
                        // Date.now per evitare caching delle immagini
                        $scope.imgRoute.push(baseUrl + id + ".jpg?" + Date.now);
                    }
                    try {
                        $ionicScrollDelegate.scrollBottom();
                        $ionicSlideBoxDelegate.update();    
                        $ionicScrollDelegate.scrollBottom();
                        
                    }catch(ex) {
                        console.log(ex.message);
                    }

                })
                .error(function (data) {
                    alert("ERRORE \n______________\n" + data);
                });     
        

    };
    
    $scope.selezionaDestinazione = function (dest) {
        window.localStorage.setItem("route-arrivo", "obi");
    };
    
    
    $scope.possibiliPartenze = function () {
        arrivo = window.localStorage.getItem("route-arrivo");
        
        $http.get("http://207.154.201.210/casilino/photocrumb/partenzeper/" + arrivo)
            .success(function (data) {
                    $scope.partenzePossibili= data;
            
                    window.localStorage.setItem(
                        "route-partenzePossibili", 
                        JSON.stringify(data)
                        );
            })
            .error(function (data) {
                alert("ERRORE \n______________\n" + data);
            });             

    };
    
    
    $scope.selezionaPartenza = function (partenza) {
         window.localStorage.setItem('route-partenza', partenza);
         arrivo = window.localStorage.getItem('route-arrivo');
         
         $scope.route(partenza, arrivo);
         
    };
    
    
    

});

/**
 * -----------------------------------------------------------------------------
 * Lista questionari
 * -----------------------------------------------------------------------------
 */


casilinoApp.controller("QuestionariListaController", function ($scope, $http) {
    $scope.attivi= [];

    
    $http.get("http://207.154.201.210/casilino/questionari/lista")
        .success(function (data) {
            $scope.attivi = data;
            
        })
        .error(function (data) {
            alert("ERRORE \n______________\n" + data);
        }); 
    
    
    $scope.apriQuestionario = function(id) 
    {
        
        window.localStorage.setItem("questionario-id", id);
    };
   
});


/**
 * =============================================================================
 * Questionari=sondaggi
 * =============================================================================
 */

casilinoApp.controller("QuestionarioController", function (
        $scope, 
        $http, 
        $httpParamSerializer, 
        $ionicPopup) {
    
    baseUrl = "http://207.154.201.210/casilino/questionari/";
    
    $scope.questionarioId = window.localStorage.getItem('questionario-id');
    $scope.uuid = "";
    $scope.form = "";
    $scope.idesiste = false;
    $scope.infoGen = {};
    $scope.formData = {};

    
    
    $scope.checkid = function (){


        
        checkUrl = baseUrl 
                   + "checkid/"
                   + $scope.questionarioId
                   + "/" 
                   + $scope.uuid;
           
        // console.log(checkUrl);
        
        
        $http.get(checkUrl)
            .success(function (data) {
                if (data === "1") {
                    $scope.idesiste = true;
                }
                else {
                    $scope.idesiste = false;
                }

                
            })
            .error(function (data) {
                console.log("::ERRORE::\n");
                console.log(data);
            });         

    };
    
    
    
    $scope.salva = function () {
        
        $scope.formData.id = $scope.uuid
        
        console.log("FORMDATA " + $scope.formData);
        
        // Serializzo i dati per invio con request http
        serializData = $httpParamSerializer($scope.formData);
        
        
        $http({
        method  : 'POST',
        url     : baseUrl + "salva/" + $scope.questionarioId + "/" + $scope.uuid,
        data    : serializData, 
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
        })
        .success(function(data) {
            console.log(data)
            if (data.esito === 'success') {
                mode = "";
                if (data.mode === "update") mode = "Aggiornamento";
                if (data.mode === "insert") mode = "Inserimento";
                
                $scope.popup("Salvataggio dati", mode + " eseguito");
                
            }
            
        })        
        .error(function (data) {
           console.log("::ERRORE::\n");
           console.log(data);
        });   
        
        
        
    };
    
    $scope.recupera = function () {
        
        recuperaUrl = baseUrl 
                + "risposte/" 
                + $scope.questionarioId 
                + "/" 
                + $scope.uuid;
        
        // console.log(recuperaUrl);
        $http.get(recuperaUrl)
            .success(function (data) {
                if (data.responseData !== false) {
                    $scope.formData = data.responseData;
                }
                
                // Per sicurezza forza aggiornamento di UUID
                // $scope.deviceID();
            })
            .error(function (data) {
                console.log("::ERRORE::\n");
                console.log(data);
            });         
        
    };
    
    $scope.elimina = function () {
        if (confirm("Eliminare le risposte ?") === false) return;
                
            eliminaUrl = baseUrl 
                    + "elimina/" 
                    + $scope.questionarioId 
                    + "/" 
                    + $scope.uuid;

            console.log(eliminaUrl);

            $http.get(eliminaUrl)
                .success(function (data) {

                    // console.log(data);
                    if (data.esito === "success") {
                        $scope.popup(
                            "Eliminazione", 
                            "Il tuo contributo è stato eliminato"
                        );
                    }
                    else {
                        throw "Problemi nell'eliminazione, controllare la connessione"
                    }

                    // Per sicurezza forza aggiornamento di UUID
                    // $scope.deviceID();
                })
                .error(function (data) {
                    console.log("::ERRORE::\n");
                    console.log(data);
                });  
                
        
    };    
    
    $scope.popup = function (titolo, messaggio) {
        $ionicPopup.alert({
            title: titolo,
            template: "<div class='text-center'>" + messaggio + "</div>"
            
        });
    };
    
    $scope.conferma = function (titolo, messaggio) {
        
        var confirmPopup = $ionicPopup.confirm({
            title: titolo,
            template: "<div class='text-center'>" + messaggio + "</div>"
        });
        
        risposta = false;
        
        confirmPopup.then(function(r) {

            if(r) {
                risposta = true;
                
            }
            else {
                risposta = false;
            }
        })
        
        return(risposta);
    };
    
    $scope.deviceID = function () {
        try {
            ionic.Platform.ready(function(){
                $scope.uuid =  window.device.uuid;
            });

        }
        catch (ex) {
            $scope.uuid = "NO_UUID";
            // console.log(ex.message);
        };        
    };
    
    
    /**
     * Inizializzazione modello
     * ________________________
     *      
     */
    var init = function () {
        formUrl = baseUrl + "render/" + $scope.questionarioId;    

        /*
         * Recupero struttura e contenuto del form
         */
        $http.get(formUrl)
            .success(function (data) {
                $scope.form = data;
                console.log(data);
            })
            .error(function (data) {
                console.log("::ERRORE:: [questionari:formURl]\n");
                console.log(data);
            }); 

        /**
         * Recupero UUID del device
         */
        $scope.deviceID();



        /**
         * Recupero informazioni generali del questionario
         */
        infoUrl = baseUrl + "info/" + $scope.questionarioId;

        $http.get(infoUrl)
            .success(function (data) {
                $scope.infoGen = data;
               // console.log(data);

            })
            .error(function (data) {
                console.log("::ERRORE:: [questionari:infoUrl]\n");
                console.log(data);
            }); 
            
            
        /**
         * Controllo se il device ha già votato
         */
        $scope.checkid();
        $scope.recupera();
        
        
       
    };
    
    init();
    

    
});

