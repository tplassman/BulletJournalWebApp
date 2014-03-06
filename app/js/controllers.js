/* Controllers */

var bulletJournalControllers = angular.module('bulletJournalControllers', [
  'bulletJournalServices',
  'firebase'
]);

bulletJournalControllers.controller('mainController', ['$rootScope', '$scope', '$state', 'Authentication',
  function ($rootScope, $scope, $state, Authentication) {      
      $scope.loggedIn;
      if (window.localStorage.getItem('user') === null) {
          $scope.loggedIn = false;
      }
      else {
          $scope.loggedIn = true;
      }
            
      $scope.logout = function() {
          Authentication.logout();
          $state.go("main.login");
      };
}]);

bulletJournalControllers.controller('loginController', ['$rootScope', '$scope', '$state', 'Authentication',
  function ($rootScope, $scope, $state, Authentication) {
      $scope.email = null;
      $scope.password = null;
      $scope.newEmail = null;
      $scope.newPassword = null;
      $scope.passwordCheck = null;

      $scope.login = function(cb) {
          $scope.err = null;
          if( !$scope.email ) {
             $scope.err = 'Please enter an email address';
          }
          else if( !$scope.password ) {
             $scope.err = 'Please enter a password';
          }
          else {
              
              Authentication.login($scope.email, $scope.password, function(err, user) {
                 $scope.err = err? err + '' : null;
                 if( !err ) {
                      cb && cb(user);
                      var user = {'email': $scope.email, 'password': $scope.password};
                      window.localStorage.setItem('user', JSON.stringify(user));
                      $scope.email = null;
                      $scope.password = null;
                      $state.go("main.journals");
                 }
                 else {
                     $scope.err = err? err + '' : null;
                     console.log('error: ', err);
                 }
              });
          }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            Authentication.createAccount($scope.newEmail, $scope.newPassword, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
                  console.log('error: ', err);
               }
               else {
                  var user = {'email': $scope.newEmail, 'password': $scope.newPassword};
                  window.localStorage.setItem('user', JSON.stringify(user));
                  $scope.newEmail = null;
                  $scope.newPassword = null;
                  $scope.passwordCheck = null;
                  console.log('Lets Go!');
                  $state.go("main.journals");
               }
            });
         }
      };
      
      function assertValidLoginAttempt() {
         if( !$scope.newEmail ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.newPassword ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.newPassword !== $scope.passwordCheck ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
}]);
 
bulletJournalControllers.controller('journalsController', ['$rootScope', '$scope', '$firebase', 'Authentication',
  function ($rootScope, $scope, $firebase, Authentication) {          
      console.log('userId', $rootScope.userId);
      // Get journal list from Firbase
      var journalListRef = new Firebase('https://glaring-fire-6940.firebaseio.com/'+$rootScope.userId+'/journals');
      $scope.journals = $firebase(journalListRef);
      
      $scope.newJournal = null;
      
      // Add new journal to Firebase journal list
      $scope.addJournal = function() {
          console.log('userId', $rootScope.userId);
          $scope.journals.$add({name:$scope.newJournal, created:Date()});
          $scope.newJournal = null;
      };
      
      // Remove journal from Firebase
      $scope.removeJournal = function(journal) {
          $scope.journals.$remove(journal);
      };
      
      $rootScope.journalList = true;
      $rootScope.journalListView = function() {
          $rootScope.journalList = !$rootScope.journalList;
      };
}]);
 
bulletJournalControllers.controller('journalController', ['$rootScope', '$scope', '$stateParams', '$firebase', 'Authentication',
  function ($rootScope, $scope, $stateParams, $firebase, Authentication) {      
      $scope.journalId = $stateParams.journalId;
      
      var journalRef = new Firebase('https://glaring-fire-6940.firebaseio.com/'+$rootScope.userId+'/journals/'+$scope.journalId+'/items');
      $scope.items = $firebase(journalRef);
      
      $scope.newItem = null;
      
      // Add new item to Firebase
      $scope.addItem = function() {
          var type = $('input[name=type]:checked','#newItem').val();
          var attributes = [];
          $('input[name=attribute]:checked','#newItem').each(function(){
              attributes.push($(this).val());
              return attributes;
          });
          if(type === "task") {
              $scope.items.$add({attributes:attributes, created:Date(), text:$scope.newItem, type:type, completed: false});
              $scope.newItem = null;;
          }
          else {
              $scope.items.$add({attributes:attributes, created:Date(), text:$scope.newItem, type:type});
              $scope.newItem = null;;
          }
      };
      
      // Remove item from Firebase
      $scope.removeItem = function(item) {
          $scope.items.$remove(item);
      };
      
      $rootScope.journalListView = function() {
          $rootScope.journalList = !$rootScope.journalList;
      };
      
      $scope.taskStatusUpdate = function(item) {
          $scope.items[item].completed = !$scope.items[item].completed;
      };
}]);