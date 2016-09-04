
( function() {
    'use strict';

    angular.module( 'appBrunoAir' )
        .directive( 'spinner', spinner );

    spinner.$inject = [ '$rootScope' ];

    function spinner( $rootScope ) {
        return {
            restrict: 'E',
            template: '<div class="modal"><h2 class="loading-text">Loading your pricebook...</h2><span class="spinner"></span></div>',
            link: function( scope, element ) {
                $rootScope.spinner = element;
            }
        };
    }
}() );
