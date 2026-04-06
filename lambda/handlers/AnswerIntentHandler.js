// lambda/handlers/AnswerIntentHandler.js
const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml, OUTRO_TEXT } = require('../util');

function normalizeAnswer(raw) {
  return (raw || '').toLowerCase().replace(/[^a-z0-9äöüß]/g, '');
}

const AnswerIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attrs = await attributesManager.getPersistentAttributes() || {};

    const currentPuzzle = attrs.currentPuzzle || 1;

    const userAnswerRaw = Alexa.getSlotValue(handlerInput.requestEnvelope, 'answer') || '';
    const userAnswer = normalizeAnswer(userAnswerRaw);

    const puzzle = puzzles.find(p => p.number === currentPuzzle);

    let speakOutput;

    if (puzzle && userAnswer === normalizeAnswer(puzzle.solution)) {
      attrs.currentPuzzle = currentPuzzle + 1;
      attrs.hintsUsed = 0;

      const nextPuzzle = puzzles.find(p => p.number === attrs.currentPuzzle);

      if (nextPuzzle) {
        const sfx = nextPuzzle.sfx ? `<audio src="${nextPuzzle.sfx}"/> ` : '';

        if (nextPuzzle.introType === 'audio') {
          speakOutput = marlene(`${sfx}<audio src="${nextPuzzle.intro}"/>`);
        } else {
          speakOutput = marlene(`${sfx}${escapeXml(nextPuzzle.intro)}`);
        }

        // Intro für das neue aktuelle Rätsel wurde JETZT ausgespielt -> beim Resume nicht wiederholen
        attrs.awaitingAnswer = true;
        attrs.introDeliveredForPuzzle = attrs.currentPuzzle;

        attributesManager.setPersistentAttributes(attrs);
        await attributesManager.savePersistentAttributes();

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      // === FINAL: OUTRO sprechen, Skill schließen, Fortschritt zurücksetzen ===
      speakOutput = OUTRO_TEXT;

      attrs.currentPuzzle = 1;
      attrs.hintsUsed = 0;
      attrs.awaitingAnswer = false;
      attrs.introDeliveredForPuzzle = null;

      attributesManager.setPersistentAttributes(attrs);
      await attributesManager.savePersistentAttributes();

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(true)
        .getResponse();
    }

    // === FALSCH: offen lassen + reprompt setzen ===
    const heard = escapeXml(userAnswerRaw || '…');
    speakOutput = marlene(`${heard}? Das ist leider falsch. Versuch es nochmal.`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(marlene(`${heard}? Das ist leider falsch. Versuch es nochmal.`))
      .getResponse();
  }
};

module.exports = AnswerIntentHandler;
