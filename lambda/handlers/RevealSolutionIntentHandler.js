const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml } = require('../util');

const RevealSolutionIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RevealSolutionIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    const attrs = await attributesManager.getPersistentAttributes() || {};

    const currentPuzzle = attrs.currentPuzzle || 1;
    const puzzle = puzzles.find(p => p.number === currentPuzzle);

    if (!puzzle) {
      return handlerInput.responseBuilder
        .speak(marlene('Ich konnte das aktuelle Rätsel nicht finden.'))
        .getResponse();
    }

    const allHintsUsed = (attrs.hintsUsed || 0) >= puzzle.hints.length;
    const isLastPuzzle = currentPuzzle === puzzles.length;

    if (isLastPuzzle) {
      sessionAttributes.afterHintsChoice = false;

      return handlerInput.responseBuilder
        .speak(marlene('Nein. Dieses Mal nicht. Du hast alle Hinweise. Jetzt musst du die Masterphrase selbst zusammensetzen.'))
        .reprompt(marlene('Wie lautet die Masterphrase?'))
        .getResponse();
    }

    if (!allHintsUsed || !sessionAttributes.afterHintsChoice) {
      return handlerInput.responseBuilder
        .speak(marlene('Tut mir leid, ich kann dir die Lösung nicht einfach so sagen.'))
        .reprompt(marlene('Möchtest du einen weiteren Hinweis?'))
        .getResponse();
    }

    sessionAttributes.afterHintsChoice = false;

    attrs.currentPuzzle = currentPuzzle + 1;
    attrs.hintsUsed = 0;
    attributesManager.setPersistentAttributes(attrs);
    await attributesManager.savePersistentAttributes();

    const nextPuzzle = puzzles.find(p => p.number === attrs.currentPuzzle);

    let inner = `Die Lösung lautet: ${escapeXml(puzzle.solution)}. `;

    if (nextPuzzle) {
      if (nextPuzzle.introType === 'audio') {
        inner += `Ich nenne dir jetzt das nächste Rätsel. <audio src="${nextPuzzle.intro}"/>`;
      } else {
        inner += escapeXml(nextPuzzle.intro);
      }
    } else {
      inner += 'Du hast damit alle Rätsel beendet.';
    }

    return handlerInput.responseBuilder
      .speak(marlene(inner))
      .reprompt(marlene('Was ist deine Antwort?'))
      .getResponse();
  },
};

module.exports = RevealSolutionIntentHandler;
