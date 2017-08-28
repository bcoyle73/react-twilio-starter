# react-twilio-starter
This application will serve as a getting started application for building a Twilio powered multi channel contact center using React and Redux on the front end and Node.js on the backend.  The backend can be swapped out to use whichever server side technology or framework you choose.

## Setup
1. Clone the repo
2. Create a .env file with your environment variables
```sh
    export TWILIO_ACCOUNT_SID=
    export TWILIO_AUTH_TOKEN=
    export TWILIO_TWIML_APP_SID=
    export TWILIO_WORKSPACE_SID=
    export TWILIO_WORKFLOW_SID=
    export TWILIO_CHAT_SERVICE_SID=
    export TWILIO_API_KEY=
    export TWILIO_API_SECRET=
    export TWILIO_SYNC_SERVICE_SID=
    export TWILIO_SYNC_KEY=
    export TWILIO_SYNC_SECRET=
    export BASE_URL=
```
3. Run
```sh
source .env
npm install
npm start
npm run dev-server //in diff terminal
```
4. Running locally go to http://localhost:8080/?worker=[YOUR WORKER SID]

## Components
Components are organized into Container components and functional presentation components.  Container components contain all of the Twilio specific code along with the actions and reducers.  The presentation componets are functional and only handle layout.  Any front end framework can be used with these components.  Funcitonal components that need a container handler are named the same with the Container component having the Container at the end of the name.
