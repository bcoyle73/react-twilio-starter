# react-twilio-starter
This application will serve as a getting started application for building a Twilio powered multi channel contact center using React and Redux on the front end and Twilio Functions for the backend.  The backend can be swapped out to use whichever server side technology or framework you choose.

## Setup

### Twilio Product Setup
* Create a TaskRouter Workspace - https://www.twilio.com/console/taskrouter/workspaces


### Twilio Functions Backend
* In your Twilio console go to Runtime->Functions->Config - https://www.twilio.com/console/runtime/functions/configure
* Under Credentials Enable  ACCOUNT_SID and AUTH_TOKEN
* Add the following environment variables
```sh
TWILIO_WORKSPACE_SID=[your workspace sid]
TWILIO_WORKFLOW_SID=[your default workflow sid]
```
* Under Dependencies add jsonwebtoken v8.1.0
* For each function in this repo: https://github.com/tonyv/twilio-functions create a new Twilio function on the manage page of functions: https://www.twilio.com/console/runtime/functions/manage.
* You can name the Twilio function whatever name you choose and the URL to whatever you choose.  The front end app will default to the file name of each of the functions in the repo but this is configurable
* Unless noted in the comments of the function you will not check the **Check for valid Twilio signature**
* You do not need to choose the **Event** for each function
* Click Save for each function and the function will deploy

### React Frontend
* Clone this front end repo
* run **npm install**
* All server side URLs are defined in single file to make it easy to configure custom urls for any Twilio functions you have copied or created yourself.  Configure your Function URLs in the /src/configureUrls.js file
  * Copy src/configureUrls_SAMPLE.js to configureUrls.js
  * Set base_url to your Twilio Runtime URL: https://www.twilio.com/console/runtime/overview
  * Set taskRouterToken to path you defined
  * Set clientToken to path you defined
  * Set conferenceTerminate to path you defined



4. Running locally go to http://localhost:8080/?worker=[YOUR WORKER SID]

## Components
Components are organized into Container components and functional presentation components.  Container components contain all of the Twilio specific code along with the actions and reducers.  The presentation componets are functional and only handle layout.  Any front end framework can be used with these components.  Funcitonal components that need a container handler are named the same with the Container component having the Container at the end of the name.
