import LSidePanel from "../../../components/LSidePanel.js";

export default class LWordGame extends Phaser.Scene {
    constructor() {
        super("LWordGame");
    }

    preload() {
        this.load.image('ground', 'assets/images/ground.png');
        this.load.audio("start", "assets/audio/lets-go.mp3");
        this.load.image("pause", "assets/icons/pause.png");
        this.load.image("settings", "assets/icons/settings.png");
        this.load.image("quit", "assets/icons/back.png");
        this.load.image("apple-tree", "assets/images/apple-tree.png");
        this.load.image("word-list", "assets/images/word-list.png");
        this.load.image("riko-with-basket", "assets/images/riko-with-basket.png");
        this.load.image("lemon", "assets/images/lemon.png");
        this.load.image("lion", "assets/images/lion.png");
        this.load.image("leg", "assets/images/leg.png");
        this.load.image("leaf", "assets/images/leaf.png");
        this.load.image("lamp", "assets/images/lamp.png");
        this.load.image("apple", "assets/images/apple.png");
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

        this.startMic();

        this.startCountdown(() => {
            this.Tree = this.add.image(this.width / 3, this.height / 2 - 30, 'apple-tree')
            .setScale(0.9)
            .setDepth(1);

            this.rikoWithBasket = this.physics.add.image(this.width / 4, this.height - 130, 'riko-with-basket')
            .setScale(0.3)
            .setDepth(1);
            this.rikoWithBasket.body.setAllowGravity(false).setCollideWorldBounds(true)

            const wordList = this.add.image(this.width / 4 * 3, this.height / 2, 'word-list')
            .setScale(0.8)
            .setDepth(1);

            this.words = ["lamp", "lion", "leg", "leaf", "lemon"];

            this.wordButtons = [];
            const startY = this.height / 2 - 130;
            const gapY = 80;
            this.words.forEach((word, index) => {
                const btn = this.add.image(this.width / 4 * 3, startY + index * gapY, word)
                    .setOrigin(0.5)
                    .setDepth(2)
                    .setScale(0.7)
                    .setInteractive({ useHandCursor: true });

                btn.on('pointerdown', () => this.onWordClick(index));
                this.wordButtons.push(btn);
            });

            this.apples = this.physics.add.group();

            for (let i = 0; i < 5; i++) {
                const randomX = Phaser.Math.Between(
                    this.Tree.x - 250,   
                    this.Tree.x + 250      
                );

                const randomY = Phaser.Math.Between(
                    this.Tree.y / 3,      // upper branches
                    this.Tree.y - 40      // lower branches
                );

                const apple = this.apples.create(randomX, randomY, 'apple')
                    .setScale(0.012)
                    .setDepth(2);

                apple.body.setAllowGravity(false);
                this.physics.world.enable(apple);
                this.apples.add(apple);
            }
            
            this.physics.add.overlap(this.rikoWithBasket, this.apples.getChildren(), this.handleRikoAppleCollision, null, this);
        });
    }


    // Handle clicking a word
    onWordClick(index) {
        const apples = this.apples.getChildren();
        const apple = apples[index];
        if (!apple) return;

        const targetX = apple.x; // store x BEFORE movement

        // Enable gravity
        apple.body.setAllowGravity(true);
        apple.body.setVelocityX(0); // safety

        // Apple fall
        this.tweens.add({
            targets: apple,
            y: this.height - 130,
            duration: 800,
            ease: 'Linear',
            onComplete: () => {
                apple.destroy();   
            }
        });

        // Move Riko under apple
        this.tweens.add({
            targets: this.rikoWithBasket,
            x: targetX,
            duration: 600,
            ease: 'Power2'
        });

        this.wordButtons[index].disableInteractive();
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
