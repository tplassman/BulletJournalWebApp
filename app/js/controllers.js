/* Controllers */

var bulletJournalControllers = angular.module('bulletJournalControllers', [
  'bulletJournalServices',
  'firebase'
]);
 
bulletJournalControllers.controller('journalIndexController', ['$scope', 'Journal', '$firebase', 
  function ($scope, Journal, $firebase) {
      var journalRef = new Firebase('https://glaring-fire-6940.firebaseio.com/');
      $scope.journals = $firebase(journalRef);
      //$scope.journals = Journal.query();
    
      $scope.addJournal = function() {
        $scope.journals.push({age:$scope.journals.length , id:$scope.newJournal, created:'today'});
        Journal.save({journalId:$scope.newJournal}, $scope.journals);
        $scope.newJournal = '';
      };
}]);
 
bulletJournalControllers.controller('journalController', ['$scope', '$routeParams', 'Journal', '$firebase',
  function ($scope, $routeParams, Journal, $firebase) {
      var journalRef = new Firebase('https://glaring-fire-6940.firebaseio.com/');
      $scope.journal = $firebase(journalRef);
      $scope.journalId = $routeParams.journalId;
      //$scope.journal = Journal.get({journalId: $routeParams.journalId}, function(journal) {
      //});
}]);