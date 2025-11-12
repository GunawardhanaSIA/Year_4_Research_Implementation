import SidePanel from "../../components/SidePanel.js";

export default class SSound extends Phaser.Scene {
    constructor() {
        super("SSound");
    }

    preload() {
        this.load.video("bg", "assets/videos/sky-bg.mp4", "loadeddata", false, true);
        this.load.audio("start", "assets/audio/lets-go.mp3");
        this.load.image("balloon", "assets/images/balloon.png");
        this.load.image("pause", "assets/icons/pause.png");
        this.load.image("settings", "assets/icons/settings.png");
        this.load.image("quit", "assets/icons/back.png");
    }

    create() {
        // Stop bgmusic in this scene
        const bgMusic = this.sound.get('bgmusic'); 
        if (bgMusic) {
            bgMusic.stop();
        }


        // Background
        const bg = this.add.video(this.scale.width / 2, this.scale.height / 2, "bg");
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

        this.sidePanel = new SidePanel(this);

        this.startMic();

        this.startCountdown(() => {
            this.startBalloons(); // move balloon logic into a separate method
        });
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

        const countdownNumbers = ["3", "2", "1", "Go!"];
        let i = 0;

        const countdownText = this.add.text(centerX, centerY, "", {
            fontSize: "80px",
            fontFamily: "Inter",
            fontStyle: "bold",
            color: "#2299f5ff"
        }).setOrigin(0.5);

        const showNext = () => {
            if (i >= countdownNumbers.length) {
                countdownText.destroy();
                if (onComplete) onComplete(); // start game
                return;
            }

            countdownText.setText(countdownNumbers[i]);

            // Play audio only on "Go!"
            if (countdownNumbers[i] === "Go!") {
                const start = this.sound.add("start");
                start.play();
            }

            this.tweens.add({
                targets: countdownText,
                scale: { from: 0.5, to: 1.5 },
                alpha: { from: 0, to: 1 },
                duration: 500,
                yoyo: true,
                onComplete: () => {
                    i++;
                    showNext();
                }
            });
        };

        showNext();
    }



    startBalloons() {
        const balloonCount = 10;
        const startX = this.scale.width / 2;
        const startY = this.scale.height - 60;
        this.balloons = [];

        for (let i = 0; i < balloonCount; i++) {
            const clusterRadiusX = 100;
            const clusterRadiusY = 50;

            const x = startX + Phaser.Math.Between(-clusterRadiusX, clusterRadiusX);
            const y = startY + Phaser.Math.Between(-clusterRadiusY, 60);

            const balloon = this.add.image(x, y, "balloon").setOrigin(0.5).setScale(0.035);
            const letter = this.add.text(x, y, "s", {
                fontSize: "48px",
                fontFamily: "Inter",
                fontStyle: "bold",
                color: "#ffffff",
            }).setOrigin(0.5, 1.3);

            this.balloons.push({ balloon, letter });
        }

        let i = 0;
        const releaseBalloon = () => {
            if (i >= this.balloons.length) return;

            const { balloon, letter } = this.balloons[i];
            this.tweens.add({
                targets: [balloon, letter],
                y: -50,
                duration: 5000,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    balloon.destroy();
                    letter.destroy();
                    i++;
                    releaseBalloon();
                }
            });
        };

        this.time.delayedCall(500, () => releaseBalloon());
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

    createBalloon(x, y, onComplete) {
        // Balloon image
        const balloon = this.add.image(x, y, "balloon")
            .setOrigin(0.5)
            .setScale(0.035);

        // Letter on balloon
        const letter = this.add.text(x, y, "p", {
            fontSize: "48px",
            fontFamily: "Inter",
            fontStyle: "bold",
            color: "#ffffff",
        }).setOrigin(0.5, 1.3);

        // Animate both balloon and letter
        this.tweens.add({
            targets: [balloon, letter],
            y: -50, // float off top
            duration: 5000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                balloon.destroy();
                letter.destroy();
                if (onComplete) onComplete();
            }
        });
    }

    // Stop mic when scene shuts down (optional)
    shutdown() {
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
        }
    }
}
