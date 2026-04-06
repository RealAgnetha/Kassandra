const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene } = require('../util');

const NoIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.expectingHintConfirmation) {
      sessionAttributes.expectingHintConfirmation = false;

      const persistentAttrs = await attributesManager.getPersistentAttributes() || {};
      const currentPuzzle = persistentAttrs.currentPuzzle || 1;
      const puzzle = puzzles.find(p => p.number === currentPuzzle);

      const speakOutput = marlene('Okay, dann versuch es noch einmal.');

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(marlene('Was ist deine Antwort?'))
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(marlene('Okay.'))
      .getResponse();
  }
};

module.exports = NoIntentHandler;
