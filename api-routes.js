// Filename: api-routes.js
let config = require('./configs/config/config');
// Initialize express router
let router = require('express').Router();
  
router.get('/', function(req, res) {
    res.send(`Hello! The API is at ${config.host}${config.apiroot}`);
});

// Import holdshelf controller
var holdshelfController = require('./holdshelfController');

//GET hold shelf number
router.route('/:primaryid/:additional_id')
    .get(holdshelfController.index)

// Export API routes
module.exports = router;