
( function() {
    'use strict';

    angular.module( 'appBrunoAir' )
        .directive( 'googleSignOut', googleSignOut );

    googleSignOut.$inject = [ '$rootScope', '$window' ,'$localstorage','$state'];

    function googleSignOut( $rootScope, $window,$localstorage,$state ) {
        return {
            scope: {
                buttonId: '@',
                options: '&'
            },
            template: '<md-button ng-click="signOut">Logout</md-button>',
            link: function( scope, element, attrs ) {
                $scope.signOut = function() {
                    var auth2 = gapi.auth2.getAuthInstance();
                    auth2.signOut().then(function () {
                        $localstorage.remove( 'gAuth' );
                        $state.go( 'login', {
                            reload: true
                        } );
                    });
                }
            }
        };
    }
}() );
