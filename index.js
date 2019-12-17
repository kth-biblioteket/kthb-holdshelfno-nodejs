let config = require('./configs/config/config');

let express = require('express')
var bodyParser = require("body-parser");
let app = express();

app.set('apikeyread', config.apikeyread);

let apiRoutes = require("./api-routes");
app.use(bodyParser.urlencoded({ 
    extended: true 
}));
app.use(bodyParser.json());

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

//Token
apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
          if(token != app.get('apikeyread')){
              return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else {
              next();
          }
    } else {
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
});
  
app.use(config.apiroot, apiRoutes);
  
//Server
var port = config.port || 3007;
var server = app.listen(port, function () {
    console.log("App now running on port", port);
});


