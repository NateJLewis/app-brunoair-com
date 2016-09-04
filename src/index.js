/**
 * The contents of this file is free and unencumbered software released into the
 * public domain. For more information, please refer to <http://unlicense.org/>
 *
 * @author Nate Lewis <nlewis@brunoair.com>
 */

'use strict'

let express = require( 'express' );
let server = express();
let bodyParser = require( 'body-parser' );

server.use( bodyParser.urlencoded( {
    extended: true
} ) )
server.use( bodyParser.json() )

server.use( '/', express.static( `${__dirname}/./public` ) );

let listener = server.listen( process.env.PORT || 8080, function() {
    console.log( `${listener.address().port} did start server on port` )
} );
