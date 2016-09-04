( function() {
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
