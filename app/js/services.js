/* Services */

var bulletJournalServices = angular.module('bulletJournalServices', ['ngResource']);

bulletJournalServices.factory('Journal', ['$resource', 
    function($resource) {        
        return $resource('journals/:journalId.json', {}, {
            query: {method:'GET', params:{journalId:'journals'}, isArray:true}
        });
}]);