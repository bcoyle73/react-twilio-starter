// Twilio config stored in environment variables
var config = {};

config.accountSid = process.env.TWILIO_ACCOUNT_SID;
config.authToken = process.env.TWILIO_AUTH_TOKEN;
config.twimlApp = process.env.TWILIO_TWIML_APP_SID;
config.workspaceSid = process.env.TWILIO_WORKSPACE_SID;
config.workflowSid = process.env.TWILIO_WORKFLOW_SID;
config.chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID;
config.keySid = process.env.TWILIO_API_KEY;
config.keySecret = process.env.TWILIO_API_SECRET;
config.syncServiceSid = process.env.TWILIO_SYNC_SERVICE_SID;
config.syncKey = process.env.TWILIO_SYNC_KEY;
config.syncSecret = process.env.TWILIO_SYNC_SECRET;

module.exports = config;
