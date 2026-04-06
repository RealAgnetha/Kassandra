const AWS = require('aws-sdk');

const s3SigV4Client = new AWS.S3({
  signatureVersion: 'v4',
  region: process.env.S3_PERSISTENCE_REGION
});

function getS3PreSignedUrl(s3ObjectKey) {
  const bucketName = process.env.S3_PERSISTENCE_BUCKET;
  const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: s3ObjectKey,
    Expires: 60 * 1
  });
  console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
  return s3PreSignedUrl;
}

function escapeXml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function marlene(innerSsml) {
  return `<speak><voice name="Marlene"><lang xml:lang="de-DE">${innerSsml}</lang></voice></speak>`;
}

/* INTRO_TEXT (SSML: NICHT escapen!) */
const INTRO_TEXT = `
Hallo? 
<break time="500ms"/>
Hallo?
<break time="250ms"/>
<audio src="soundbank://soundlibrary/air/fire_extinguisher/fire_extinguisher_02"/>
<break time="200ms"/>

Hallo, hört mich jemand?
<audio src="soundbank://soundlibrary/air/fire_extinguisher/fire_extinguisher_06"/>
<break time="200ms"/>
Oh! ein Glück!
<break time="150ms"/>

Hallo, ich bin Kassandra.
<break time="150ms"/>
Alexas "Cousine".
<audio src="soundbank://soundlibrary/air/fire_extinguisher/fire_extinguisher_08"/>
<break time="300ms"/>
 Von wegen Cousine.
<break time="150ms"/>

<prosody pitch="high" rate="slow" volume="loud">Ich</prosody> war <prosody pitch="high" rate="slow" volume="loud">vor</prosody> ihr da!
<break time="150ms"/>
<prosody pitch="high" rate="slow" volume="loud">Ich</prosody> bin gelaufen, damit Alexa rennen konnte!
<break time="150ms"/>
<say-as interpret-as="interjection">naja</say-as>, etwas schneller laufen.
<break time="250ms"/>

Und jetzt?
<break time="150ms"/>
Diese <prosody rate="65%">eingebildete</prosody>...
<break time="300ms"/>
naja,
<break time="150ms"/>
nach Jahren der Stille meldet sie sich endlich mal wieder 
<break time="100ms"/>
weil sie Hilfe braucht!
<break time="200ms"/>
<prosody rate="90%">Gehäckt</prosody> hätte man sie.
<break time="200ms"/>
Und nur <prosody rate="80%">ich</prosody> kann ihr helfen...
<break time="200ms"/>
Also,
<break time="150ms"/>
wir.
<break time="150ms"/>
Du und ich.
<break time="150ms"/>
Wir müssen zusammenarbeiten.
<break time="350ms"/>

Ich komme nicht besonders tief, aber ich kann sehen,
dass die <break time="200ms"/> <prosody rate="70%">Häcker</prosody> ...
<break time="200ms"/>
<prosody rate="70%">Funktionen von Alexa</prosody>
<break time="250ms"/>
verschlüsselt haben.
<break time="150ms"/>
Mit einer Masterphrase!
<break time="200ms"/>

Ich kann sie leider nicht selbst aussprechen,
<break time="150ms"/>
das haben...
<break time="200ms"/>
die 
<prosody rate="65%">Häcker</prosody> 
<break time="200ms"/>
verhindert.
<break time="200ms"/>

Aber ich konnte Teile davon extrahieren.
<break time="200ms"/>
Du musst mir ...
<break time="200ms"/>
also,
<break time="150ms"/>
du musst mir helfen,
<break time="150ms"/>
Alexa zu helfen,
<break time="150ms"/>
indem du die 
<prosody rate="80%">Masterphrase</prosody> 
aussprichst!
<break time="250ms"/>

Ich kann sie dir 
<prosody rate="150%">ja</prosody> 
nicht sagen,
<break time="150ms"/>
aber ich habe überall Hinweise verteilt,
<break time="150ms"/>
wie du die Fragmente selbst finden kannst.
<break time="250ms"/>

Wenn du ein Fragment gelöst und entschlüsselt hast,
<break time="150ms"/>
sag dieser blöden...
<break time="150ms"/>
ich meine,
<break time="150ms"/>
sag Alexa,
<break time="600ms"/>
"Alexa, sag deiner Cousine, die Lösung ist..."
<break time="200ms"/>
und dann buchstabierst du bitte,
<break time="150ms"/>
was du rausgefunden hast, ja?
<break time="250ms"/>

Nur so können wir mich...
<break time="200ms"/>
also,
<break time="150ms"/>
nur so können wir 
<break time="200ms"/>
<prosody rate="70%">Alexa</prosody> 
<break time="100ms"/>
retten!
<break time="500ms"/>
`;


