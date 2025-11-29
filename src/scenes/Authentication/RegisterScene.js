export default class RegisterScene extends Phaser.Scene {
    constructor() {
        super("RegisterScene");
        this.isRegisterMode = false;
    }

    preload() {
        this.load.video('background', 'assets/videos/forest-bg.mp4');
        this.load.image('register-btn', 'assets/images/register-btn.png');
        this.load.image('register-card', 'assets/images/register-card.png');
        this.load.image('riko-intro', 'assets/images/riko-intro.png');
        this.load.spritesheet('riko', 'assets/spritesheets/riko-waving.png', {
            frameWidth: 235,
            frameHeight: 273
        });
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Background video
        const background = this.add.video(this.width / 2, this.height / 2, 'background');
        background.setMute(true).play(true).setLoop(true).setDepth(-1);
        this.handleVideoScaling(background);

        this.cameras.main.fadeIn(500, 255, 255, 255);

        // Create main UI
        this.createRegisterCard();

        // Create HTML input fields
        this.createHtmlInputs();

        // Remove the form when the scene shuts down
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            const form = document.getElementById('register-form');
            if (form) form.remove();
        });
    }

    createRegisterCard() {
        const registerCard = this.add.image(this.width / 2, this.height / 2, 'register-card');
        registerCard.setScale(0.45);

        const registerBtn = this.add.image(this.width / 2, this.height / 2 + 110, 'register-btn')
        .setScale(0.17)
        .setInteractive({ useHandCursor: true });

        // Hover: make bigger
        registerBtn.on('pointerover', () => {
            this.tweens.add({
                targets: registerBtn,
                scale: 0.19,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Hover out: shrink back
        registerBtn.on('pointerout', () => {
            this.tweens.add({
                targets: registerBtn,
                scale: 0.17,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Click: animate and go to login page
        registerBtn.on('pointerdown', async () => {
            this.tweens.add({
                targets: registerBtn,
                scale: 0.19,
                duration: 100,
                yoyo: true,
                ease: 'Power1',
                onComplete: () => this.handleRegister()
            });
        });


        this.loginButton = this.rexUI.add.label({
            x: this.width / 2,
            y: this.height / 2 + 155,
            text: this.add.text(0, 0, 'Already have an account ?', {
                fontSize: '16px',
                color: '#6d6a6aff',
                fontFamily: "Comic Relief",
                letterSpacing: 1,
            })
        })
        .layout()
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('LoginScene');
        });


        this.anims.create({
            key: 'riko-wave',
            frames: this.anims.generateFrameNumbers('riko', { start: 3, end: 6 }),
            frameRate: 4,
            repeat: -1
        });

        this.riko = this.add.sprite(this.width / 2 - 220, this.height / 2 + 190, 'riko');
        this.riko.play('riko-wave');
        this.riko.setScale(1);


        this.welcomeText = this.add.image(this.width / 2 - 370, this.height / 2 + 70, 'riko-intro');
        this.welcomeText.setScale(0.17);
    }

    
    createHtmlInputs() {
        // Create container div for login form
        const formDiv = document.createElement('div');
        formDiv.id = 'register-form';
        formDiv.style.position = 'absolute';
        formDiv.style.top = '47%';
        formDiv.style.left = '50%';
        formDiv.style.transform = 'translate(-50%, -50%)';
        formDiv.style.width = '250px';
        formDiv.style.textAlign = 'center';
        formDiv.style.zIndex = 10;

        // Username input
        const usernameInput = document.createElement('input');
        usernameInput.id = 'usernameInput';
        usernameInput.type = 'text';
        usernameInput.placeholder = 'Enter Username';
        usernameInput.placeholder = 'Enter Username';
        usernameInput.style.width = '100%';
        usernameInput.style.height = '40px';
        usernameInput.style.fontSize = '20px';
        usernameInput.style.fontFamily = "Comic Relief";
        usernameInput.style.fontWeight = 'bold';
        usernameInput.style.letterSpacing = '1px';
        usernameInput.style.marginBottom = '10px';
        usernameInput.style.padding = '5px 10px';
        usernameInput.style.borderRadius = '20px';   
        usernameInput.style.border  = '1px solid #9d9d9d';   

        // Password input
        const passwordInput = document.createElement('input');
        passwordInput.id = 'passwordInput';
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Enter Password';
        passwordInput.style.width = '100%';
        passwordInput.style.height = '40px';
        passwordInput.style.fontSize = '20px';
        passwordInput.style.fontFamily = "Comic Relief";
        passwordInput.style.fontWeight = 'bold';
        passwordInput.style.letterSpacing = '1px';
        passwordInput.style.marginBottom = '10px';
        passwordInput.style.padding = '5px 10px';
        passwordInput.style.borderRadius = '20px';  
        passwordInput.style.border  = '1px solid #9d9d9d'; 

        // Age label
        const ageLabel = document.createElement('label');
        ageLabel.htmlFor = 'ageSelect';
        ageLabel.innerText = 'Age:';
        ageLabel.style.fontSize = '22px';
        ageLabel.style.letterSpacing = '1px';
        ageLabel.style.fontFamily = 'Comic Relief';
        ageLabel.style.fontWeight = 'bold';
        ageLabel.style.color = '#6f6e6eff';
        ageLabel.style.marginRight = '10px';
        ageLabel.style.display = 'inline-block';
        ageLabel.style.width = '80px'; 

        // Age dropdown
        const ageSelect = document.createElement('select');
        ageSelect.id = 'ageSelect';
        ageSelect.style.width = '100%';
        ageSelect.style.height = '50px';
        ageSelect.style.fontSize = '20px';
        ageSelect.style.fontFamily = 'Comic Relief';
        ageSelect.style.fontWeight = 'bold';
        ageSelect.style.letterSpacing = '1px';
        ageSelect.style.marginBottom = '10px';
        ageSelect.style.padding = '5px 10px';
        ageSelect.style.borderRadius = '20px';
        ageSelect.style.border = '1px solid #9d9d9d';

        // Add options 3 to 8
        for (let i = 3; i <= 8; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            ageSelect.appendChild(option);
        }

        const ageWrapper = document.createElement('div');
        ageWrapper.style.display = 'flex';
        ageWrapper.style.alignItems = 'center';
        ageWrapper.style.marginBottom = '15px';

        // Append label + dropdown
        ageWrapper.appendChild(ageLabel);
        ageWrapper.appendChild(ageSelect);
        
        // Append inputs to form div
        formDiv.appendChild(usernameInput);
        formDiv.appendChild(passwordInput);
        formDiv.appendChild(ageWrapper);

        // Append form to body
        document.body.appendChild(formDiv);
    }


    handleVideoScaling(background) {
        background.once('play', () => this.scaleVideoToFullScreen(background));
        this.scale.on('resize', () => this.scaleVideoToFullScreen(background));
    }
    

    scaleVideoToFullScreen(bg) {
        const vw = bg.video.videoWidth;
        const vh = bg.video.videoHeight;
        if (!vw || !vh) return;
        const scale = Math.max(this.width / vw, this.height / vh);
        bg.setDisplaySize(vw * scale, vh * scale);
    }
}
