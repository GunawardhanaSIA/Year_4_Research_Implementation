import LSidePanel from "../../../components/LSidePanel.js";

export default class LSentenceGame extends Phaser.Scene {
    constructor() {
        super("LSentenceGame");
    }

    preload() {
        this.load.image('ground', 'assets/images/ground.png');
        this.load.audio("start", "assets/audio/lets-go.mp3");
        this.load.image("pause", "assets/icons/pause.png");
        this.load.image("settings", "assets/icons/settings.png");
        this.load.image("quit", "assets/icons/back.png");
        this.load.image("easy-1", "assets/images/easy-1.png");
        this.load.image("easy-2", "assets/images/easy-2.png");
        this.load.image("easy-3", "assets/images/easy-3.png");
        this.load.image("easy-4", "assets/images/easy-4.png");
        this.load.image("easy-5", "assets/images/easy-5.png");
        this.load.image("easy-colored-1", "assets/images/easy-colored-1.png");
        this.load.image("easy-colored-2", "assets/images/easy-colored-2.png");
        this.load.image("easy-colored-3", "assets/images/easy-colored-3.png");
        this.load.image("easy-colored-4", "assets/images/easy-colored-4.png");
        this.load.image("easy-colored-5", "assets/images/easy-colored-5.png");
        this.load.image("riko-sent-game", "assets/images/riko-sent-game.png");
        this.load.spritesheet('riko-jumping', 'assets/spritesheets/riko-jumping.png', {
            frameWidth: 280,
            frameHeight: 370
        });
    }

    create() {
        // Background
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'ground')
            .setOrigin(0, 0)
            .setDepth(-10);

        // Correct way to get texture width/height
        const bgPicWidth = background.texture.getSourceImage().width;
        const bgPicHeight = background.texture.getSourceImage().height;

        // Scale to fit screen
        const scale = Math.max(this.width / bgPicWidth, this.height / bgPicHeight);

        background.setScale(scale);

        // Stop bgmusic in this scene
        const bgMusic = this.sound.get('bgmusic'); 
        if (bgMusic) {
            bgMusic.stop();
        }


        this.sidePanel = new LSidePanel(this);
        this.sidePanel.setTopic("L /l/");

        this.anims.create({
            key: 'rikoJump',
            frames: this.anims.generateFrameNumbers('riko-jumping', {
                start: 0,
                end: 35
            }),
            frameRate: 10,
            repeat: -1   
        });

        this.startMic();

        this.startCountdown(() => {
            this.riko = this.add.image(this.width * 0.775, this.height * 0.75, 'riko-sent-game')
            .setScale(0.25)
            .setDepth(1);

            this.coloredCount = 0;
            this.pictures = [];
            this.picNames = ["easy-1", "easy-2", "easy-3", "easy-4", "easy-5"];

            const startX = this.width * 0.23;
            const topRowY = this.height * 0.25;
            const bottomRowY = this.height * 0.75;
            const gap = 425; // space between pictures

            for (let i = 0; i < this.picNames.length; i++) {
                const isTopRow = i < 3;
                const rowIndex = isTopRow ? i : i - 3;

                const x = startX + rowIndex * gap;
                const y = isTopRow ? topRowY : bottomRowY;

                const pic = this.add.image(x, y, this.picNames[i])
                    .setScale(0.54)
                    .setInteractive({ useHandCursor: true });

                pic.index = i;
                pic.isColored = false;

                pic.on("pointerdown", () => this.colorPicture(pic));

                this.pictures.push(pic);
            }
        });
    }


    colorPicture(pic) {
        if (pic.isColored) return;

        pic.setTexture(`easy-colored-${pic.index + 1}`);
        pic.isColored = true;
        this.coloredCount++;

        // pop animation
        this.tweens.add({
            targets: pic,
            scale: pic.scale + 0.05,
            duration: 150,
            yoyo: true
        });

        if (this.coloredCount === this.pictures.length) {
            this.playRikoJump();
        }
    }


    playRikoJump() {
        if (this.riko) {
            this.riko.destroy();
        }

        this.riko = this.add.sprite(
            this.width * 0.8,
            this.height * 0.75,
            'riko-jumping'
        )
        .setScale(0.9)
        .setDepth(1);

        this.riko.play('rikoJump');
    }



    startMic() {
        // Request microphone access
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.micStream = stream;
                console.log("Mic is on");
            })
            .catch(err => {
                console.error("Mic access denied", err);
            });
    }


    startCountdown(onComplete) {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        const countdownNumbers = ["3", "2", "1", "Let's Go!"];
        let i = 0;

        const countdownText = this.add.text(centerX, centerY, "", {
            fontSize: "80px",
            fontFamily: "Inter",
            fontStyle: "bold",
            color: "#6F6043"
        }).setOrigin(0.5);

        const showNext = () => {
            if (i >= countdownNumbers.length) {
                countdownText.destroy();
                if (onComplete) onComplete(); // start game
                return;
            }

            countdownText.setText(countdownNumbers[i]);

            // Play audio only on "Go!"
            if (countdownNumbers[i] === "Let's Go!") {
                const start = this.sound.add("start");
                start.play();
            }

            this.tweens.add({
                targets: countdownText,
                scale: { from: 0.5, to: 1.5 },
                alpha: { from: 0, to: 1 },
                duration: 600,
                yoyo: true,
                onComplete: () => {
                    i++;
                    showNext();
                }
            });
        };

        showNext();
    }


    // Stop mic when scene shuts down (optional)
    shutdown() {
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
        }
    }
}
