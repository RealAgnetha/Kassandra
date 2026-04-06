const Alexa = require('ask-sdk-core');
const HintIntentHandler = require('./HintIntentHandler');
const { marlene } = require('../util');

const YesIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.expectingHintConfirmation) {
      sessionAttributes.expectingHintConfirmation = false;
      return HintIntentHandler.handle(handlerInput);
    }

    return handlerInput.responseBuilder
      .speak(marlene('Okay.'))
      .getResponse();
  }
};

module.exports = YesIntentHandler;
