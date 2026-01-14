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
        this.load.image("house", "assets/images/house.png");
        this.load.image("tree", "assets/images/tree.png");
        this.load.image("flower", "assets/images/flower.png");
        this.load.image("cub", "assets/images/cub.png");
        this.load.image("bird", "assets/images/bird.png");
        this.load.image("house-colored", "assets/images/house-colored.png");
        this.load.image("tree-colored", "assets/images/tree-colored.png");
        this.load.image("flower-colored", "assets/images/flower-colored.png");
        this.load.image("cub-colored", "assets/images/cub-colored.png");
        this.load.image("bird-colored", "assets/images/bird-colored.png");
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
            this.riko = this.add.image(this.width * 0.2, this.height * 0.75, 'riko-sent-game')
            .setScale(0.2)
            .setDepth(1);

            this.currentSentenceIndex = 0;

            this.sentences = [
                "The little lion likes leaves.",
                "Lily lost her yellow ball.",
                "Look at the blue balloon.",
                "The lamp is on the table.",
                "The girl loves lemons."
            ];

            this.drawSentence(this.sentences[this.currentSentenceIndex]);

            const pictureLayouts = [
                { x: this.width * 0.1, y: this.height * 0.5, scale: 0.11 },
                { x: this.width * 0.5, y: this.height * 0.55,  scale: 0.12 },
                { x: this.width * 0.75, y: this.height * 0.75,  scale: 0.05 },
                { x: this.width * 0.95, y: this.height * 0.35, scale: 0.06 },
                { x: this.width * 0.94, y: this.height * 0.75,  scale: 0.035 },
            ];

            this.pictures = [];
            this.picNames = ["tree", "house", "cub", "bird", "flower"];

            const startX = this.width / 2 - 240;
            const y = this.height / 2 + 50;
            const gap = 120;

            for (let i = 0; i < 5; i++) {
                const layout = pictureLayouts[i];

                const pic = this.add.image(
                    layout.x,
                    layout.y,
                    this.picNames[i]
                ).setScale(layout.scale);

                this.pictures.push(pic);
            }
        });
    }


    drawSentence(sentence) {
        // Clear previous sentence letters
        if (this.sentenceLetters) {
            this.sentenceLetters.forEach(l => l.destroy());
        }

        this.sentenceLetters = [];

        const y = 60;
        let totalWidth = 0;

        // Measure total width
        const tempLetters = [];
        sentence.split("").forEach(char => {
            const t = this.add.text(0, 0, char, {
                fontSize: "36px",
                fontFamily: "Inter",
                fontStyle: "bold"
            });
            totalWidth += t.width;
            tempLetters.push(t);
        });
        tempLetters.forEach(t => t.destroy());

        let x = this.width / 2 - totalWidth / 2;

        // Draw colored letters
        sentence.split("").forEach(char => {
            const isL = char.toLowerCase() === "l";

            const letter = this.add.text(x, y, char, {
                fontSize: "36px",
                fontFamily: "Inter",
                fontStyle: "bold",
                color: isL ? "#e53935" : "#686767"
            })
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });

            letter.on("pointerdown", () => {
                this.onSentencePressed();
            });

            x += letter.width;
            this.sentenceLetters.push(letter);
        });
    }


    onSentencePressed() {
        if (this.currentSentenceIndex >= this.pictures.length) return;

        const index = this.currentSentenceIndex;

        // Color the correct picture
        this.pictures[index].setTexture(
            `${this.picNames[index]}-colored`
        );

        this.currentSentenceIndex++;

        // Update sentence
        if (this.currentSentenceIndex < this.sentences.length) {
            this.drawSentence(
                this.sentences[this.currentSentenceIndex]
            );
        } else {
            this.drawSentence("Great job! ⭐");
            this.riko.destroy();

            this.riko = this.add.sprite(
                this.width * 0.25,
                this.height * 0.75,
                'riko-jumping'
            )
            .setScale(0.75)
            .setDepth(1);

            this.riko.play('rikoJump');
        }
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
