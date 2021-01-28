'use strict';

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: "2012-11-05"});
const documentClient = new AWS.DynamoDB.DocumentClient();
const sqsQueueUrl = process.env.SQS_QUEUE_URL;
const dynamoDbTable = process.env.DYNAMODB_TABLE;

AWS.config.update({region: "us-east-1"});

module.exports.communications = (event, context, callback) => {

  let communications = JSON.parse(event.body);

  let sqsPayload = {
    type: communications.type,
    system: communications.system,
    description: communications.description
  };

  let sqsParams = {
    MessageBody: JSON.stringify(sqsPayload),
    QueueUrl: sqsQueueUrl
  };

  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: { type: communications.type, system: communications.system, description: communications.description },
      input: event,
    }),
  };

  let dPayload = {
    TableName: dynamoDbTable,
    Item: communications
  };

  let insertDynamoDB = function (payload) {
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
