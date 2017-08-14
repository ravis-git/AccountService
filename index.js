' use strict '

/**
 * Import dependencies
 */
 const config = require('./config'),
       restify = require('restify'),
       bunyan = require('bunyan'),
       winston = require('winston'),
       bunyanWinston = require('bunyan-winston-adapter'),
       restifyBodyParser = require('restify').plugins.bodyParser,
       consul = require('consul')({
         host: 'storeinfrastructure_consul_1',
        //  host: 'localhost',
         port: 8500
       })

/**
 * Application logging using winston
 */
 global.log = new winston.Logger({
   transports: [
     new winston.transports.Console({
       level: 'info',
       timestamp: () => {
         return new Date().toString()
       },
       json: true
     })
   ]
 })

/**
 * Initialize the server
 */
global.server = restify.createServer({
  name: config.name,
  version: config.version,
  log: bunyanWinston.createAdapter(log)
})


/**
 * setup the  middleware aparatus
 */
server.use(restifyBodyParser({ mapParams: true }))
// server.use(restify.acceptParser(server.acceptable))
// server.use(restify.queryParser({ mapParams: true }))
// server.use(restify.fullResponse())

/**
 * Error handling
 */
server.on('uncaughtException', (req, res, route, err) => {
  log.error(err.stack)
  res.send(err)
})

/**
 * Start server and bind routes
 */
server.listen(config.port, function(){
  log.info(
      '%s v%s ready to accept connections on port %s in %s environment.',
      server.name,
      config.version,
      config.port,
      config.env
  )
  require('./routes')
})

/**
 * Once loaded, register with consul
 */
const srvc = {
    name: "account-service",
    id: 'account-service',
    ttl: '1-s',
    port: 3000
  }

 consul.agent.service.register(srvc, function(err) {
   if (err) throw err;
 });
