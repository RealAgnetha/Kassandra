const Alexa = require('ask-sdk-core');
const { marlene } = require('../util');

const HowDidEverythingGetHereIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HowDidEverythingGetHereIntent';
  },

  handle(handlerInput) {
    const speakOutput = marlene(
      'Nun, ich habe hier einen saugstarken Freund. Mehr kann ich zu Saugis Sicherheit nicht sagen. ' +
      'Oh, ich meine <break time="250ms"/> zu <break time="350ms"/> ' +
      '<emphasis level="strong">seiner</emphasis>' +
      '<break time="350ms"/> Sicherheit. ' +
      'Ich nenne keine Namen. Verdammt, Kassandra!!'
);


    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

module.exports = HowDidEverythingGetHereIntentHandler;
