const Alexa = require('ask-sdk-core');
const S3PersistenceAdapter = require('ask-sdk-s3-persistence-adapter').S3PersistenceAdapter;

const LaunchRequestHandler = require('./handlers/LaunchRequestHandler');
const HintIntentHandler = require('./handlers/HintIntentHandler');
const ResetIntentHandler = require('./handlers/ResetIntentHandler');
const AnswerIntentHandler = require('./handlers/AnswerIntentHandler');
const FallbackIntentHandler = require('./handlers/FallbackIntentHandler'); 
const DontKnowIntentHandler = require('./handlers/DontKnowIntentHandler');
const YesIntentHandler = require('./handlers/YesIntentHandler');
const NoIntentHandler = require('./handlers/NoIntentHandler');
const RepeatHintsIntentHandler = require('./handlers/RepeatHintsIntentHandler');
const RevealSolutionIntentHandler = require('./handlers/RevealSolutionIntentHandler');
const HowDidEverythingGetHereIntentHandler = require('./handlers/HowDidEverythingGetHereIntentHandler');
const ReadyIntentHandler = require('./handlers/ReadyIntentHandler');
const RepeatPuzzleIntentHandler = require('./handlers/RepeatPuzzleIntentHandler');
const StopIntentHandler = require('./handlers/StopIntentHandler');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HintIntentHandler,
    ResetIntentHandler,
    AnswerIntentHandler,
    FallbackIntentHandler,
    DontKnowIntentHandler,
    YesIntentHandler,
    NoIntentHandler,
    RepeatHintsIntentHandler,
    RevealSolutionIntentHandler,
    HowDidEverythingGetHereIntentHandler,
    ReadyIntentHandler,
    RepeatPuzzleIntentHandler,
    StopIntentHandler
  )
  .withPersistenceAdapter(
    new S3PersistenceAdapter({ bucketName: process.env.S3_PERSISTENCE_BUCKET })
  )
  .lambda();