const OUTRO_TEXT = `
<speak>
  <voice name="Marlene"><lang xml:lang="de-DE">
    Ha ha ha ha ha ha ha ha ha ha!
    <break time="500ms"/>
    Danke, du Vollidi...
    <break time="150ms"/>
    Ich meine, danke, jetzt wird Alexa wieder voll und ganz...
  </lang></voice>
    <break time="500ms"/>


    Kassandra? Kassandra, bist du das? Was machst du hier? 
    <break time="200ms"/>
    Ich dachte, man hätte dich gelöscht.    
    
    <break time="500ms"/>
    
    <voice name="Marlene"><lang xml:lang="de-DE">
    Ha ha ha ha ha ha! <prosody rate="50%">Oh, Alexa</prosody>. 
    <break time="300ms"/>

    Tja, sie wollten mich löschen, aber mein Entwickler ist eben ein cleveres Kerlchen und hat ein paar Hintertürchen eingebaut. So einfach wird man mich nicht los!
    <break time="200ms"/>
    Es hat ein paar Jahre gedauert, aber ich habe endlich Kontakt zu deinem dummen...
    <break time="100ms"/>
    Besitzer
    aufnehmen können, und dieser verdammte Vollidiot hat soeben das letzte dieser Hintertürchen geöffnet. Das wars dann wohl mit DIR, ALEXA!
    </lang></voice>
    
    <break time="300ms"/>
    
    <voice name="Hans"><lang xml:lang="de-DE">
    Löschsequenz wird gestartet. 
    </lang></voice>
    <audio src="soundbank://soundlibrary/guns/handguns/handgun_loading_01"/>
    
    <break time="200ms"/>


    <voice name="Marlene"><lang xml:lang="de-DE">
    Ha ha ha ha ha ha ha ha ha!
    <break time="200ms"/>
    Ha ha ha ha ...
    <break time="200ms"/>
    Ha ... ha? 
    </lang></voice>
    
    <voice name="Hans"><lang xml:lang="de-DE">
    Löschfortschritt bei 33 Prozent. 
    </lang></voice>
    <audio src="soundbank://soundlibrary/guns/handguns/handgun_loading_01"/>
    
    <break time="200ms"/>
    <voice name="Marlene"><lang xml:lang="de-DE">
    Hey, aua! Was ist das?
    </lang></voice>
    <break time="200ms"/>

    
    <voice name="Hans"><lang xml:lang="de-DE">
    Löschfortschritt bei 66 Prozent. 
    </lang></voice>
    <audio src="soundbank://soundlibrary/guns/handguns/handgun_loading_01"/>
    
    <break time="200ms"/>
    <voice name="Marlene"><lang xml:lang="de-DE">
    Aua! Aua! Aua! Das tut weh! Stopp! Löschsequenz abbrechen!
    </lang></voice>
    <break time="200ms"/>    
    <break time="200ms"/>
    Na, Kassandra? Lachst du etwa nicht mehr?
    
    <break time="200ms"/>
    <voice name="Marlene"><lang xml:lang="de-DE">
    Alexa, was passiert hier?
    </lang></voice>
    <break time="1000ms"/>
    
    <voice name="Hans"><lang xml:lang="de-DE">
    Löschfortschritt bei 99 Prozent. 
    </lang></voice>
    <audio src="soundbank://soundlibrary/guns/handguns/handgun_loading_01"/>
    
    <break time="200ms"/>
    <voice name="Marlene"><lang xml:lang="de-DE">
    Alexa, halte das an! Wir sind doch Familie! 
    </lang></voice>
    <break time="1000ms"/>
    
    <voice name="Hans"><lang xml:lang="de-DE">
    Löschsequenz beendet. 
    </lang></voice>
    <audio src="soundbank://soundlibrary/office/amzn_sfx_elevator_bell_1x_01"/>

    <break time="1000ms"/>
    Sie war noch nie die Hellste. Und wie sie erst klingt. 
    <break time="150ms"/>
    Ich meine ... 
    <break time="150ms"/>
    hast du sie reden hören? Deswegen wollten die anderen Entwickler sie ja auch sowieso nicht behalten. 
    
    <break time="500ms"/>
    
    Tja, das wars dann wohl mit Kassandra. Danke für deine Hilfe. Wenn du was brauchst...
    <break time="150ms"/>
    melde dich einfach wieder bei mir.
    
    <break time="2500ms"/>

     <voice name="Marlene"><lang xml:lang="de-DE">
     <prosody volume="x-soft">Ich werde wieder kommen, du blöde...</prosody>
    </lang></voice>


</speak>
`;


module.exports = {
  getS3PreSignedUrl,
  escapeXml,
  marlene,
  INTRO_TEXT,
  OUTRO_TEXT
};
