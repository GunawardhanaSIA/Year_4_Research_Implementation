export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.width = 0;
        this.height = 0;
    }

    preload() {
        this.load.image("bg", "assets/images/bg-menu.jpg");
        this.load.video('bg-plain', 'assets/videos/bg-plain.mp4')
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Add background video
        const background = this.add.video(this.width/2, this.height/2, 'bg-plain');
        this.cameras.main.fadeIn(2000, 255, 255, 255)
        background.setMute(true);
        background.play(true);
        background.setLoop(true);
        background.setDepth(-1);
        this.handleVideoScaling(background);

        // Letters
        const vowels = ['A','E','I','O','U'];
        const consonants = ['S','C','D','F','G'];

        // Create cards using graphics
        this.createCard(this.width/4, this.height/2, 'Vowels', vowels); 
        this.createCard((this.width/4)*3, this.height/2, 'Consonants', consonants); 
    }



    createCard(x, y, title, letters) {
        const cardWidth = this.width / 2.5;
        const cardHeight = this.height * 3/4; 
        const buttonSize = 65;  
        const cols = 3;         // number of columns in grid
        const spacing = 15;

        const card = this.add.graphics();
        card.fillStyle(0xffffff, 0.8); 
        card.fillRoundedRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 20);

        // Card Border
        card.lineStyle(4, 0xffffff, 0.4);
        card.strokeRoundedRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 20);

        // Title Text
        const cardTitle = this.add.text(
            x,                     
            y - cardHeight/2 + 30, 
            title,
            {
                fontSize: '28px',
                color: '#805389',
                fontStyle: 'bold',
                fontFamily: "Comic Relief",
                letterSpacing: 1,
                stroke: '#ffffff',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setShadow(1, 2, '#9d9d9d', 3, true, true);

        // Calculate rows based on letters
        const rows = Math.ceil(letters.length / cols);

        // Calculate total grid size
        const gridWidth = cols * buttonSize + (cols - 1) * spacing;
        const gridHeight = rows * buttonSize + (rows - 1) * spacing;

        // Starting point to center the grid inside the card
        const startX = x - gridWidth / 2;

        // Grid of buttons
        letters.forEach((letter, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const buttonX = startX + col * (buttonSize + spacing) + buttonSize / 2;
            const buttonY = y - cardHeight/2 + 80 + row * (buttonSize + spacing) + buttonSize/2;

            // Button background
            const buttonBg = this.add.graphics();
            buttonBg.fillStyle(0xfff5d6, 1);
            buttonBg.fillRoundedRect(buttonX - buttonSize/2, buttonY - buttonSize/2, buttonSize, buttonSize, 20);
            buttonBg.lineStyle(2, 0xfade88);
            buttonBg.strokeRoundedRect(buttonX - buttonSize/2, buttonY - buttonSize/2, buttonSize, buttonSize, 20);

            // Letter text
            const buttonText = this.add.text(buttonX, buttonY, letter, {
                fontSize: '36px',
                color: '#fade88',
                fontStyle: 'bold',
                fontFamily: "Comic Relief",
                stroke: '#ffffff',
                strokeThickness: 3
            }).setOrigin(0.5);

            // Make button interactive
            buttonBg.setInteractive(
                new Phaser.Geom.Rectangle(buttonX - buttonSize/2, buttonY - buttonSize/2, buttonSize, buttonSize), 
                Phaser.Geom.Rectangle.Contains
            ) 
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LevelScene'); 
                });
            })
            .on('pointerover', () => buttonBg.setAlpha(0.7))
            .on('pointerout', () => buttonBg.setAlpha(1));
        });
    }



    handleVideoScaling(background) {
        background.once('play', () => {
            this.scaleVideoToFullScreen(background);
        });

        this.scale.on('resize', () => {
            this.scaleVideoToFullScreen(background);
        });
    }



    scaleVideoToFullScreen(bg) {
        const videoWidth = bg.video.videoWidth;
        const videoHeight = bg.video.videoHeight;

        if (!videoWidth || !videoHeight) return; // Avoid scaling before metadata is ready

        // Scale video proportionally to cover the entire screen
        const scale = Math.max(this.width / videoWidth, this.height / videoHeight);
        bg.setDisplaySize(videoWidth * scale, videoHeight * scale);
    }
}
