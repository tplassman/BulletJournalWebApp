/* Services */

var bulletJournalServices = angular.module('bulletJournalServices', []);

bulletJournalServices.service('Authentication', ['$firebaseSimpleLogin',
  function($firebaseSimpleLogin) {
      var auth = null;
      
      this.init = function() {
          var dataRef = new Firebase("https://glaring-fire-6940.firebaseio.com/");
          auth = $firebaseSimpleLogin(dataRef);
          return auth;
      };
            
      this.login = function(email, pass, callback) {
             assertAuth();
             auth.$login('password', {
                email: email,
                password: pass,
                rememberMe: true
               }).then(function(user) {
                     if( callback ) {
                        callback(null, user);
                      }
                   }, callback);
      };
      // May want to add callback to this to confirm logout before stateChangeStart
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