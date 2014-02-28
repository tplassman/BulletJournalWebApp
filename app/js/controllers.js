/* Controllers */

var bulletJournalControllers = angular.module('bulletJournalControllers', [
  'bulletJournalServices',
  'firebase',
  'ngStorage'
]);

bulletJournalControllers.controller('mainController', ['$localStorage', '$scope', '$stateParams', '$firebase', 'Authentication',
  function ($localStorage, $scope, $stateParams, $firebase, Authentication) {      
      $scope.logout = function() {
          console.log('loggin out');
          delete $localStorage.auth;
          console.log('$localStorage', $localStorage);
          Authentication.logout();
      };
}]);

bulletJournalControllers.controller('loginController', ['$localStorage', '$scope', '$state', 'Authentication',
  function ($localStorage, $scope, $state, Authentication) {
      $scope.email = null;
      $scope.password = null;
      $scope.newEmail = null;
      $scope.newPassword = null;
      $scope.passwordCheck = null;
      $scope.user = null;

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
                 console.log('in login');
                $scope.err = err? err + '' : null;
                if( !err ) {
                    console.log('adding user to local storage');
                    console.log('$localStorage auth', $localStorage.auth);
                    console.log('$localStorage user', $localStorage.auth.user);
                     cb && cb(user);
                }
                $scope.email = null;
                $scope.password = null;
                $state.go("journals");
             });
          }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            Authentication.createAccount($scope.newEmail, $scope.newPassword, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  $scope.newEmail = null;
                  $scope.newPassword = null;
                  $scope.passwordCheck = null;
                  $state.go("journals");
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
 
bulletJournalControllers.controller('journalsController', ['$localStorage', '$scope', '$state', '$firebase', 'Authentication',
  function ($localStorage, $scope, $state, $firebase, Authentication) {    
      $scope.user = $localStorage.auth.user;
      
      // Get journal list from Firbase
      var journalListRef = new Firebase('https://glaring-fire-6940.firebaseio.com/journals');
      $scope.journals = $firebase(journalListRef);
      
      // Add new journal to Firebase journal list
      $scope.addJournal = function() {
          $scope.journals.$add({name:$scope.newJournal, created:Date(), items:[null]});
          $scope.newJournal = '';
      };
      
      // Remove journal from Firebase
      $scope.removeJournal = function(journal) {
          $scope.journals.$remove(journal);
      };
}]);
 
bulletJournalControllers.controller('journalController', ['$localStorage', '$scope', '$stateParams', '$firebase', 'Authentication',
  function ($localStorage, $scope, $stateParams, $firebase, Authentication) {      
      $scope.user = $localStorage.auth.user;
      $scope.journalId = $stateParams.journalId;
      
      var journalRef = new Firebase('https://glaring-fire-6940.firebaseio.com/journals/'+$scope.journalId+'/items');
      $scope.items = $firebase(journalRef);
      
      // Add new item to Firebase
      $scope.addItem = function() {
          var type = $('input[name=type]:checked','#newItem').val();
          var attributes = [];
          $('input[name=attribute]:checked','#newItem').each(function(){
              attributes.push($(this).val());
              return attributes;
          });
          $scope.items.$add({attributes:attributes, created:Date(), text:$scope.newItem, type:type});
          $scope.newItem = '';
      };
      
      // Remove item from Firebase
      $scope.removeItem = function(item) {
          $scope.items.$remove(item);
      };
}]);