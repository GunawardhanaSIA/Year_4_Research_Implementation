export default class LevelScene extends Phaser.Scene {
    constructor() {
        super("LevelScene");
        this.width = 0;
        this.height = 0;
    }

    preload() {
        this.load.video('bg-plain', 'assets/videos/bg-plain.mp4');
        this.load.image('sSound', 'assets/images/sSound.png');
        this.load.image('sWord', 'assets/images/sWord.png');
        this.load.image('sPhrase', 'assets/images/sPhrase.png');
        this.load.image('sSentence', 'assets/images/sSentence.png');
        this.load.image('sConversation', 'assets/images/sConversation.png');
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Background video
        const background = this.add.video(this.width / 2, this.height / 2, 'bg-plain');
        this.cameras.main.fadeIn(2000, 255, 255, 255);
        background.setMute(true).play(true).setLoop(true).setDepth(-1);
        this.handleVideoScaling(background);


        this.createLevelCard();
    }

    createLevelCard() {
        const x = this.width / 2;
        const y = this.height / 2;
        const cardWidth = 700;
        const cardHeight = 550;

        // Card background
        this.cardBg = this.add.graphics();
        this.cardBg.fillStyle(0xffffff, 0.7);
        this.cardBg.fillRoundedRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 65);
        this.cardBg.lineStyle(3, 0x805389, 0.7);
        this.cardBg.strokeRoundedRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 65);

        // Title
        this.cardTitle = this.add.text(x, y - cardHeight / 2 + 40, 'S /s/', {
            fontSize: '36px',
            color: '#805389',
            fontStyle: 'bold',
            fontFamily: "Comic Relief",
            letterSpacing: 1
        })
        .setOrigin(0.5)
        .setShadow(1, 2, '#9d9d9d', 3, true, true);

        // Level names and positions
        const levels = [
            { name: "Sound", x: 120, y: 300, icon: "sSound" },
            { name: "Word", x: 240, y: 400, icon: "sWord" },
            { name: "Phrases", x: 370, y: 230, icon: "sPhrase" },
            { name: "Sentence", x: 500, y: 400, icon: "sSentence" },
            { name: "Conversation", x: 650, y: 280, icon: "sConversation" }
        ];

        levels.forEach((level) => {
            // Shadow circle first (behind)
            const shadow = this.add.circle(level.x + 4, level.y + 4, 46, 0x805389, 1)
                .setDepth(0);

            const circle = this.add.circle(level.x, level.y, 45, 0xffffff)
                .setStrokeStyle(4, 0x805389)
                .setInteractive({ useHandCursor: true });

            const icon = this.add.image(level.x, level.y, level.icon)
                .setDisplaySize(70, 70)  
                .setDepth(1); 

            const label = this.add.text(level.x, level.y + 70, level.name, {
                fontSize: "22px",
                color: "#805389",
                fontFamily: "Comic Relief",
                fontStyle: "bold"
            }).setOrigin(0.5);

            // Hover effect
            circle.on('pointerover', () => {
                this.tweens.add({
                    targets: circle,
                    scale: 1.2,
                    duration: 150,
                    ease: 'Sine.easeOut'
                });
            });

            circle.on('pointerout', () => {
                this.tweens.add({
                    targets: circle,
                    scale: 1,
                    duration: 150,
                    ease: 'Sine.easeOut'
                });
            });

            // On click → open next scene
            circle.on('pointerdown', () => {
                console.log(`Selected level: ${level.name}`);
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start(`S${level.name}`); // change later to each level scene
                });
            });
        });
    }

    handleVideoScaling(background) {
        background.once('play', () => this.scaleVideoToFullScreen(background));
        this.scale.on('resize', () => this.scaleVideoToFullScreen(background));
    }

    scaleVideoToFullScreen(bg) {
        const vw = bg.video.videoWidth;
        const vh = bg.video.videoHeight;
        if (!vw || !vh) return;
        const scale = Math.max(this.width / vw, this.height / vh);
        bg.setDisplaySize(vw * scale, vh * scale);
    }
}
