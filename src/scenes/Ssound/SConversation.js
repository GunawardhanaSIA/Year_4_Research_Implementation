import SidePanel from "../../components/SidePanel.js";

export default class SConversation extends Phaser.Scene {
    constructor() {
        super("SConversation");
    }

    preload() {
        this.load.video("forest", "assets/videos/forest-bg.mp4", "loadeddata", false, true);
        this.load.audio("start", "assets/audio/lets-go.mp3");
        this.load.image("bubble", "assets/images/speech-bubble.png");
        this.load.image("bear", "assets/images/bear.png");
        this.load.image("snake", "assets/images/snake.png");
        this.load.image("lion", "assets/images/lion.png");
        this.load.image("owl", "assets/images/owl.png");
        this.load.image("rabbit", "assets/images/rabbit.png");
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
        const bg = this.add.video(this.scale.width / 2, this.scale.height / 2, "forest");
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

        // === Conversation Data ===
        this.conversation = [
            { key: "bear", text: "Hey Snake! I smell some sweet berries nearby." },
            { key: "snake", text: "I ssslide slowly down the strong tree to see my friends." },
            { key: "lion", text: "Let’s share them, friends. Sharing makes us strong." },
            { key: "rabbit", text: "Such a sunny, special day for us all!" },
            { key: "owl", text: "I see them shining under the sun, just past the stones." }
        ];

        this.currentIndex = 0;
        this.animalSprites = [];
        this.activeGlow = null;

        this.showAnimals();
        this.showDialogue(0);
    }


    showAnimals() {
        const positions = [
            { x: this.scale.width * 3 / 8, y: this.scale.height * 2 / 3 + 30 },
            { x: this.scale.width - 130, y: this.scale.height / 2 - 200 },
            { x: this.scale.width * 6 / 8, y: this.scale.height - 150 },
            { x: this.scale.width / 5, y: this.scale.height - 100 },
            { x: this.scale.width * 1 / 3, y: this.scale.height * 1 / 4 }
        ];

        const scales = [0.12, 0.07, 0.85, 0.1, 0.08];

        this.conversation.forEach((data, i) => {
            const sprite = this.add.image(positions[i].x, positions[i].y, data.key)
                .setScale(scales[i])
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            sprite.on("pointerdown", () => {
                this.currentIndex = i;
                this.showDialogue(i);
            });

            this.animalSprites.push(sprite);
        });
    }


    showDialogue(index) {
        if (index < 0 || index >= this.conversation.length) return;

        // Cleanup
        if (this._dialogGroup) this._dialogGroup.destroy(true);
        if (this.activeOutline) {
            if (Array.isArray(this.activeOutline)) this.activeOutline.forEach(o => o.destroy());
            else this.activeOutline.destroy();
        }

        const data = this.conversation[index];
        const sprite = this.animalSprites[index];

        // Add white outline
        this.addWhiteOutline(sprite);

        const container = this.add.container(0, 0);
        this._dialogGroup = container;

        // Position the text above or below the sprite
        let textY = sprite.y - sprite.displayHeight * 0.8;
        if (textY < 0) textY = sprite.y + sprite.displayHeight * 0.8;

        // Add the text
        const dialogueText = this.add.text(sprite.x, textY, data.text, {
            fontSize: "20px",
            fontFamily: "Arial",
            color: "#000",
            wordWrap: { width: 250 },
            align: "center",
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: { x: 8, y: 5 }
        }).setOrigin(0.5);

        container.add(dialogueText);

        // Add play button
        const playBtn = this.add.text(sprite.x + targetWidth / 2.4, bubbleY + 20, "🔊", {
            fontSize: "26px"
        }).setInteractive({ useHandCursor: true }).setOrigin(0.5);
        playBtn.on("pointerdown", () => this.speakText(data.text));
        container.add(playBtn);

        container.setDepth(999);

        // === Auto next dialogue ===
        this.time.removeAllEvents();
        this.time.delayedCall(4000, () => {
            container.destroy(true);
            if (this.activeOutline) {
                if (Array.isArray(this.activeOutline)) this.activeOutline.forEach(o => o.destroy());
                else this.activeOutline.destroy();
            }
            this.currentIndex = (index + 1) % this.conversation.length;
            this.showDialogue(this.currentIndex);
        });
    }

    // === White outline around active animal ===
    addWhiteOutline(sprite) {
        if (this.activeOutline) {
            this.activeOutline.forEach(s => s.destroy());
        }

        const offsets = [
            { x: -3, y: 0 }, { x: 3, y: 0 },
            { x: 0, y: -3 }, { x: 0, y: 3 },
            { x: -2, y: -2 }, { x: 2, y: -2 },
            { x: -2, y: 2 }, { x: 2, y: 2 }
        ];

        const outlineSprites = offsets.map(offset => {
            return this.add.image(sprite.x + offset.x, sprite.y + offset.y, sprite.texture.key)
                .setScale(sprite.scale)
                .setTintFill(0xffff99)
                .setAlpha(0.9)
                .setDepth(sprite.depth - 1);
        });

        this.activeOutline = outlineSprites;
    }


    speakText(text) {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 0.9;
            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        } else {
            console.warn("Speech synthesis not supported in this browser.");
        }
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


    // startMic() {
    //     // Request microphone access
    //     navigator.mediaDevices.getUserMedia({ audio: true })
    //         .then(stream => {
    //             this.micStream = stream;
    //             console.log("Mic is on");
    //         })
    //         .catch(err => {
    //             console.error("Mic access denied", err);
    //         });
    // }


    // startCountdown(onComplete) {
    //     const centerX = this.scale.width / 2;
    //     const centerY = this.scale.height / 2;

    //     const countdownNumbers = ["3", "2", "1", "Go!"];
    //     let i = 0;

    //     const countdownText = this.add.text(centerX, centerY, "", {
    //         fontSize: "80px",
    //         fontFamily: "Inter",
    //         fontStyle: "bold",
    //         color: "#2299f5ff"
    //     }).setOrigin(0.5);

    //     const showNext = () => {
    //         if (i >= countdownNumbers.length) {
    //             countdownText.destroy();
    //             if (onComplete) onComplete(); // start game
    //             return;
    //         }

    //         countdownText.setText(countdownNumbers[i]);

    //         // Play audio only on "Go!"
    //         if (countdownNumbers[i] === "Go!") {
    //             const start = this.sound.add("start");
    //             start.play();
    //         }

    //         this.tweens.add({
    //             targets: countdownText,
    //             scale: { from: 0.5, to: 1.5 },
    //             alpha: { from: 0, to: 1 },
    //             duration: 500,
    //             yoyo: true,
    //             onComplete: () => {
    //                 i++;
    //                 showNext();
    //             }
    //         });
    //     };

    //     showNext();
    // }
}
