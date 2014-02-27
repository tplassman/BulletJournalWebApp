/* Services */

var bulletJournalServices = angular.module('bulletJournalServices', []);

bulletJournalServices.service('Authentication', ['$rootScope', '$firebaseSimpleLogin',
  function($rootScope, $firebaseSimpleLogin) {
      console.log('auth gets null');
      var auth = null;
      
      this.init = function() {
          console.log('init called');
          var dataRef = new Firebase("https://glaring-fire-6940.firebaseio.com/");
          auth = $firebaseSimpleLogin(dataRef);
          $rootScope.user = null;
          return auth;
      };
            
      this.login = function(email, pass, callback) {
             console.log('loggin in');
             assertAuth();
             console.log('auth asserted');
             auth.$login('password', {
                email: email,
                password: pass,
                rememberMe: true
               }).then(function(user) {
                   console.log('user: ', user);
                     if( callback ) {
                         console.log('callback: ', callback);
                        callback(null, user);
                      }
                   }, callback);
      };

      this.logout = function() {
            assertAuth();
            auth.$logout();
      };

      this.createAccount = function(email, pass, callback) {
            assertAuth();
            auth.$createUser(email, pass)
                    .then(function(user) {
                        callback && callback(null, user)}, callback);
      };
      
      function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
      };      
  }]);