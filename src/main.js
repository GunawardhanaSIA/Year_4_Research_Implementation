import AuthenticationScene from "./scenes/AuthenticationScene.js";
import LevelScene from "./scenes/LevelScene.js";
import LoginScene from "./scenes/Authentication/LoginScene.js";
import MenuScene from "./scenes/MenuScene.js";
import PConversation from "./scenes/Psound/PConversation.js";
import PSound from "./scenes/Psound/PSound.js";
import SConversation from "./scenes/Ssound/SConversation.js";
import SWord from "./scenes/Ssound/SWord.js";
import TitleScene from "./scenes/TitleScene.js";
import RegisterScene from "./scenes/Authentication/RegisterScene.js";
import LLevelScene from "./scenes/Lsound/LLevelScene.js";
import LSoundInstrScene from "./scenes/Lsound/SoundGame/LSoundInstrScene.js";
import LSoundGame from "./scenes/Lsound/SoundGame/LSoundGame.js";
import LWordInstrScene from "./scenes/Lsound/WordGame/LWordInstrScene.js";
import LWordGame from "./scenes/Lsound/WordGame/LWordGame.js";
import LSentenceGame from "./scenes/Lsound/SentenceGame/LSentenceGame.js";
import LSentenceInstrScene from "./scenes/Lsound/SentenceGame/LSentenceInstrScene.js";
import LProgressGraphScene from "./scenes/Lsound/LProgressGraph.js";

// import RexUIPlugin from './plugins/phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,   
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#fefefe",
    parent: 'game-container',
    physics: {
        default: "arcade",  
        arcade: { debug: false }
    },
    dom: {
        createContainer: true
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: window.rexuiplugin, // RexUIPlugin,
            mapping: 'rexUI'
        }]
    },
    scene: [
        TitleScene,
        MenuScene,
        PSound,
        LSoundGame, 
        LWordInstrScene,
        PConversation,
        SConversation,
        SWord,
        AuthenticationScene,
        LevelScene,
        LoginScene,
        RegisterScene,
        LLevelScene,
        LSoundInstrScene,
        LWordGame,
        LSentenceGame,
        LSentenceInstrScene,
        LProgressGraphScene
    ],
};

new Phaser.Game(config);