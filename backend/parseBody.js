/*******************************************************************************
* File: parseBody.js
* Summary: A function that the express server can use to parse the body of data
*          from a received request.  The data is stored in a property of the
*          request called "bodyString".
*
* ~ Holiness to the Lord ~
*******************************************************************************/



/*******************************************************************************
* Function: parseBody
*
* Description: This function parses the body of a POST request and stores it in
*              the "body" property of the request.
*
* @param req - The request from the caller.
* @param resp - The response object used to send data back to the caller.
* @param next - The next middleware function to call on a request.
*******************************************************************************/
function parseBody (req, resp, next)
{
   // If the method isn't POST then skip this function.
   if (req.method !== 'POST')
   {
      next();
      return;
   }
   // The request is a POST.  It must also be a JSON type.
   else if (!(req.headers['content-type'] === 'application/json' ||
         req.headers['content-type'] === 'application/json; charset=utf-8'))
   {
      resp.sendStatus(400);
      return;
   }

   // Holds the received data from the caller.
   let body = [];

   // Append each chunk of received data to the "body" array.
   req.on('data', chunk =>
   {
      body.push(chunk);
   })
   // Data transfer is complete.
   .on('end', () =>
   {
      // Convert the data from hexadecimal to a string.
      let bodyString = Buffer.concat(body).toString();

      // If the bodyString parsed below is not proper JSON then the JSON.parse
      // call will produce an error.  Wrapping the call in a try block allows
      // graceful handling of any malformed JSON request.
      try
      {
         // Creates the "body" property in the request object and assigns the
         // parsed JSON object to it.
         req.body = JSON.parse(bodyString);
      }
      catch (e)
      {
         console.log("ERROR in parseBody.js!  Bad bodyString: " + bodyString);
         resp.sendStatus(400); // Let the caller know the data was malformed.
         return;
      }

      // Allows chained middleware executions.
      next();
   });
}

// "module.exports" exports the assigned object whenever this file is imported.
module.exports = parseBody;