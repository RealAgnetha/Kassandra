const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml } = require('../util');

const RepeatPuzzleIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatPuzzleIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attrs = await attributesManager.getPersistentAttributes() || {};

    const currentPuzzle = attrs.currentPuzzle || 1;
    const puzzle = puzzles.find(p => p.number === currentPuzzle);

    if (!puzzle) {
      return handlerInput.responseBuilder
        .speak(marlene('Da gibts grad nichts zu wiederholen.'))
        .reprompt(marlene('Was ist deine Antwort?'))
        .getResponse();
    }

    let speakOutput;

    if (puzzle.introType === 'audio') {
      const introText = puzzle.introText || 'Ich wurde unterbro...';
      speakOutput = marlene(`${escapeXml(introText)} <break time="0.5s"/> <audio src="${puzzle.intro}"/>`);
    } else {
      speakOutput = marlene(escapeXml(puzzle.intro || ''));
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

module.exports = RepeatPuzzleIntentHandler;
