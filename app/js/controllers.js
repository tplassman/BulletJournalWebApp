/* Controllers */

var bulletJournalControllers = angular.module('bulletJournalControllers', [
  'bulletJournalServices',
  'firebase'
]);
 
bulletJournalControllers.controller('journalIndexController', ['$scope', '$firebase', 
  function ($scope, $firebase) {
      // Get journal list from Firbase
      var journalListRef = new Firebase('https://glaring-fire-6940.firebaseio.com/journals');
      $scope.journals = $firebase(journalListRef);
      
      // Add new journal to Firebase journal list
      $scope.addJournal = function() {
          $scope.journals.$add({id:$scope.newJournal, created:Date()});
          $scope.newJournal = '';
      };
      
      // Remove journal from Firebase
      $scope.removeJournal = function(journal) {
          $scope.journals.$remove(journal);
      };
}]);
 
bulletJournalControllers.controller('journalController', ['$scope', '$routeParams', '$firebase',
  function ($scope, $routeParams, $firebase) {
      // Get journal items from Firbase
      $scope.journalId = $routeParams.journalId;
      var journalRef = new Firebase('https://glaring-fire-6940.firebaseio.com/'+$scope.journalId+'/items');
      $scope.items = $firebase(journalRef);
      
      // Add new item to Firebase
      $scope.addItem = function() {
          $scope.items.$add({attribute:null, complete:false, created:Date(), text:"test", type:$scope.newItem});
          $scope.newItem = '';
      };
      
      // Remove item from Firebase
      $scope.removeItem = function(item) {
          $scope.items.$remove(item);
      };
}]);