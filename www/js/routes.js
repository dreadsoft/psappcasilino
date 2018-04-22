angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('policlinicoCasilino', {
    url: '/home',
    templateUrl: 'templates/policlinicoCasilino.html',
    controller: 'policlinicoCasilinoCtrl'
  })

  .state('informazioni', {
    url: '/page8',
    templateUrl: 'templates/informazioni.html',
    controller: 'informazioniCtrl'
  })

  .state('assegnazioneCodici', {
    url: '/codici',
    templateUrl: 'templates/assegnazioneCodici.html',
    controller: 'assegnazioneCodiciCtrl'
  })

  .state('pagamentoCodiciBianchi', {
    url: '/pagamentocodicibianchi',
    templateUrl: 'templates/pagamentoCodiciBianchi.html',
    controller: 'pagamentoCodiciBianchiCtrl'
  })

  .state('contatti', {
    url: '/contatti',
    templateUrl: 'templates/contatti.html',
    controller: 'contattiCtrl'
  })

  .state('paziente', {
    url: '/paziente',
    templateUrl: 'templates/paziente.html',
    controller: 'pazienteCtrl'
  })
  
  .state ('qrcode', {
	  url: "/qrcode",
	  templateUrl: "templates/qrcode.html", 
	  controller: 'ScanController'
  })
  
  .state ('affollamento', {
	  url: "/affollamento",
	  templateUrl: "templates/affollamento.html", 
	  controller: 'AffollamentoController'
  }) 
  
.state ('info_durantelavisita', {
    url: "/info_durantelavisita",
    templateUrl: "templates/info_durantelavisita.html",
    controller: 'informazioniCtrl'
})

.state ('info_finitalavisita', {
    url: "/info_finitalavisita",
    templateUrl: "templates/info_finitalavisita.html",
    controller: 'informazioniCtrl'
})

.state ('info_primadirivolgersi', {
    url: "/info_primadirivolgersi",
    templateUrl: "templates/info_primadirivolgersi.html",
    controller: 'informazioniCtrl'
})

.state ('info_inattesa', {
    url: "/info_inattesa",
    templateUrl: "templates/info_inattesa.html",
    controller: 'informazioniCtrl'
})

.state ('route-info', {
    url: "/route-info",
    templateUrl: "templates/route-info.html",
    controller: 'PhotocrumbController'
})

.state ('questionari-index', {
    url: "/questionari-index",
    templateUrl: "templates/questionari-index.html",
    controller: 'QuestionariListaController'
})

.state ('questionario', {
    url: "/questionario",
    templateUrl: "templates/questionario.html",
    controller: 'QuestionarioController'
})

$urlRouterProvider.otherwise('/home');

});

