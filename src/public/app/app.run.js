
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
