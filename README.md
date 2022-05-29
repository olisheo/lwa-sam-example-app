# lwa-sam-example-app

## What is this?
This project illustrates how to use LWA (Login with Amazon) JavaScript SDK for Authorization code grant. The main purpose of the project is for learning/testing purpose.


## Structure of the project
This project contains two parts, web pages on Amazon S3 and a Node.js app with API hosted as an AWS Lambda funciton). To make this app work, you need both.<br>
Node.js app is managed and to be deployed by Serverless Application Model. When you complete deployment, you'll get information you need for Web pages.

---
## Node.js application as server implementation
__Project sub-folder:__ `/src`<br>
__Requirement:__
* SAM (Serverless Application Framework
* Amazon Developer Account (https://developer.amazon.com)
  * Lowgin with Amazon security profile for this app.
    * Client ID and Client Secret fro the security profile.
    * "Allowed Origins" and "Allowed Return URLs" for Security profile must be configureed

__How to use:__

In the project root where you have `packate.json`, run the following commands in the shell.
```bash
sam build
sam deploy --guided # You should save 'samconfig.toml' file to store parameters.
```
---
## Web pages (HTML/JavaScript) to be hosted on Amazon S3.<br>
__Project sub-folder:__ `/web-on-s3`<br>
__Requirement:__
* aws-cli on your machine.<br>

__How to use:__
Create S3 bucket that you can make the content in public.<br>
Create `endpoint-config.js` file to store LWA security profile information and API information of Node.js app. This file is to be used by Node.js app (after it is deployed).<br>

```json
ENDPOINT_CONFIG = {
    appTokenApiEndpoint: "<API endpoint for the node.js>",
    appTokenApiPath: "<path for API (if you don't change node.js app configuration, it is '/yourOAuthServiceEndpoint')>",
    lwaClientId: "<your Client ID for the LWA security profile>",
    redirectUrl: "<your Client secret for the LWA security profile>",
};
```

The helper script `upload.sh` in sub-project directory.<br>
This helper script uploads html files and a JavaScript file to a S3 bucket that you have. This script reads `.upload.config` to get S3 bucket name and AWS CLI profile name to use for uploading.

```json
AWS_PROFILE=<AWS CLI Profile name>
S3BUCKET=<S3 Bucket name>
```

After you save `.upload.config` with proper information, you can run the following command. (you need to have AWS CLI installed)
```bash
./upload.sh
```
