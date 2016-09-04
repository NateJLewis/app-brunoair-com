( function() {
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
