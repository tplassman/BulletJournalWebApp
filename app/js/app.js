/* App Module */

var bulletJournalApp = angular.module('bulletJournalApp', [
	'bulletJournalControllers',
        'bulletJournalServices',
        'firebase',
        'ui.router'
]);

bulletJournalApp.run(['$rootScope', '$state', 'Authentication',
    function ($rootScope, $state, Authentication) {
        Authentication.init();
        
        // Reload firebase if user is logged in and page is reloaded
        if (window.localStorage.getItem('user') !== null) {
            Authentication.login(
                    JSON.parse(window.localStorage.getItem('user')).email,
                    JSON.parse(window.localStorage.getItem('user')).password,
                    function(err, user) {
                        if( !err ) {
                            $rootScope.userName = user.email;
                            $rootScope.userId = user.id;
                            $state.go("main.journals");
                        }
                        else {
                            console.log("error", err);
                            $state.go("main.login");
                        }
                    }
            );
        }
        
        $rootScope.$on("$stateChangeStart", function(event, curr, prev) {
            if (curr.authenticate && window.localStorage.getItem('user') === null) {
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
        url: "/:journalId",
        templateUrl: "partials/journal.html",
        controller: "journalController",
        authenticate: true
      });
    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/");
}]);