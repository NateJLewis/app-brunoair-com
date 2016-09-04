
( function() {
    'use strict';

    angular.module( 'appBrunoAir' )
        .directive( 'googleSignIn', googleSignIn );

    googleSignIn.$inject = [ '$rootScope', '$window' ];

    function googleSignIn( $rootScope, $window ) {
        return {
            scope: {
                buttonId: '@',
                options: '&'
            },
            template: '<div></div>',
            link: function( scope, element, attrs ) {
                // console.log( element, attrs )
                var div = element.find( 'div' )[ 0 ];
                div.id = attrs.buttonId;
                var clientId = '789427171331-dmrtp2gtnlimkkhd7kqd4qiic1hserhv.apps.googleusercontent.com';
                var cookiePolicy = 'single_host_origin';
                var scopes = 'profile';
                var hostedDomain = 'brunoair.com';
                var auth2; // The Sign-In object.
                var googleUser; // The current user.
                function initAuth() {
                    gapi.auth2.init( {
                            client_id: clientId,
                            cookie_policy: cookiePolicy,
                            scope: scopes,
                            hosted_domain: hostedDomain
                        } )
                        .then( function( authInstance ) {
                            auth2 = gapi.auth2.getAuthInstance();
                            var isSignedIn = auth2.isSignedIn.get();
                            var currentUser = auth2.currentUser.get();
                            gapi.signin2.render( div.id, scope.options() );
                        } );
                }
                gapi.load( "auth2", initAuth );
            }
        };
    }
}() );
