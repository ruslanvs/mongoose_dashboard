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
var Owl = mongoose.model( "Owl", OwlSchema );

mongoose.Promise = global.Promise;

app.get( "/", function( req, res ){
    Owl.find( {}, function( err, owls ){
        if( err ){
            console.log( err );
            res.send( err );
        } else {
            res.render( "index", {owls: owls} );
        }
    })
});

app.get( "/owls/new", function( req, res ){
    res.render( "new" );
});

app.post( "/owls/create", function( req, res ){
    var owl = new Owl( {name: req.body.name, age: req.body.age} );
    owl.save( function( err ){
        if( err ){
            console.log( "error saving into the database" );
            res.send( err );
        } 
        else {
            console.log( "successfully saved into the database" );
            res.redirect( "/" );
        }
    })
});

app.get( "/owls/:id/edit", function( req, res ){
    Owl.find( {_id: req.params.id}, function( err, owl ){
        if( err ){
            console.log( err );
            res.send( err );
        } else {
            res.render( "edit", {data: owl} )
        }
    })
})

app.post( "/owls/:id/update", function( req, res ){
    Owl.find({_id: req.params.id }, function( err, owl ){
        if( err ){
            console.log( err );
            res.send( err );
        } else {
            let changes = false;
            let err2 = false;
            for( let i in req.body ){
                if( req.body[i] != owl[0][i] ){
                    changes = true;
                    Owl.update( {_id: req.params.id}, {[i]: req.body[i]}, function( err ){
                        if( err ){
                            err2 += err;
                            console.log( "ERROR:", err );
                            res.send( err );
                            return false;
                        }
                    })
                }
            }
            if( !changes && !err2 ){
                res.redirect( "/" );
            }
        }
    } )
})

app.get( "/owls/:id/destroy", function( req, res ){
    Owl.remove( {_id: req.params.id}, function( err ){
        if( err ){
            console.log( err );
            res.send( err );
        } else {
            res.redirect( "/" );
        }
    })
})

var server = app.listen( 8000, function() {
    console.log( "listening on port 8000" );
});