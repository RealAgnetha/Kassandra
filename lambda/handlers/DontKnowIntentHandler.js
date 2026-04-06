const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene } = require('../util');

const DontKnowIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DontKnowIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    // Flag setzen: warten auf Ja/Nein für Hinweis
    sessionAttributes.expectingHintConfirmation = true;

    const persistentAttrs = await attributesManager.getPersistentAttributes() || {};
    const currentPuzzle = persistentAttrs.currentPuzzle || 1;
    const puzzle = puzzles.find(p => p.number === currentPuzzle); // kann bleiben, auch wenn du es gerade nicht nutzt

    const speakOutput = marlene(`<say-as interpret-as="interjection">ach</say-as> <break time="500ms"/> Brauchst du vielleicht einen Hinweis?`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(marlene('Möchtest du einen Hinweis?'))
      .getResponse();
  }
};

module.exports = DontKnowIntentHandler;
