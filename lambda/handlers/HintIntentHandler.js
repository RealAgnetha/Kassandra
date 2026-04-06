const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml } = require('../util');

const HintIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HintIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attrs = await attributesManager.getPersistentAttributes() || {};
    const sessionAttributes = attributesManager.getSessionAttributes();

    const currentPuzzle = attrs.currentPuzzle || 1;
    const hintsUsed = attrs.hintsUsed || 0;

    const puzzle = puzzles.find(p => p.number === currentPuzzle);

    if (!puzzle) {
      return handlerInput.responseBuilder
        .speak(marlene('Damit habe ich nicht gerechnet. Hier ist irgendwas ganz schief gelaufen. Frag bitte was anderes...'))
        .getResponse();
    }

    if (hintsUsed >= puzzle.hints.length) {
      sessionAttributes.afterHintsChoice = true;
      return handlerInput.responseBuilder
        .speak(marlene('Das waren alle Hinweise. Soll ich die Hinweise wiederholen oder möchtest du die Lösung?'))
        .reprompt(marlene('Soll ich die Hinweise wiederholen oder möchtest du die Lösung?'))
        .getResponse();
    }

    const hint = puzzle.hints[hintsUsed];

    // Kein Optional Chaining, damit es in deiner Runtime/Config sicher läuft
    let hintText = '';
    let hintAudio = '';

    if (typeof hint === 'string') {
      hintText = hint;
    } else if (hint && typeof hint === 'object') {
      hintText = hint.text || '';
      if (hint.audio) {
        hintAudio = ` <break time="200ms"/> <audio src="${hint.audio}"/>`;
      }
    }

    attrs.hintsUsed = hintsUsed + 1;
    attributesManager.setPersistentAttributes(attrs);
    await attributesManager.savePersistentAttributes();

    const speakOutput = marlene(`${attrs.hintsUsed}. Hinweis: ${escapeXml(hintText)}${hintAudio}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = HintIntentHandler;
