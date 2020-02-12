let config = require('./configs/config/config');
let router = require('express').Router();

router.get('/', function(req, res) {
    res.send(`Hello! The API is at ${config.host}${config.apiroot}`);
});

//Token
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
          if(token != config.apikeyread){
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

// Import holdshelf controller
var holdshelfController = require('./holdshelfController');

//GET hold shelf number
router.route('/:primaryid/:additional_id')
    .get(holdshelfController.index)
    
module.exports = router;