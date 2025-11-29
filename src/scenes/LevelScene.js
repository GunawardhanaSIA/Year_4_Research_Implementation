export default class LevelScene extends Phaser.Scene {
    constructor() {
        super("LevelScene");
        this.width = 0;
        this.height = 0;
    }

    preload() {
        this.load.image('level-scene-bg', 'assets/images/level-scene.png');
        this.load.image('profile-icon', 'assets/images/profile-icon.png');
        this.load.image('logout-icon', 'assets/images/logout-icon.png');
        this.load.image('sound-btn', 'assets/images/sound-btn.png');
        this.load.image('word-btn', 'assets/images/word-btn.png');
        this.load.image('phrase-btn', 'assets/images/phrase-btn.png');
        this.load.image('sentence-btn', 'assets/images/sentence-btn.png');
        this.load.image('conversation-btn', 'assets/images/conversation-btn.png');
        this.load.spritesheet('riko-walking', 'assets/spritesheets/riko-walking.png', {
            frameWidth: 274,
            frameHeight: 263
        });
    }

    create() {
        // Background
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'level-scene-bg')
            .setOrigin(0, 0)
            .setDepth(-1);

        // Correct way to get texture width/height
        const bgPicWidth = background.texture.getSourceImage().width;
        const bgPicHeight = background.texture.getSourceImage().height;

        // Scale to fit screen
        const scale = Math.max(this.width / bgPicWidth, this.height / bgPicHeight);

        background.setScale(scale);

        // Profile button
        const profileIcon = this.add.image(this.width - 113, 40, 'profile-icon')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LevelScene'); 
                });
            })
        .on('pointerover', () => profileIcon.setAlpha(0.7))
        .on('pointerout', () => profileIcon.setAlpha(1));


        //Logout button
        const logoutIcon = this.add.image(this.width - 45, 40, 'logout-icon')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LevelScene'); 
                });
            })
        .on('pointerover', () => logoutIcon.setAlpha(0.7))
        .on('pointerout', () => logoutIcon.setAlpha(1));



        const levelNames = ["sound", "word", "phrase", "sentence", "conversation"];

        const levelPositions = [
            { x: this.width/2 + 40, y: this.height/2 + 270 },
            { x: this.width/2 + 115, y: this.height/2 + 150 },
            { x: this.width/2 + 100, y: this.height/2 - 25 },
            { x: this.width/2 - 235, y: this.height/2 - 120 },
            { x: this.width/2 + 130, y: this.height/2 - 250 },
        ];


        this.levelButtons = [];

        levelNames.forEach((name, index) => {
            const pos = levelPositions[index];    
            const key = `${name}-btn`;           

            const btn = this.add.image(pos.x, pos.y, key)
                .setInteractive()
                .setScale(0.2);

            btn.levelName = name; 
            btn.levelNumber = index + 1;

            btn.on('pointerdown', () => {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.onLevelSelected(btn.levelNumber, pos);
                });
            })
            .on('pointerover', () => btn.setAlpha(0.7).setScale(0.22))
            .on('pointerout', () => btn.setAlpha(1).setScale(0.2));
        });  
    }
}
