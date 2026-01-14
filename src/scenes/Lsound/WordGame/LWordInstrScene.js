export default class LWordInstrScene extends Phaser.Scene {
    constructor() {
        super("LWordInstrScene");
        this.width = 0;
        this.height = 0;
    }


    preload() {
        this.load.image('forest-bg', 'assets/images/forest-bg.png');
        this.load.image('profile-icon', 'assets/images/profile-btn.png');
        this.load.image('logout-icon', 'assets/images/logout-btn.png');
        this.load.image('back-to-map', 'assets/images/back-to-map.png');
        this.load.image('Sound-btn', 'assets/images/level-1.png');
        this.load.image('Word-btn', 'assets/images/level-2.png');
        this.load.image('Sentence-btn', 'assets/images/level-3.png');
        this.load.image('L-banner', 'assets/images/L-banner.png');
        this.load.image('riko-with-apple-basket', 'assets/images/riko-with-apple-basket.png');
        this.load.image('instr-l-word', 'assets/images/instr-l-word.png');
        this.load.image('play-btn', 'assets/images/play-btn.png');
    }


    create() {
        // Background
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'forest-bg')
            .setOrigin(0, 0)
            .setDepth(-10);

        // Correct way to get texture width/height
        const bgPicWidth = background.texture.getSourceImage().width;
        const bgPicHeight = background.texture.getSourceImage().height;

        // Scale to fit screen
        const scale = Math.max(this.width / bgPicWidth, this.height / bgPicHeight);

        background.setScale(scale);


        // Back to menu button
        const backToMapBtn = this.add.image(90, 40, 'back-to-map')
        .setScale(0.15)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LLevelScene'); 
                });
            })
        .on('pointerover', () => backToMapBtn.setAlpha(0.7))
        .on('pointerout', () => backToMapBtn.setAlpha(1));


        const RikoWithLBalloons = this.add.image(this.width / 2.8, this.height - 200, 'riko-with-apple-basket')
        .setScale(0.45)
        .setDepth(1);


        const InstrLSound = this.add.image(this.width / 1.4, this.height / 2, 'instr-l-word')
        .setScale(0.55)
        .setDepth(1);

        const cardBounds = InstrLSound.getBounds();

        const playBtn = this.add.image(cardBounds.centerX, cardBounds.bottom - 125, 'play-btn')
        .setScale(0.22)
        .setDepth(2)
        .setInteractive()

        // Hover: make bigger
        playBtn.on('pointerover', () => {
            this.tweens.add({
                targets: playBtn,
                scale: 0.23,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Hover out: shrink back
        playBtn.on('pointerout', () => {
            this.tweens.add({
                targets: playBtn,
                scale: 0.22,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Click: animate and go to login page
        playBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: playBtn,
                scale: 0.23,
                duration: 100,
                yoyo: true,
                ease: 'Power1',
                onComplete: () => {
                    this.scene.start('LWordGame');   
                }
            });
        });
    }
}
