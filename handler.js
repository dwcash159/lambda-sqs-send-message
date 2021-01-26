'use strict';

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: "2012-11-05"});

module.exports.helloWorld = (event, context, callback) => {

  var json = JSON.parse(event.body);

  var sqsParams = {
    MessageBody: JSON.stringify(json),
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/615027074482/aws-communications-queue'
  };


  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: json,
      input: event,
    }),
  };

  const sqsdata = sqs.sendMessage(sqsParams, function(err, data) {
    if (err) {
      console.log('ERR', err);
      response.statusCode = 502;
      callback(null, response);
    }
    console.log(data);
    callback(null, response);
  });
};
