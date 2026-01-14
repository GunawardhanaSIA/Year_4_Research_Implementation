export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.width = 0;
        this.height = 0;
    }

    preload() {
        this.load.video('background', 'assets/videos/forest-bg.mp4');
        this.load.image('word-card', 'assets/images/wood-card.png');
        this.load.image('profile-icon', 'assets/images/profile-btn.png');
        this.load.image('logout-icon', 'assets/images/logout-btn.png');
        this.load.image('consonant-card', 'assets/images/consonant-card.png');
        this.load.image('vowel-card', 'assets/images/vowel-card.png');
        this.load.image('letter-selection', 'assets/images/letter-selection.png');
        this.load.spritesheet('riko-thinking', 'assets/spritesheets/riko-thinking.png', {
            frameWidth: 274,
            frameHeight: 263
        });
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Add background video
        const background = this.add.video(this.width/2, this.height/2, 'background');
        this.cameras.main.fadeIn(2000, 255, 255, 255)
        background.setMute(true);
        background.play(true);
        background.setLoop(true);
        background.setDepth(-1);
        this.handleVideoScaling(background);

        // Letters
        const vowels = ['A','E','I','O','U'];
        const consonants = ['P','B','M','L','W','S'];

        // Create cards using graphics
        this.createCard(this.width/4, this.height/2, 'vowel-card', vowels); 
        this.createCard((this.width/4)*3, this.height/2, 'consonant-card', consonants); 

        this.anims.create({
            key: 'riko-thinking',
            frames: this.anims.generateFrameNumbers('riko-thinking', { start: 4, end: 36 }),
            frameRate: 4,
            repeat: -1
        });

        this.riko = this.add.sprite(this.width / 2 + 75, this.height / 2 + 150, 'riko-thinking');
        this.riko.play('riko-thinking');
        this.riko.setScale(1);

        this.thinkingText = this.add.image(this.width / 2 - 80, this.height / 2 - 25, 'letter-selection');
        this.thinkingText.setScale(0.2);


        // Profile button
        const profileIcon = this.add.image(this.width - 90, 40, 'profile-icon')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LevelScene'); 
                });
            })
        .on('pointerover', () => profileIcon.setAlpha(0.7))
        .on('pointerout', () => profileIcon.setAlpha(1));


        //Logout button
        const logoutIcon = this.add.image(this.width - 40, 40, 'logout-icon')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LevelScene'); 
                });
            })
        .on('pointerover', () => logoutIcon.setAlpha(0.7))
        .on('pointerout', () => logoutIcon.setAlpha(1));
    }



    createCard(x, y, cardName, letters) {
        const buttonSize = 90;  
        const cols = 3;         // number of columns in grid
        const spacing = 25;

        const card = this.add.image(x, y, cardName);
        card.setScale(0.55);

        // Calculate rows based on letters
        const rows = Math.ceil(letters.length / cols);

        // Calculate total grid size
        const gridWidth = cols * buttonSize + (cols - 1) * spacing;
        const gridHeight = rows * buttonSize + (rows - 1) * spacing;

        // Starting point to center the grid inside the card
        const startX = x - gridWidth / 2;

        const cardHeight = card.displayHeight;
        const startY = y - gridHeight / 2;

        // Grid of buttons
        letters.forEach((letter, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const buttonX = startX + col * (buttonSize + spacing) + buttonSize / 2;
            const buttonY = startY + row * (buttonSize + spacing);

            // Button background
            const buttonBg = this.add.image(buttonX, buttonY, 'word-card');
            buttonBg.setDisplaySize(buttonSize, buttonSize); // Optional
            buttonBg.setOrigin(0.5);
            
            // Letter text
            const buttonText = this.add.text(buttonX, buttonY, letter, {
                fontSize: '40px',
                color: '#E8FF1C',
                fontStyle: 'bold',
                fontFamily: "Comic Relief",
            }).setOrigin(0.5).setShadow(4, 4, '#333333', 2, false, true);

            // Make button interactive
            buttonBg.setInteractive({ useHandCursor: true }) 
            .on('pointerdown', async () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start(`${letter}LevelScene`);
                });
                // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, async () => {
                //     try {
                //         const token = localStorage.getItem('jwt'); 
                //         let username = null;

                //         if (token) {
                //             const payload = token.split('.')[1];
                //             const decodedPayload = JSON.parse(atob(payload));

                //             username = decodedPayload.username;
                //             console.log('Logged in user:', username);
                //         } else {
                //             console.log('No user found, redirecting to login.');
                //             this.scene.start('LoginScene'); 
                //             return;
                //         }
                       
                //         const response = await fetch('http://localhost:5000/api/progress/startLetter', {
                //             method: 'POST',
                //             headers: { 'Content-Type': 'application/json' },
                //             body: JSON.stringify({ username, letter })
                //         });

                //         const data = await response.json();

                //         if (!response.ok) {
                //             alert(data.message);
                //             return;   
                //         }

                //         console.log('Letter started successfully:', data);
                //         this.scene.start('LevelScene', { selectedLetter: letter });
                //     } catch (error) {
                //         console.error(`Error during starting letter ${letter}:`, error);
                //     } 
                // });
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
