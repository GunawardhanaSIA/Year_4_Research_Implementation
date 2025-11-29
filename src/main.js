import AuthenticationScene from "./scenes/AuthenticationScene.js";
import LevelScene from "./scenes/LevelScene.js";
import LoginScene from "./scenes/Authentication/LoginScene.js";
import MenuScene from "./scenes/MenuScene.js";
import PConversation from "./scenes/Psound/PConversation.js";
import PSound from "./scenes/Psound/PSound.js";
import SConversation from "./scenes/Ssound/SConversation.js";
import SLevel from "./scenes/Ssound/SLevels.js";
import SSound from "./scenes/Ssound/SSound.js";
import SWord from "./scenes/Ssound/SWord.js";
import TitleScene from "./scenes/TitleScene.js";
import RegisterScene from "./scenes/Authentication/RegisterScene.js";

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
        SSound, 
        SLevel,
        PConversation,
        SConversation,
        SWord,
        AuthenticationScene,
        LevelScene,
        LoginScene,
        RegisterScene
    ],
};

new Phaser.Game(config);