'use strict';

//import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');

export const handler = async event => {
  //const { REGION: region, BUCKET: bucket } = process.env;

  // if (!region || !bucket) {
  //   throw new Error('REGION and BUCKET environment variables are required!');
  // }

  // ERROR Example
  // return {
  //   statusCode: 400,
  //   body: JSON.stringify({
  //     message: 'Missing x-amz-meta-filekey in the header of the request.',
  //   }),
  // };


  try {
    const url = 'https://www.kcm.org';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(url),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

export default handler;