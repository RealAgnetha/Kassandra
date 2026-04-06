const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml, INTRO_TEXT } = require('../util');

const ResetIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'ResetIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StartOverIntent'
      );
  },

  async handle(handlerInput) {
    const { attributesManager, responseBuilder } = handlerInput;

    const attrs = await attributesManager.getPersistentAttributes() || {};
    attrs.currentPuzzle = 1;
    attrs.hintsUsed = 0;
    attrs.awaitingAnswer = false;
    attrs.introDeliveredForPuzzle = null;

    attributesManager.setPersistentAttributes(attrs);
    await attributesManager.savePersistentAttributes();

    const puzzle = puzzles.find(p => p.number === 1);

    const baseText = `Das Spiel wird neu gestartet. ${INTRO_TEXT}`;
    let speakOutput;

    if (puzzle && puzzle.introType === 'audio') {
      const sfx = puzzle.sfx ? `<audio src="${puzzle.sfx}"/> ` : '';
      speakOutput = marlene(`${baseText} ${sfx}<audio src="${puzzle.intro}"/>`);
    } else if (puzzle) {
      const sfx = puzzle.sfx ? `<audio src="${puzzle.sfx}"/> ` : '';
      speakOutput = marlene(`${baseText} ${sfx}${escapeXml(puzzle.intro)}`);
    } else {
      speakOutput = marlene(`${baseText} Hier ist etwas schief gelaufen.`);
    }

    return responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

module.exports = ResetIntentHandler;
