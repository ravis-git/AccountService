'use strict'

/**
 * Import dependencies
 */
const _ = require('lodash'),
    errors = require('restify-errors')

/**
 * Simple GET endpoint
 */
server.get('/hello', function(req, res, next) {
  res.send({
    url: 'hello',
    status: 'up',
    timestamp : new Date()
  })
})
