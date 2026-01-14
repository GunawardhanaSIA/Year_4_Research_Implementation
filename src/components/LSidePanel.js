export default class LSidePanel {
    /**
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} topic - The topic text to display at the top of the panel
     */
    constructor(scene, topic = "") {
        this.scene = scene;
        this.topic = topic; // Dynamic topic
        this.panelWidth = 80; 
        this.panelColor = 0xffffff; // Black panel
        this.panelOpacity = 0.6;
        this.panelRadius = 10;

        this.createPanel();
        this.createTopic();
        this.createButtons();
    }

    preload() {
        this.load.image("pause", "assets/icons/pause.png");
        this.load.image("settings", "assets/icons/settings.png");
        this.load.image("quit", "assets/icons/back.png");
    }

    createPanel() {
        const { width, height } = this.scene.scale;
        this.panelHeight = height / 2;
        this.panelX = 0;
        this.panelY = (height - this.panelHeight) / 2;

        this.panel = this.scene.add.graphics();
        this.panel.fillStyle(this.panelColor, this.panelOpacity);

        // Draw panel as before
        this.panel.beginPath();
        this.panel.moveTo(this.panelX, this.panelY);
        this.panel.lineTo(this.panelX + this.panelWidth - this.panelRadius, this.panelY);
        this.panel.arc(
            this.panelX + this.panelWidth - this.panelRadius,
            this.panelY + this.panelRadius,
            this.panelRadius,
            Phaser.Math.DegToRad(-90),
            Phaser.Math.DegToRad(0),
            false
        );
        this.panel.lineTo(this.panelX + this.panelWidth, this.panelY + this.panelHeight - this.panelRadius);
        this.panel.arc(
            this.panelX + this.panelWidth - this.panelRadius,
            this.panelY + this.panelHeight - this.panelRadius,
            this.panelRadius,
            Phaser.Math.DegToRad(0),
            Phaser.Math.DegToRad(90),
            false
        );
        this.panel.lineTo(this.panelX, this.panelY + this.panelHeight);
        this.panel.closePath();
        this.panel.fillPath();

        this.panel.setDepth(10);
    }


    createTopic() {
        // Position relative to panel
        const centerX = this.panelX + this.panelWidth / 2;
        const centerY = this.panelY + this.panelHeight * 0.1; // 5% from top of panel

        // Bigger letter (e.g., "s")
        this.topicText = this.scene.add.text(
            centerX, // slightly left to adjust spacing
            centerY,
            this.topic,
            {
                fontSize: "32px",
                fontStyle: "bold",
                color: "#626060",
                fontFamily: "Arial"
            }
        ).setOrigin(0.5);

        // Smaller phoneme (e.g., "/s/")
        // this.smallLetter = this.scene.add.text(
        //     centerX - 22 + this.bigLetter.width,
        //     centerY,
        //     "/s/",
        //     {
        //         fontSize: "24px",
        //         fontStyle: "bold",
        //         color: "#9d9d9d",
        //         fontFamily: "Arial"
        //     }
        // ).setOrigin(0, 0.5);

        this.topicText.setDepth(11);
        // this.smallLetter.setDepth(11);
    }

    setTopic(newTopic) {
        this.topic = newTopic;
        this.topicText.setText(newTopic);
        // this.bigLetter.setText(bigLetter);
        // this.smallLetter.setText(phoneme);
        // Reposition the smallLetter next to bigLetter
        // this.smallLetter.x = this.bigLetter.x + this.bigLetter.width;
    }

    createButtons() {
        // Pause button at top inside panel
        const pauseIcon = this.scene.add.image(
            this.panelX + this.panelWidth / 2,
            this.panelY + this.panelHeight * 0.3, // 15% from top of panel
            "pause"
        ).setDisplaySize(40, 40)
        .setInteractive({ useHandCursor: true });
        pauseIcon.setDepth(12);
        pauseIcon.on("pointerdown", () => this.togglePause());

        // Bottom buttons (stacked at bottom inside panel)
        const bottomButtons = [
            { key: "settings", action: () => this.openSettings() },
            { key: "quit", action: () => this.quitGame() }
        ];

        const circleRadius = 20;
        const iconSize = 25;
        const buttonSpacing = 60;
        const startY = this.panelY + this.panelHeight * 0.85; // 85% from top

        bottomButtons.forEach((btn, i) => {
            const centerX = this.panelX + this.panelWidth / 2;
            const centerY = startY - i * buttonSpacing;

            // Draw circle background
            const circle = this.scene.add.graphics();
            circle.fillStyle(0xffffff);
            circle.fillCircle(centerX, centerY, circleRadius);
            circle.setDepth(11);

            // Add icon image
            const icon = this.scene.add.image(centerX, centerY, btn.key)
                .setDisplaySize(iconSize, iconSize)
                .setInteractive({ useHandCursor: true });
            icon.setDepth(12);

            // Hover effect
            icon.on("pointerover", () => circle.clear().fillStyle(0x00ff99, 0.9).fillCircle(centerX, centerY, circleRadius));
            icon.on("pointerout", () => circle.clear().fillStyle(0x555555, 0.7).fillCircle(centerX, centerY, circleRadius));

            icon.on("pointerdown", btn.action);
        });
    }




    togglePause() {
        if (this.scene.scene.isPaused()) {
            this.scene.scene.resume();
        } else {
            this.scene.scene.pause();
        }
    }

    openSettings() {
        alert("⚙ Settings panel coming soon!");
    }

    showMarks() {
        alert("🏆 Your marks will be displayed here!");
    }

    quitGame() {
        if (confirm("Are you sure you want to quit?")) {
            this.scene.scene.start("LLevelScene"); // Redirect to main menu
        }
    }
}
