const http = require('http');
const url = require('url');
const StringDecoder  = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const https = require('https');
const fs = require('fs');
const _data=require('./lib/data.js');

const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');





 http.createServer((req,res)=>{

   unifiedServer(req,res)
}).listen(config.httpPort,()=>{

   console.log(`The HTTP server is running on port ${config.httpPort}...`)
 })

const httpsServerOption={

  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}

 https.createServer((httpsServerOption,req,res)=>{

   unifiedServer(req,res)
 }).listen(config.httpsPort,()=>{

  console.log('The HTTP server is running on port '+config.httpsPort);
 })



const unifiedServer=((req,res)=>{


     // get url and parse it
     let parsedUrl=url.parse(req.url,true)

     // get the path
     let path=parsedUrl.pathname

     // get the trimmed path
     let trimmedPath=path.replace(/^\/+|\/+$/g,'')

     // get method
     let method=req.method.toLowerCase()

     // query string
     let queryString=parsedUrl.query

     // get payload if any
     let decoder=new StringDecoder('utf-8')


     let headers = req.headers;
     let buffer=''

     req.on('data',(data)=>{

        buffer+=decoder.write(data)


     })

  req.on('end',()=>{

  buffer+=decoder.end()
    // console.log(`Request was recieved with this payload: ...${buffer}`);

  let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    // Route the request to the handler specified in the router

    let data = {
      'trimmedPath' : trimmedPath,
      'queryString' : queryString,
      'method' : method,
      'headers' : headers,
      'payload' :  helpers.parseJsonToObject(buffer)
    };

    chosenHandler(data,function(statusCode,payload){

      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof(payload) == 'object'? payload : {};

      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type','application/json')
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response: ",statusCode,payloadString);

    });
  })

     // log the request path
     // console.log(req.headers);





     // write header
     // res.writeHead(200, {'Content-Type': 'text/html'});

     // send the reponse
       // res.end('Hello World!');





       // Define the request router
       const router = {
         // 'sample' : handlers.sample

          'ping' : handlers.ping,
           'users' : handlers.users,
           'tokens' : handlers.tokens,
           'checks' : handlers.checks

       };








})
