( function() {
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
