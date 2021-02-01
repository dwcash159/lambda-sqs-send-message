'use strict';

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: "2012-11-05"});
const documentClient = new AWS.DynamoDB.DocumentClient();

const sqsQueueUrl = process.env.SQS_QUEUE_URL;
const dynamoDbTable = process.env.DYNAMODB_TABLE;


module.exports.communications = async (event) => {

  let communications = JSON.parse(event.body);

  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: { type: communications.type, system: communications.system, description: communications.description }
    }),
  };

  let dPayload = {
    TableName: dynamoDbTable,
    Item: communications,
    ReturnValues: 'ALL_OLD'
  };

  let sqsPayload = {
    type: communications.type,
    system: communications.system,
    description: communications.description
  };

  let sqsParams = {
    MessageBody: JSON.stringify(sqsPayload),
    QueueUrl: sqsQueueUrl
  };

  let sqsResponse = await sqs.sendMessage(sqsParams).promise();
  dPayload.Item.messageId = sqsResponse.MessageId;

  await documentClient.put(dPayload).promise().then().catch(error => response.statusCode = 599);
  // documentClient.put(dPayload, function(err, data) {
  //   if (err) {
  //     response.statusCode = 500;
  //   }
  //   console.log(data);
  // });

  let body = JSON.parse(response.body);
  body.message.messageId = sqsResponse.MessageId;
  response.body = JSON.stringify(body);

  return response;
};