/* App Module */

var bulletJournalApp = angular.module('bulletJournalApp', [
	'ngRoute',
	'bulletJournalControllers',
        'bulletJournalServices',
        'firebase',
        'ui.router',
        'ngStorage'
]);

bulletJournalApp.run(['$rootScope', '$localStorage', '$state', 'Authentication',
    function ($rootScope, $localStorage, $state, Authentication) { 
        console.log('local storage auth', $localStorage.auth);
        if($localStorage.auth === undefined) {
            $localStorage.auth =  Authentication.init();
            console.log('local storage auth', $localStorage.auth);
        }
        
        $rootScope.$on("$stateChangeStart", function(event, curr, prev) {
            console.log('checking local storage for user');
            console.log('user', $localStorage.auth.user);
          if (curr.authenticate && $localStorage.auth.user === null) {
            // User isn’t authenticated
            console.log('Prepare for login!');
            $state.go("main.login");
            event.preventDefault(); 
          }
        });
}]);

bulletJournalApp.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("main", {
        url: "/",
        templateUrl: "partials/main.html",
        view: "main",
        controller: "mainController",
        authenticate: false
      })
      .state("main.login", {
        url: "login",
        templateUrl: "partials/login.html",
        controller: "loginController",
        authenticate: false
      })
      .state("main.journals", {
        url: "journals",
        templateUrl: "partials/journals.html",
        controller: "journalsController",
        authenticate: true
      })
      .state("main.journals.journal", {
        url: "journals/:journalId",
        templateUrl: "partials/journal.html",
        controller: "journalController",
        authenticate: true
      });
    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/");
}]);