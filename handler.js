'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});

const sqs = new AWS.SQS({apiVersion: "2012-11-05"});

// Create the document client interface for DynamoDB
var documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.communications = (event, context, callback) => {

  var communications = JSON.parse(event.body);

  var sqsPayload = {
    type: communications.type,
    system: communications.system,
    description: communications.description
  };

  var sqsParams = {
    MessageBody: JSON.stringify(sqsPayload),
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/615027074482/aws-communications-queue'
  };

  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: { type: communications.type, system: communications.system, description: communications.description },
      input: event,
    }),
  };

  var dPayload = {
    TableName: "communications-sqs-db",
    Item: communications
  };

  var insertDynamoDB = function (payload) {
    documentClient.put(payload, function(err, data) {
      if (err) {
        response.statusCode = 500;
        console.log('ERR', err);
        callback(null, response);
      } else {
        console.log("Succeeded adding communication");
        callback(null, response);
      }
    });
  };

  const sqsData = sqs.sendMessage(sqsParams, function(err, data) {

    if (err) {
      console.log('ERR', err);
      response.statusCode = 500;
      callback(null, response);
    }

    dPayload.Item.messageId = data.MessageId;
    insertDynamoDB(dPayload);
  });
};
