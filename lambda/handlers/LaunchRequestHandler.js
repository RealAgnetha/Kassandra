const Alexa = require('ask-sdk-core');
const puzzles = require('../data/puzzles');
const { marlene, escapeXml, INTRO_TEXT } = require('../util');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },

  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attrs = await attributesManager.getPersistentAttributes() || {};

    const currentPuzzle = attrs.currentPuzzle || 1;
    const hintsUsed = attrs.hintsUsed || 0;
    const puzzle = puzzles.find(p => p.number === currentPuzzle);

    // Wenn Intro für dieses Rätsel schon ausgespielt wurde: NICHT nochmal wiederholen
    const introAlreadyDelivered =
      attrs.awaitingAnswer === true && attrs.introDeliveredForPuzzle === currentPuzzle;

    if (!puzzle) {
      const speakOutput = marlene('… oh. Fehler.');
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(marlene('Hast du schon eine Antwort?'))
        .getResponse();
    }

    if (introAlreadyDelivered) {
      const speakOutput = marlene(escapeXml('Hey, hast du die Lösung?'));
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(marlene('Was ist deine Antwort?'))
        .getResponse();
    }

    const isIntroStart = (currentPuzzle === 1 && hintsUsed === 0);
    const sfx = puzzle.sfx ? `<audio src="${puzzle.sfx}"/> ` : '';

    let speakOutput;

    if (puzzle.introType === 'audio') {
      speakOutput = marlene(`${sfx}<audio src="${puzzle.intro}"/>`);
    } else {
      const header = isIntroStart ? INTRO_TEXT : escapeXml('Hey, hast du die Lösung?');
      speakOutput = marlene(`${header} ${sfx}${escapeXml(puzzle.intro || '')}`);
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

module.exports = LaunchRequestHandler;
