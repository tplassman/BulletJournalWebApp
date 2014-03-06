/* Services */

var bulletJournalServices = angular.module('bulletJournalServices', [
    'firebase'
]);

bulletJournalServices.service('Authentication', ['$firebaseSimpleLogin',
  function($firebaseSimpleLogin) {     
      var auth = null;
      
      this.init = function() {
          var dataRef = new Firebase("https://glaring-fire-6940.firebaseio.com/");
          auth = $firebaseSimpleLogin(dataRef);
      };
            
      this.login = function(email, pass, callback) {
          auth.$login('password', {
              email: email,
              password: pass
             }).then(function(user) {
                   if( callback ) {
                      callback(null, user);
                   }
               }, callback);
      };
      // May want to add callback to this to confirm logout before stateChangeStart
      this.logout = function() {
          window.localStorage.removeItem('user');
          auth.$logout();
      };

      this.createAccount = function(email, pass, callback) {
          auth.$createUser(email, pass)
                  .then(function(user) {
                      callback && callback(null, user)}, callback);
      };
      
      this.getAuth = function() {
          return auth;
      };
  }]);