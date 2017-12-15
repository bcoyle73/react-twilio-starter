let baseUrl = 'https://YOUR DOMAIN/'

module.exports = {
  baseUrl: baseUrl,
  taskRouterToken: baseUrl + 'taskrouter-client-token',
  clientToken: baseUrl + 'twilio-client-token',
  conferenceTerminate: baseUrl + 'terminate-conference',
  callHold: baseUrl + 'hold-call',
  callOutbound: baseUrl + 'outbound',
  callOutboundCallback: baseUrl + 'outbound-call-callback',
}
