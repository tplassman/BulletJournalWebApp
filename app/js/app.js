/* App Module */

var bulletJournalApp = angular.module('bulletJournalApp', [
	'ngRoute', 
	'bulletJournalControllers',
        'bulletJournalServices',
        'firebase'
]);
 
bulletJournalApp.config(['$routeProvider', 
    function($routeProvider) {
        $routeProvider.
          when('/journals', {
            templateUrl: 'partials/journalIndex.html',
            controller: 'journalIndexController'
          }).
          when('/journals/:journalId', {
            templateUrl: 'partials/journal.html',
            controller: 'journalController'
          }).
          otherwise({
            redirectTo: '/journals'
         });
}]);
  
