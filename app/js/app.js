/* App Module */

var bulletJournalApp = angular.module('bulletJournalApp', [
	'ngRoute',
	'bulletJournalControllers',
        'bulletJournalServices',
        'firebase',
        'ui.router'
]);

bulletJournalApp.run(['$rootScope', '$state', 'Authentication',
    function ($rootScope, $state, Authentication) {        
        $rootScope.auth = Authentication.init();
        
        $rootScope.$on("$stateChangeStart", function(event, curr, prev) {
          if (curr.authenticate && $rootScope.user === null) {
            // User isn’t authenticated
            console.log('Prepare for login!');
            $state.go("login");
            event.preventDefault(); 
          }
        });
}]);

bulletJournalApp.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "partials/login.html",
        controller: "loginController",
        authenticate: false
      })
      .state("journals", {
        url: "/journals",
        templateUrl: "partials/journals.html",
        controller: "journalsController",
        authenticate: true
      })
      .state("journal", {
        url: "/journals/:journalId",
        templateUrl: "partials/journal.html",
        controller: "journalController",
        authenticate: true
      });
    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/login");
}]);

/*
bulletJournalApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
          when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginController'
          }).
          when('/journals', {
            templateUrl: 'partials/journals.html',
            controller: 'journalsController'
          }).
          when('/journals/:journalId', {
            templateUrl: 'partials/journal.html',
            controller: 'journalController'
          }).
          otherwise({
            redirectTo: '/login'
         });
}]);
*/