( function() {
    'use strict';
    angular
        .module( 'appBrunoAir' )
        .config( appConfig );

    appConfig
        .$inject = [
    		'$stateProvider',
    	 	'$urlRouterProvider',
    	 	'$mdThemingProvider',
    	 	'$mdIconProvider'
    	];

    function appConfig( $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider ) {
        $mdThemingProvider
            .theme( 'default' )
            .primaryPalette( 'blue', {
                'default': '900',
                'hue-1': '200',
                'hue-2': '600',
                'hue-3': 'A100'
            } )
            .accentPalette( 'red', {
                'default': '900'
            } );

        $mdIconProvider
            .icon( 'menu', 'icons/navigation/ic_menu_48px.svg', 48 )
            .icon( 'filter', 'icons/content/ic_filter_list_48px.svg', 48 )
            .icon( 'logo', 'images/bruno_vector.svg', 48 )
            .icon( 'ahd', 'images/ah_d.svg' );

        $stateProvider
            .state( 'login', {
                url: '/',
                templateUrl: 'views/login.html',
                controller: function( $scope, $rootScope, $localstorage, PriceBookService, $state ) {
                    $scope.login = {
                        isLoginPage: true
                    }
                    $scope.options = {
                        scope: 'email',
                        width: 200,
                        height: 50,
                        theme: 'dark',
                        onsuccess: function( response ) {
                            $rootScope.stateIsLoading = true;
                            var authResponse = response.getAuthResponse();
                            var usersProfile = response.getBasicProfile();
                            var authStore = {
                                auth: {
                                    access_token: authResponse.access_token,
                                    expires_at: authResponse.expires_at,
                                    expires_in: authResponse.expires_in,
                                    first_issued_at: authResponse.first_issued_at,
                                    id_token: authResponse.id_token,
                                    idpId: authResponse.idpId,
                                    login_hint: authResponse.login_hint,
                                    scope: authResponse.scope
                                },
                                profile: {
                                    id: usersProfile.Eea,
                                    name: usersProfile.ig,
                                    email: usersProfile.U3,
                                    image: usersProfile.Paa
                                }
                            }
                            $localstorage.set( 'gAuth', JSON.stringify( authStore ) );
                            if ( !$localstorage.get( 'rows' ) ) {
                                // Promise for pricebook JSON
                                PriceBookService.loadPricebook()
                                    .then( function() {
                                        $rootScope.stateIsLoading = false;
                                        $state.go( 'dimensions', {
                                            location: 'replace',
                                            reload: true
                                        } );
                                    } );
                            } else {
                                $state.go( 'dimensions', {
                                    location: 'replace',
                                    reload: true
                                } );
                            }
                        },
                        onfailure: function( error ) {
                            $localstorage.remove( 'gAuth' );
                            $localstorage.remove( 'rows' );
                            $state.go( 'login', {
                                reload: true
                            } );
                        }
                    }
                }
            } )
            .state( 'dimensions', {
                url: '/dimensions',
                resolve: {
                    authenticate: doAuthentication
                },
                controller: 'DimensionsController',
                templateUrl: 'views/dimensions.html'
            } )
            .state( 'specs', {
                url: '/specs',
                resolve: {
                    authenticate: doAuthentication
                },
                controller: 'SpecsController',
                templateUrl: 'views/specs.html'
            } );
        function doAuthentication( $q, $state, $timeout, $localstorage ) {
            if ( $localstorage.get( 'gAuth' ) ) {
                // Resolve the promise successfully
                return $q.when()
            } else {
                $timeout( function() {
                    // This code runs after the authentication promise has been rejected.
                    $state.go( 'login', {
                        reload: true
                    } );
                } );
                // Reject the authentication promise to prevent the state from loading
                return $q.reject()
            }
        }
        $urlRouterProvider.when( '', '/' );
    }
} )();
