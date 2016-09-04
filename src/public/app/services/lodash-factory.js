(function() {
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
