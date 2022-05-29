const axios = require("axios");
// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const LwaTokenEndpoint = "https://api.amazon.co.jp/auth/o2/token";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
};

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        response = {
            statusCode: 405,
            header: corsHeaders,
            body: "Method not allowed."
        }
        throw new Error(`endpoint accepts GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    let response;
    try {
        const resFromLwaTokenendpoint = await axios({
            method: "post",
            url: LwaTokenEndpoint,
            data: {
                grant_type: "authorization_code",
                client_id: process.env.LWA_CLIENT_ID,
                client_secret: process.env.LWA_CLIENT_SECRET,
                code: event.queryStringParameters.code,
            },
            headers: {
                ...corsHeaders,
            }
        });
        console.log(`received from LWA token endpoint:\n${JSON.stringify(resFromLwaTokenendpoint.data)}`);
        const { access_token, refresh_token } = resFromLwaTokenendpoint.data;
        response = {
            statusCode: 200,
            headers: corsHeaders,
            body: access_token,
        };
    } catch (e) {
        console.log(`Error when processing request for access token:${e}`);
        response = {
            statusCode: 500,
            headers: corsHeaders,
            body: "Internal Server Error",
        }
    }
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
