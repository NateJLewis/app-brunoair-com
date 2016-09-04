/**
    @name: app-brunoair-com 
    @version: 1.0.0 (03-09-2016) 
    @author: Nate Lewis 
    @url: https://app.brunoair.com 
    @license: Unlicense
*/
( function() {
	'use strict';

	angular
	.module( 'appBrunoAir', [
  		'ui.router',
  		'ngMaterial',
		'ngAnimate',
		'md.data.table',
		'angular.filter',
    ] );

} )();
;( function() {
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
;
( function() {
    'use strict';

    angular.module( 'appBrunoAir' )
        .run( function( $rootScope, $state, $location, PriceBookService, $localstorage, $templateRequest ) {
            $rootScope.stateIsLoading = false;
            if ( !$localstorage.get( 'gAuth' ) ) {
                $state.go( 'login', {
                    location: 'replace',
                    reload: true
                } );
            } else {
                if ( !$localstorage.get( 'rows' ) ) {
                    $rootScope.stateIsLoading = true;
                    // Promise for pricebook JSON
                    PriceBookService.loadPricebook()
                        .then(function() {
                            $rootScope.stateIsLoading = false;
                            $state.go( 'dimensions', {
                                location: 'replace',
                                reload: true
                            } );
                        });
                } else {
                    $state.go( 'dimensions', {
                        location: 'replace',
                        reload: true
                    } );
                }
            }
            var urls = [
                'icons/navigation/ic_menu_48px.svg',
                'icons/content/ic_filter_list_48px.svg',
                'images/bruno_vector.svg',
                'images/ah_d.svg'
            ];
            angular.forEach( urls, function( url ) {
                $templateRequest( url );
            } );


        } );
}() );
;
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
;
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
;( function() {
        'use strict';

        angular.module( 'appBrunoAir' )
            .factory( 'PriceBookService', PriceBookService );

        PriceBookService.$inject = [
	      '$http',
		  '$localstorage'
	  	];

        function PriceBookService( $http, $localstorage ) {
            return {
                getPricebook: function() {
                    return $http.get( 'https://sheetsu.com/apis/v1.0/6d846ba51b58' );
                },
                loadPricebook: function() {
                    if ( !$localstorage.get( 'rows' ) ) {
						return this.getPricebook()
	                        .then( function( response ) {
	                            var rows = [];
	                            angular.forEach( response.data, function( value, key ) {
	                                // console.log(value)
	                                rows.push( {
	                                    key: key,
	                                    air_handler: {
	                                        model: value.AH_GF_HP_MODEL,
	                                        height: value.INDOOR_UNIT_H,
	                                        width: value.INDOOR_UNIT_W,
	                                        depth: value.INDOOR_UNIT_D
	                                    },
	                                    condensing_unit: {
	                                        model: value.CU_PKG_MODEL,
	                                        height: value.CU_H,
	                                        width: value.CU_W,
	                                        depth: value.CU_D
	                                    },
	                                    specs: {
	                                        code: value.CODE,
	                                        brand: value.BRAND,
	                                        unit_type: value.UNIT_TYPE,
	                                        style: value.STYLE,
	                                        category: value.CATEGORY,
	                                        serie: value.SERIE,
	                                        ton: value.TON,
	                                        seer: value.SEER

	                                    },
	                                    costs: {
	                                        unit_cost: value.UNIT_COST,
	                                        total_cost: value.TOTAL_COST,
	                                        cost2200: value.c2200,
	                                        cost4200: value.c4200,
	                                        cost6400: value.c6400,
	                                        cost8600: value.c8600,
	                                        cost1080: value.c1080,
	                                        cost1280: value.c1280,
	                                        cost1410: value.c1410
	                                    }
	                                } );
	                            } );
	                            $localstorage.set( 'rows', JSON.stringify( rows ) );
	                        } )
                    }
                    return false;
                }
            }
        };
}() );
;(function() {
    'use strict';

    angular
        .module('appBrunoAir')
        .factory('_', LodashFactory);

    LodashFactory.$inject = ['$window'];

    function LodashFactory($window) {
        if (!$window._) {
            console.log('lodash is not available');
        }
        return $window._;
    }
}());
;( function() {
    'use strict';

    angular.module( 'appBrunoAir' )
        .factory( '$localstorage', $localstorage );

    $localstorage.$inject = [
      '$window'
    ];

    function $localstorage( $window ) {
        return {
            set: function( key, value ) {
                $window.localStorage[ key ] = value;
            },
            get: function( key, defaultValue ) {
                return $window.localStorage[ key ] || defaultValue;
            },
            setObject: function( key, value ) {
                $window.localStorage[ key ] = JSON.stringify( value );
            },
            getObject: function( key ) {
                if ( $window.localStorage[ key ] != undefined ) {
                    return JSON.parse( $window.localStorage[ key ] || false );
                }
                return false;
            },
            remove: function( key ) {
                $window.localStorage.removeItem( key );
            }
        };
    }
}() );
;( function() {
    'use strict';
    angular.module( 'appBrunoAir' )
        .controller( 'DimensionsController', DimensionsController );
    DimensionsController.$inject = [
		'$scope',
        '$q',
        '$filter',
		'$localstorage',
		'$element',
        '$state',
		'$timeout',
		'$mdSidenav',
        '_',
        'PriceBookService'
	];

    function DimensionsController( $scope, $q, $filter, $localstorage, $element, $state, $timeout, $mdSidenav, _, PriceBookService ) {
        var gAuth = $localstorage.getObject( 'gAuth' );
        var login = false;
        if ( gAuth ) {
            login = true;
        }
        // console.log(login);
        $scope.signOut = function() {
            $localstorage.remove( 'gAuth' );
            $localstorage.remove( 'rows' );
            $state.transitionTo( 'login', {
                reload: true
            } );
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut()
                .then( function() {
                    //console.log( 'signed out' )
                } );

        }
        $scope.rebuildPricebook = function() {
            $localstorage.remove( 'rows' );
            $rootScope.stateIsLoading = true;
            // Promise for pricebook JSON
            PriceBookService.loadPricebook()
                .then( function() {
                    $rootScope.stateIsLoading = false;
                } );
        }
        $scope.login = {
            url: 'views/login.html',
            isLoginPage: false
        }
        $scope.navbar = {
            url: 'views/navbar.html',
            route: 'dimensions',
            login: login,
        }
        $scope.profile = {
            email: gAuth.profile.email,
            name: gAuth.profile.name,
            image: gAuth.profile.image
        }
        $scope.sidebar = {
            url: 'views/sidebar.html'
        }
        var rows = $localstorage.getObject( 'rows' );
        $scope.rows = rows;
        $scope.results = [];
        $scope.resultLength = '';
        $scope.maxDimensions = {
            air_handler: {
                height: '',
                width: '',
                depth: '',
            },
            condensing_unit: {
                height: '',
                width: '',
                depth: '',
            }
        }
        $scope.findValue = function( maxDimensions ) {
            // console.log(maxDimensions)
            var checkRows = function check( params ) {
                // console.log(params);
                if ( params.input.air_handler.height !== "" )
                    if ( params.row.air_handler.height <= params.input.air_handler.height && params.row.air_handler.height !== "" )
                        return true;
                    else
                        return false;
                if ( params.input.air_handler.width !== "" )
                    if ( params.row.air_handler.width <= params.input.air_handler.width && params.row.air_handler.width !== "" )
                        return true;
                    else
                        return false;
                if ( params.input.air_handler.depth !== "" )
                    if ( params.row.air_handler.depth <= params.input.air_handler.depth && params.row.air_handler.depth !== "" )
                        return true;
                    else
                        return false;
                if ( params.input.condensing_unit.height !== "" )
                    if ( params.row.condensing_unit.height <= params.input.condensing_unit.height && params.row.condensing_unit.height !== "" )
                        return true;
                    else
                        return false;
                if ( params.input.condensing_unit.width !== "" )
                    if ( params.row.condensing_unit.width <= params.input.condensing_unit.width && params.row.condensing_unit.width !== "" )
                        return true;
                    else
                        return false;
                if ( params.input.condensing_unit.depth !== "" )
                    if ( params.row.condensing_unit.depth <= params.input.condensing_unit.depth && params.row.condensing_unit.depth !== "" )
                        return true;
                    else
                        return false;
            }
            angular.forEach( $scope.rows, function( key, value ) {
                var rowParams = {
                    air_handler: {
                        height: key.air_handler.height,
                        width: key.air_handler.width,
                        depth: key.air_handler.depth,
                    },
                    condensing_unit: {
                        height: key.condensing_unit.height,
                        width: key.condensing_unit.width,
                        depth: key.condensing_unit.depth,
                    }
                }
                var rowResults = checkRows( {
                    input: maxDimensions,
                    row: rowParams
                } );
                if ( rowResults )
                // console.log( key )
                    $scope.results.push( key );
            } );
            $scope.resultLength = $scope.results.length;
        }
        $scope.clearForm = function() {
            $scope.maxDimensions = {
                air_handler: {
                    height: '',
                    width: '',
                    depth: '',
                },
                condensing_unit: {
                    height: '',
                    width: '',
                    depth: '',
                }
            }
            $scope.results = [];
            $scope.resultLength = '';
        }
        $scope.clearAh = function() {
            $scope.maxDimensions = {
                air_handler: {
                    height: '',
                    width: '',
                    depth: '',
                }
            }
        }
        $scope.clearCu = function() {
            $scope.maxDimensions = {
                condensing_unit: {
                    height: '',
                    width: '',
                    depth: '',
                }
            }
        }
        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            limitSelect: true,
            pageSelect: true
        };
        $scope.selected = [];
        $scope.limitOptions = [ 10, 15, 20, {
            label: 'All',
            value: function() {
                return $scope.resultLength ? $scope.resultLength.count : 0;
            }
        } ];
        $scope.query = {
            order: 'key',
            limit: 10,
            page: 1
        };
        $scope.toggleLimitOptions = function() {
            $scope.limitOptions = $scope.limitOptions ? undefined : [ 10, 15, 20 ];
        };
        $scope.onPaginate = function( page, limit ) {
            // console.log( 'Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit );
            // console.log( 'Page: ' + page + ' Limit: ' + limit );
            $scope.promise = $timeout( function() {}, 2000 );
        };
        $scope.loadStuff = function() {
            $scope.promise = $timeout( function() {}, 2000 );
        };
        $scope.onReorder = function( order ) {
            // console.log( 'Scope Order: ' + $scope.query.order );
            // console.log( 'Order: ' + order );
            $scope.promise = $timeout( function() {}, 2000 );
        };
        
        $scope.toggleLeft = buildToggler( 'left' );
        $scope.toggleRight = buildToggler( 'right' );

        function buildToggler( componentId ) {
            return function() {
                $mdSidenav( componentId )
                    .toggle();
            };
        }
    }
} )();
;( function() {
    'use strict';
    angular.module( 'appBrunoAir' )
        .controller( 'SpecsController', SpecsController );
    SpecsController.$inject = [
        '$scope',
        '$q',
        '$filter',
		'$localstorage',
		'$element',
        '$state',
		'$timeout',
		'$mdSidenav',
        '_',
        'PriceBookService'
	];

    function SpecsController( $scope, $q, $filter, $localstorage, $element, $state, $timeout, $mdSidenav, _, PriceBookService ) {
        var gAuth = $localstorage.getObject( 'gAuth' );
        var login = false;
        if ( gAuth ) {
            login = true;
        }
        // console.log(login);
        $scope.signOut = function() {
            $localstorage.remove( 'gAuth' );
            $localstorage.remove( 'rows' );
            $state.transitionTo( 'login', {
                reload: true
            } );
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut()
                .then( function() {
                    //console.log( 'signed out' )
                } );

        }
        $scope.rebuildPricebook = function() {
            $localstorage.remove( 'rows' );
            $rootScope.stateIsLoading = true;
            // Promise for pricebook JSON
            PriceBookService.loadPricebook()
                .then( function() {
                    $rootScope.stateIsLoading = false;
                } );
        }
        $scope.login = {
            url: 'views/login.html',
            isLoginPage: false
        }
        $scope.navbar = {
            url: 'views/navbar.html',
            route: 'specs',
            login: login,
        }
        $scope.profile = {
            email: gAuth.profile.email,
            name: gAuth.profile.name,
            image: gAuth.profile.image
        }
        $scope.sidebar = {
            url: 'views/sidebar.html'
        }
        var rows = $localstorage.getObject( 'rows' );
        $scope.rows = rows;
        $scope.results = [];
        $scope.resultLength = '';

        $scope.findCodeName = function( codeName ) {
            var checkRows = function check( params ) {
                // console.log(params)
                if ( params.input !== "" )
                    if ( params.input == params.row )
                        return true;
                    else
                        return false;
            }
            angular.forEach( $scope.rows, function( key, value ) {
                var rowResults = checkRows( {
                    input: codeName,
                    row: key.specs.code
                } );
                if ( rowResults )
                    $scope.results.push( key );
            } );
            $scope.resultLength = $scope.results.length;
        }
        $scope.findBrandName = function( brandName ) {
            var checkRows = function check( params ) {
                // console.log(params)
                if ( params.input !== "" )
                    if ( params.input == params.row )
                        return true;
                    else
                        return false;
            }
            // console.log( brandName )
            angular.forEach( $scope.rows, function( key, value ) {
                var rowResults = checkRows( {
                    input: brandName,
                    row: key.specs.brand
                } );
                if ( rowResults )
                    $scope.results.push( key );
            } );
            $scope.resultLength = $scope.results.length;
        }
        $scope.findUnitType = function( unitType ) {
            var checkRows = function check( params ) {
                // console.log(params)
                if ( params.input !== "" )
                    if ( params.input == params.row )
                        return true;
                    else
                        return false;
            }
            angular.forEach( $scope.rows, function( key, value ) {
                var rowResults = checkRows( {
                    input: unitType,
                    row: key.specs.unit_type
                } );
                if ( rowResults )
                    $scope.results.push( key );
            } );
            $scope.resultLength = $scope.results.length;
        }
        $scope.clearForm = function() {
            $scope.results = [];
            $scope.resultLength = '';
            $scope.codeName = '';
            $scope.brandName = '';
            $scope.unitType = '';
        }
        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            limitSelect: true,
            pageSelect: true
        };
        $scope.selected = [];
        $scope.limitOptions = [ 10, 15, 20, {
            label: 'All',
            value: function() {
                return $scope.resultLength ? $scope.resultLength.count : 0;
            }
        } ];
        $scope.query = {
            order: 'key',
            limit: 10,
            page: 1
        };
        $scope.toggleLimitOptions = function() {
            $scope.limitOptions = $scope.limitOptions ? undefined : [ 10, 15, 20 ];
        };
        $scope.onPaginate = function( page, limit ) {
            $scope.promise = $timeout( function() {}, 2000 );
        };
        $scope.loadStuff = function() {
            $scope.promise = $timeout( function() {}, 2000 );
        };
        $scope.onReorder = function( order ) {
            $scope.promise = $timeout( function() {}, 2000 );
        };
        $scope.searchTerm;
        $scope.clearSearchTerm = function() {
            $scope.searchTerm = '';
        };
        $element.find( 'input' )
            .on( 'keydown', function( event ) {
                event.stopPropagation();
            } );
        $scope.toggleLeft = buildToggler( 'left' );
        $scope.toggleRight = buildToggler( 'right' );

        function buildToggler( componentId ) {
            return function() {
                $mdSidenav( componentId )
                    .toggle();
            };
        }
    }
} )();
