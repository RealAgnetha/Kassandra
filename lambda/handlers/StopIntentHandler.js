const Alexa = require('ask-sdk-core');
const { marlene } = require('../util');

const StopIntentHandler = {
  canHandle(handlerInput) {
    if (Alexa.getRequestType(handlerInput.requestEnvelope) !== 'IntentRequest') return false;
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent';
  },

  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(marlene('Okay.'))
      .withShouldEndSession(true)
      .getResponse();
  }
};

module.exports = StopIntentHandler;
