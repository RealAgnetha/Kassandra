const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml, INTRO_TEXT } = require('../util');

const ReadyIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadyIntent';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attrs = await attributesManager.getPersistentAttributes() || {};

    const currentPuzzle = attrs.currentPuzzle || 1;
    const hintsUsed = attrs.hintsUsed || 0;
    const puzzle = puzzles.find(p => p.number === currentPuzzle);

    const isFreshStart = (currentPuzzle === 1 && hintsUsed === 0);

    // Start-Intro nur beim allerersten Start
    const baseText = isFreshStart ? INTRO_TEXT : 'Hey, hast du die Lösung?';

    // Wenn Intro für dieses Rätsel schon ausgespielt wurde: NICHT nochmal wiederholen
    const introAlreadyDelivered =
      attrs.awaitingAnswer === true && attrs.introDeliveredForPuzzle === currentPuzzle;

    if (!puzzle) {
      return handlerInput.responseBuilder
        .speak(marlene('… oh. Fehler.'))
        .reprompt(marlene('Hast du schon eine Antwort?'))
        .getResponse();
    }

    if (introAlreadyDelivered) {
      // beim Resume immer nur die Frage, nie das Intro/Audio erneut
      const resumeText = 'Hey, hast du die Lösung?';
      return handlerInput.responseBuilder
        .speak(marlene(escapeXml(resumeText)))
        .reprompt(marlene('Was ist deine Antwort?'))
        .getResponse();
    }

    const sfx = puzzle.sfx ? `<audio src="${puzzle.sfx}"/> ` : '';
    let speakOutput;

    if (puzzle.introType === 'audio') {
      // Start-Intro (SSML) ggf. voranstellen, dann SFX, dann Audio
      speakOutput = marlene(`${isFreshStart ? baseText + ' ' : ''}${sfx}<audio src="${puzzle.intro}"/>`);
    } else {
      // Text-Rätsel: Start-Intro (SSML) ggf. voranstellen, sonst normale Frage
      speakOutput = marlene(
        `${isFreshStart ? baseText + ' ' : escapeXml(baseText) + ' '}${sfx}${escapeXml(puzzle.intro)}`
      );
    }

    // merken: Intro für aktuelles Rätsel wurde ausgespielt
    attrs.awaitingAnswer = true;
    attrs.introDeliveredForPuzzle = currentPuzzle;
    attributesManager.setPersistentAttributes(attrs);
    await attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(marlene('Hast du schon eine Antwort?'))
      .getResponse();
  }
};

module.exports = ReadyIntentHandler;
