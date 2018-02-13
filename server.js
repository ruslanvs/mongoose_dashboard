var express = require( "express" );
var app = express();

var bodyParser = require( "body-parser" );
var path = require( "path" );
var mongoose = require( 'mongoose' );

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( express.static( path.join( __dirname, "./static") ) );

app.set( 'views', path.join( __dirname, './views' ) );
app.set( 'view engine', 'ejs' );

mongoose.connect( "mongodb://localhost/mongoose_dashboard" );

var OwlSchema = new mongoose.Schema( {
    name: String,
    age: Number
}, {timestamps: true} )
// mongoose.model( "Owl", OwlSchema );
// var Owl = mongoose.model( "Owl" );
var Owl = mongoose.model( "Owl", OwlSchema );

mongoose.Promise = global.Promise;

app.get( "/", function( req, res ){
    res.render( "index" );
});







// app.get( '/', function( req, res ) {
//     res.render( "index" );
// });

// app.post( '/owls/new', function( req, res ){
//     console.log( 'post data:', req.body );
//     var owl = new Owl( {name: req.body.name, age: req.body.quote} );
//     owl.save( function( err ){
//         if( err ){
//             console.log( "something went wrong" );
//         } else {
//             console.log( "successfully added a quote" );
//         }
//     })
//     res.redirect( "/quotes" );
// })

// app.get( '/owls/:id', function( req, res ){
//     Owl.find( {}, function( err, quotes ){
//         console.log( quotes );
//         res.render( "quotes", {quotes: quotes} );
//     })
// })

var server = app.listen( 8000, function() {
    console.log( "listening on port 8000" );
});