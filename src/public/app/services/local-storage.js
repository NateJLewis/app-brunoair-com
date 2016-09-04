( function() {
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
