/* Controllers */

var bulletJournalControllers = angular.module('bulletJournalControllers', [
  'bulletJournalServices',
  'firebase'
]);

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
                 console.log('in login');
                $scope.err = err? err + '' : null;
                if( !err ) {
                    $rootScope.user = user;
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
      
      /*
      // Create new user
      $scope.signUp = function(newEmail, newPassword, passwordCheck) {
          if (newPassword === passwordCheck) {
              $rootScope.loginObj.$createUser(newEmail, newPassword)
                      .then(function(user) {
                          Authentication.setUser(user);
                          $location.path("/journals");
                      }, function(error) {
                          alert('New user not created: ', error);
                      });
          }
          else {
              alert("Passwords do not match.");
          }
          $scope.newEmail = '';
          $scope.newPassword = '';
          $scope.passwordCheck = '';
      };

      // Login method
      $scope.logIn = function(email, password) {
          $rootScope.loginObj.$login('password', {
                email: email,
                password: password
             }).then(function(user) {
                Authentication.setUser(user);
                $location.path("/journals");
             }, function(error) {
                console.error('Login failed: ', error);
             });
          $scope.email = '';
          $scope.password = '';
      };
      */
}]);
 
bulletJournalControllers.controller('journalsController', ['$rootScope', '$scope', '$state', '$firebase', 'Authentication',
  function ($rootScope, $scope, $state, $firebase, Authentication) {    
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
 
bulletJournalControllers.controller('journalController', ['$rootScope', '$scope', '$stateParams', '$firebase', 'Authentication',
  function ($rootScope, $scope, $stateParams, $firebase, Authentication) {      
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