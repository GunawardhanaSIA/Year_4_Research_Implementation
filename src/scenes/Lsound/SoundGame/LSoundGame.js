import LSidePanel from "../../../components/LSidePanel.js";

export default class LSoundGame extends Phaser.Scene {
    constructor() {
        super("LSoundGame");
    }

    preload() {
        this.load.video('background', 'assets/videos/forest-bg.mp4');
        this.load.audio("start", "assets/audio/lets-go.mp3");
        this.load.image("pause", "assets/icons/pause.png");
        this.load.image("settings", "assets/icons/settings.png");
        this.load.image("quit", "assets/icons/back.png");
        this.load.image("l-balloon1", "assets/images/l-balloon1.png");
        this.load.image("l-balloon2", "assets/images/l-balloon2.png");
        this.load.image("l-balloon3", "assets/images/l-balloon3.png");
        this.load.image("l-balloon4", "assets/images/l-balloon4.png");
        this.load.image("l-balloon5", "assets/images/l-balloon5.png");
        this.load.image('riko-raising-hand', 'assets/images/riko-raising-hand.png');
        this.load.image('star', 'assets/images/star.png');
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Stop bgmusic in this scene
        const bgMusic = this.sound.get('bgmusic'); 
        if (bgMusic) {
            bgMusic.stop();
        }


        // Background
        const bg = this.add.video(this.scale.width / 2, this.scale.height / 2, "background");
        bg.setDisplaySize(this.scale.width, this.scale.height);
        this.scaleVideoToFullScreen(bg);
        bg.play(true);
        bg.setLoop(true);
        bg.setDepth(-1);

        bg.once("play", () => {
            this.scaleVideoToFullScreen(bg);
        });

        this.scale.on("resize", () => {
            this.scaleVideoToFullScreen(bg);
        });

        this.sidePanel = new LSidePanel(this);
        this.sidePanel.setTopic("L /l/");

        this.startMic();

        this.currentBalloonIndex = 0;
        this.isReleasing = false;

        this.startCountdown(() => {
            const RikoRaisingHand = this.add.image(this.width / 2, this.height - 160, 'riko-raising-hand')
            .setScale(0.38)
            .setDepth(1);

            this.createBalloons(); 
            this.startBalloons(); 
        });

        this.starParticles = this.add.particles(0, 0, 'star', {
            speed: { min: 150, max: 300 },
            angle: { min: 0, max: 100 },
            scale: { start: 0.02, end: 0 },
            lifespan: 600,
            quantity: 10,
            on: false
        });  
        this.starParticles.setDepth(-10);  
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


    createBalloons() {
        this.balloons = [];

        const startX = this.scale.width * 0.4; 
        const startY = this.scale.height - 260;

        const offsets = [
            { x: 18, y: -1 },
            { x: 68, y: -40 },
            { x: 105,   y: -30 },
            { x: 100,  y: -30 },
            { x: 40,  y: 0 }
        ];

        for (let i = 0; i < 5; i++) {
            const balloon = this.add.image(
                startX + offsets[i].x,
                startY + offsets[i].y,
                `l-balloon${i + 1}`
            )
            .setScale(0.4)
            .setDepth(2)
            .setInteractive();

            balloon.on('pointerdown', () => {
                this.popBalloon(balloon);
            });

            this.balloons.push(balloon);
        }
    }


    startBalloons() {
        this.currentBalloonIndex = 0;
        this.releaseNextBalloon();
    }


    releaseNextBalloon() {
        if (this.currentBalloonIndex >= this.balloons.length) return;

        const balloon = this.balloons[this.currentBalloonIndex];
        this.isReleasing = true;

        this.tweens.add({
            targets: balloon,
            y: -60,
            duration: 10000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                if (balloon.active) {
                    balloon.destroy();
                }
                this.currentBalloonIndex++;
                this.isReleasing = false;
                this.releaseNextBalloon();
            }
        });
    }


    popBalloon(balloon) {
        this.tweens.killTweensOf(balloon);

        this.starParticles.setDepth(5);  
        this.starParticles.explode(10, balloon.x, balloon.y);

        this.tweens.add({
            targets: balloon,
            scale: 0,
            alpha: 0,
            duration: 200,
            ease: 'Back.easeIn',
            onComplete: () => {
                balloon.destroy();
                // If current balloon popped → release next immediately
                if (this.isReleasing) {
                    this.currentBalloonIndex++;
                    this.isReleasing = false;
                    this.releaseNextBalloon();
                }
            }
        });
    }


    scaleVideoToFullScreen(bg) {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        const videoWidth = bg.video.videoWidth;
        const videoHeight = bg.video.videoHeight;

        if (!videoWidth || !videoHeight) return; // Avoid scaling before metadata is ready

        // Scale video proportionally to cover the entire screen
        const scale = Math.max(gameWidth / videoWidth, gameHeight / videoHeight);
        bg.setDisplaySize(videoWidth * scale, videoHeight * scale);
    }

    // Stop mic when scene shuts down (optional)
    shutdown() {
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
        }
    }
}
