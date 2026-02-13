export default class LThemeScene extends Phaser.Scene {
    constructor() {
        super("LThemeScene");
        this.width = 0;
        this.height = 0;
    }

    init(data) {
        this.selectedLevel = data.selectedLevel;
    }

    preload() {
        this.load.image('theme-scene-bg', 'assets/images/ground.png');
        this.load.image('theme-scene-topic', 'assets/images/theme-scene-topic.png');
        this.load.image('back-to-menu', 'assets/images/back-to-menu.png');
        this.load.image('forest-btn', 'assets/images/forest-btn.png');
        this.load.image('beach-btn', 'assets/images/beach-btn.png');
        this.load.image('riko-forest', 'assets/images/riko-forest.png');
        this.load.image('riko-beach', 'assets/images/riko-beach.png');
        this.load.spritesheet('riko', 'assets/spritesheets/riko-waving.png', {
            frameWidth: 235,
            frameHeight: 273
        });
    }


    create() {
        // Background
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'theme-scene-bg')
            .setOrigin(0, 0)
            .setDepth(-10);

        // Correct way to get texture width/height
        const bgPicWidth = background.texture.getSourceImage().width;
        const bgPicHeight = background.texture.getSourceImage().height;

        // Scale to fit screen
        const scale = Math.max(this.width / bgPicWidth, this.height / bgPicHeight);

        background.setScale(scale);


        // Back to menu button
        const backToMenuBtn = this.add.image(90, 40, 'back-to-menu')
        .setScale(0.15)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LLevelScene'); 
                });
            })
        .on('pointerover', () => backToMenuBtn.setAlpha(0.7))
        .on('pointerout', () => backToMenuBtn.setAlpha(1));


        const Topic = this.add.image(this.width / 2, 75, 'theme-scene-topic').setScale(0.4);

        const rikoBeach = this.add.image(this.width / 3, this.height / 2 + 30, 'riko-beach').setScale(0.55);
        const rikoForest = this.add.image(this.width / 3 * 2, this.height / 2 + 30, 'riko-forest').setScale(0.55);

        const beachBtn = this.add.image(this.width / 3, this.height / 2 + 275, 'beach-btn')
        .setScale(0.4)
        .setInteractive({ useHandCursor: true });

        // Hover: make bigger
        beachBtn.on('pointerover', () => {
            this.tweens.add({
                targets: beachBtn,
                scale: 0.42,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Hover out: shrink back
        beachBtn.on('pointerout', () => {
            this.tweens.add({
                targets: beachBtn,
                scale: 0.4,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Click: animate and go to login page
        beachBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: beachBtn,
                scale: 0.42,
                duration: 100,
                yoyo: true,
                ease: 'Power1',
                onComplete: () => {
                    this.scene.start(`L${this.selectedLevel}InstrScene`, {
                        selectedTheme: 'beach'
                    });   
                }
            });
        });


        const forestBtn = this.add.image(this.width / 3 * 2, this.height / 2 + 275, 'forest-btn')
        .setScale(0.4)
        .setInteractive({ useHandCursor: true });

        // Hover: make bigger
        forestBtn.on('pointerover', () => {
            this.tweens.add({
                targets: forestBtn,
                scale: 0.42,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Hover out: shrink back
        forestBtn.on('pointerout', () => {
            this.tweens.add({
                targets: forestBtn,
                scale: 0.4,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Click: animate and go to login page
        forestBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: forestBtn,
                scale: 0.42,
                duration: 100,
                yoyo: true,
                ease: 'Power1',
                onComplete: () => {
                    this.scene.start(`L${this.selectedLevel}InstrScene`, {
                        selectedTheme: 'forest'
                    });  
                }
            });
        });


        // this.anims.create({
        //     key: 'riko-wave',
        //     frames: this.anims.generateFrameNumbers('riko', { start: 3, end: 6 }),
        //     frameRate: 4,
        //     repeat: -1
        // });
    }
}
