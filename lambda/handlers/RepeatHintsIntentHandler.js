const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml } = require('../util');

const RepeatHintsIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatHintsIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    const attrs = await attributesManager.getPersistentAttributes() || {};

    const currentPuzzle = attrs.currentPuzzle || 1;
    const puzzle = puzzles.find(p => p.number === currentPuzzle);

    if (!puzzle) {
      return handlerInput.responseBuilder
        .speak(marlene('Du hast einen fatalen Fehler gefunden. Frag was anderes.'))
        .getResponse();
    }

    // Wenn wir aus der "Hinweise oder Lösung?"-Frage kommen, das Flag zurücksetzen
    if (sessionAttributes.afterHintsChoice) {
      sessionAttributes.afterHintsChoice = false;
    }

    const hintsUsed = attrs.hintsUsed || 0;

    // Noch keine Hinweise gehört
    if (hintsUsed === 0) {
      return handlerInput.responseBuilder
        .speak(marlene('Bisher hast du noch keinen Hinweis zu diesem Rätsel bekommen.'))
        .reprompt(marlene('Möchtest du einen Hinweis?'))
        .getResponse();
    }

    // Alle bisher gehörten Hinweise wiederholen
    const hintsToRepeat = puzzle.hints.slice(0, Math.min(hintsUsed, puzzle.hints.length));

    const hintsText = hintsToRepeat
      .map((hint, index) => `${index + 1}. Hinweis: ${escapeXml(hint)}`)
      .join(' ');

    const speakOutput = marlene(`Hier nochmal die bisherigen Hinweise: ${hintsText}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

module.exports = RepeatHintsIntentHandler;
