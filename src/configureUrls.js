let baseUrl = 'https://absurd-pizzas-9864.twil.io/'

module.exports = {
  baseUrl: baseUrl,
  taskRouterToken: baseUrl + 'taskrouter-client-token',
  clientToken: baseUrl + 'twilio-client-token',
  conferenceTerminate: baseUrl + 'terminate-conference',
  conferenceEvents: baseUrl + 'conference-event',
  callHold: baseUrl + 'hold-call',
  callOutbound: baseUrl + 'outbound',
  callOutboundCallback: baseUrl + 'outbound-call-callback',
}
