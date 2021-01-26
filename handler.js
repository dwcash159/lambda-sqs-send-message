'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});

const sqs = new AWS.SQS({apiVersion: "2012-11-05"});

// Create the document client interface for DynamoDB
var documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.helloWorld = (event, context, callback) => {

  var json = JSON.parse(event.body);

  var sqsParams = {
    MessageBody: JSON.stringify(json),
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/615027074482/aws-communications-queue'
  };

  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: json,
      input: event,
    }),
  };

  var dynamoDbPayload = {
    TableName: "communications-sqs-db",
    Item: json
  };



  const sqsdata = sqs.sendMessage(sqsParams, function(err, data) {
    var body = JSON.parse(response.body);
    if (err) {
      console.log('ERR', err);

      response.statusCode = 500;
      response.body = JSON.stringify(body);
      callback(null, response);
    }
    console.log(data);
    body.messageId = data.MessageId;
    response.body = JSON.stringify(body);
    dynamoDbPayload.Item.messageId = data.MessageId;

    documentClient.put(params, function(err, data) {
      if (err) {
        response.statusCode = 500;
        response.body = JSON.stringify(body);
        callback(null, response);
      } else {
        console.log("Succeeded adding communicatiion");
      }
    });

    callback(null, response);
  });
};
