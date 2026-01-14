export default class LevelScene extends Phaser.Scene {
    constructor() {
        super("LevelScene");
        this.width = 0;
        this.height = 0;
    }


    init(data) {
        this.selectedLetter = data.selectedLetter || null;
        console.log('Selected Letter:', this.selectedLetter);
    }


    preload() {
        this.load.image('level-scene-bg', 'assets/images/level-scene2.png');
        this.load.image('profile-icon', 'assets/images/profile-btn.png');
        this.load.image('logout-icon', 'assets/images/logout-btn.png');
        this.load.image('back-to-menu', 'assets/images/back-to-menu.png');
        this.load.image('Sound-btn', 'assets/images/sound-btn.png');
        this.load.image('Word-btn', 'assets/images/word-btn.png');
        this.load.image('Phrase-btn', 'assets/images/phrase-btn.png');
        this.load.image('Sentence-btn', 'assets/images/sentence-btn.png');
        this.load.image('Conversation-btn', 'assets/images/conversation-btn.png');
        this.load.image('P-banner', 'assets/images/P-banner.png');
        this.load.image('B-banner', 'assets/images/B-banner.png');
        this.load.image('H-banner', 'assets/images/H-banner.png');
        this.load.image('W-banner', 'assets/images/W-banner.png');
        this.load.image('S-banner', 'assets/images/S-banner.png');
        this.load.image('M-banner', 'assets/images/M-banner.png');
        this.load.spritesheet('riko', 'assets/spritesheets/riko-waving.png', {
            frameWidth: 235,
            frameHeight: 273
        });
    }


    create() {
        // Background
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'level-scene-bg')
            .setOrigin(0, 0)
            .setDepth(-10);

        // Correct way to get texture width/height
        const bgPicWidth = background.texture.getSourceImage().width;
        const bgPicHeight = background.texture.getSourceImage().height;

        // Scale to fit screen
        const scale = Math.max(this.width / bgPicWidth, this.height / bgPicHeight);

        background.setScale(scale);


        // Back to menu button
        const backToMenuBtn = this.add.image(90, 40, 'back-to-menu')
        .setScale(0.15)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('MenuScene'); 
                });
            })
        .on('pointerover', () => backToMenuBtn.setAlpha(0.7))
        .on('pointerout', () => backToMenuBtn.setAlpha(1));


        // Letter Banner
        const letterBanner = this.add.image(this.width / 5, this.height / 3, `${this.selectedLetter}-banner`)
        .setScale(0.28);

        // Profile button
        const profileIcon = this.add.image(this.width - 90, 40, 'profile-icon')
        .setScale(0.1)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('MenuScene'); 
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


        this.anims.create({
            key: 'riko-wave',
            frames: this.anims.generateFrameNumbers('riko', { start: 3, end: 6 }),
            frameRate: 4,
            repeat: -1
        });


        // Get current level
        // const token = localStorage.getItem('jwt'); 
        // let username = null;

        // if (token) {
        //     const payload = token.split('.')[1];
        //     const decodedPayload = JSON.parse(atob(payload));

        //     username = decodedPayload.username;
        //     console.log('Logged in user:', username);
        // } else {
        //     console.log('No user found, redirecting to login.');
        //     this.scene.start('LoginScene'); 
        //     return;
        // }

        // fetch("http://localhost:5000/api/progress/currentLevel", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         username: username,
        //         letter: this.selectedLetter
        //     })
        // })
        // .then(res => res.json())
        // .then(data => {
        //     this.currentLevel = data.currentLevel;  
        //     console.log('Current Level:', this.currentLevel);
            this.buildLevelButtons();              
        // }); 
    }



    buildLevelButtons() {
        const levelNames = ["Sound", "Word", "Sentence"];

        const levelPositions = [
            { x: this.width/2 + 100, y: this.height/2 - 180 },
            { x: this.width/2 - 65, y: this.height/2 - 35 },
            { x: this.width/2 + 105, y: this.height/2 + 180 },
        ];

        this.levelButtons = [];

        levelNames.forEach((name, index) => {
            const pos = levelPositions[index];    
            const key = `${name}-btn`;           
            const btn = this.add.image(pos.x, pos.y, key)
                .setScale(0.18);

            btn.levelName = name;
            btn.levelNumber = index + 1;

            if (btn.levelNumber > this.currentLevel) {
                btn.setTint(0x777777);   
                btn.setAlpha(0.4);      
                btn.setInteractive(false); 
            } else {
                btn.setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => {
                        this.cameras.main.fadeOut(1000, 255, 255, 255);
                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                            this.scene.start(`${btn.levelName}Game`, { selectedLetter: this.selectedLetter });
                        });
                    })
                    .on('pointerover', () => btn.setAlpha(0.7).setScale(0.19))
                    .on('pointerout', () => btn.setAlpha(1).setScale(0.18));
            }

            this.levelButtons.push(btn);

            if (btn.levelNumber === this.currentLevel) {
                const riko = this.add.sprite(btn.x - 90, btn.y - 20, 'riko')
                    .setScale(0.4)
                    .setDepth(-1);

                riko.play('riko-wave');
                this.currentLevelRiko = riko;
            }
        });
    }
}
