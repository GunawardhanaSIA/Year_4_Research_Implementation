import AuthenticationScene from "./scenes/AuthenticationScene.js";
import LevelScene from "./scenes/LevelScene.js";
import MenuScene from "./scenes/MenuScene.js";
import PConversation from "./scenes/Psound/PConversation.js";
import PSound from "./scenes/Psound/PSound.js";
import SConversation from "./scenes/Ssound/SConversation.js";
import SLevel from "./scenes/Ssound/SLevels.js";
import SSound from "./scenes/Ssound/SSound.js";
import SWord from "./scenes/Ssound/SWord.js";
import TitleScene from "./scenes/TitleScene.js";

// import RexUIPlugin from './plugins/phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
        SSound, 
        SLevel,
        PConversation,
        SConversation,
        SWord,
        AuthenticationScene,
        LevelScene
    ],
};

new Phaser.Game(config);