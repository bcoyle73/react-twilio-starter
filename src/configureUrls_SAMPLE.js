let baseUrl = 'https://YOUR DOMAIN/'

module.exports = {
  baseUrl: baseUrl,
  taskRouterToken: baseUrl + 'taskrouter-client-token',
  taskRouterEvents: baseUrl + 'taskrouter-event',
  syncToken: baseUrl + 'sync-token',
  syncMap: baseUrl + 'initialize-sync-map',
  clientToken: baseUrl + 'twilio-client-token',
  conferenceTerminate: baseUrl + 'terminate-conference',
  internalTransfer: baseUrl + 'internal-transfer',
  conferenceEvents: baseUrl + 'conference-event',
  callHold: baseUrl + 'hold-call',
  callOutbound: baseUrl + 'outbound',
  callOutboundCallback: baseUrl + 'outbound-call-callback',
  internalTransferCallback: baseUrl + 'internal-transfer-callback'
}
