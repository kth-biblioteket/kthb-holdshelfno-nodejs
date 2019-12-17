let config = require('./configs/config/config');

let express = require('express')
var bodyParser = require("body-parser");
var sqlinjection = require('sql-injection');

let app = express();

let apiRoutes = require("./api-routes");
app.use(bodyParser.urlencoded({ 
    extended: true 
}));
app.use(bodyParser.json());

app.use(sqlinjection);

//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

/*
//begränsa på ipnummer
const ipfilter = require('express-ipfilter').IpFilter
const ips = ['::ffff:127.0.0.1','::ffff:130.237.38.97']
app.use(ipfilter(ips, { mode: 'allow' }))
*/
  
app.use(config.apiroot, apiRoutes);
  
//Server
var port = config.port || 3007;
var server = app.listen(port, function () {
    console.log("App now running on port", port);
});


