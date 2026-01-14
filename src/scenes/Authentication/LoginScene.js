export default class LoginScene extends Phaser.Scene {
    constructor() {
        super("LoginScene");
        this.isRegisterMode = false;
    }

    preload() {
        this.load.video('background', 'assets/videos/forest-bg.mp4');
        this.load.image('login-btn', 'assets/images/login-btn.png');
        this.load.image('login-card', 'assets/images/login-card.png');
        this.load.image('welcome-back', 'assets/images/welcome-back.png');
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
        this.createLoginCard();

        // Create HTML input fields
        this.createHtmlInputs();

        // Remove the form when the scene shuts down
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            const form = document.getElementById('login-form');
            if (form) form.remove();
        });
    }

    createLoginCard() {
        const loginCard = this.add.image(this.width / 2, this.height / 2, 'login-card');
        loginCard.setScale(0.45);

        const loginBtn = this.add.image(this.width / 2, this.height / 2 + 90, 'login-btn')
        .setScale(0.17)
        .setInteractive({ useHandCursor: true });

        // Hover: make bigger
        loginBtn.on('pointerover', () => {
            this.tweens.add({
                targets: loginBtn,
                scale: 0.19,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Hover out: shrink back
        loginBtn.on('pointerout', () => {
            this.tweens.add({
                targets: loginBtn,
                scale: 0.17,
                duration: 150,
                ease: 'Power1'
            });
        });

        // Click: animate and go to login page
        loginBtn.on('pointerdown', async () => {
            this.tweens.add({
                targets: loginBtn,
                scale: 0.19,
                duration: 100,
                yoyo: true,
                ease: 'Power1',
                onComplete: () => this.handleLogin()
            });
        });


        this.registerButton = this.rexUI.add.label({
            x: this.width / 2,
            y: this.height / 2 + 135,
            text: this.add.text(0, 0, 'Don\'t have an account ?', {
                fontSize: '16px',
                color: '#6d6a6aff',
                fontFamily: "Comic Relief",
                letterSpacing: 1,
            })
        })
        .layout()
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('RegisterScene');
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


        this.welcomeText = this.add.image(this.width / 2 - 370, this.height / 2 + 70, 'welcome-back');
        this.welcomeText.setScale(0.17);
    }



    async handleLogin() {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            // const response = await fetch('http://localhost:5000/api/users/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ username, password })
            // });

            // const data = await response.json();

            // if (!response.ok) {
            //     alert(data.message || "Login failed");
            //     return;   
            // }

            // console.log('Login successful:', data);
            // localStorage.setItem('jwt', data.token);
            // document.getElementById('login-form').style.display = 'none';

            this.scene.start('MenuScene');
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    
    createHtmlInputs() {
        // Create container div for login form
        const formDiv = document.createElement('div');
        formDiv.id = 'login-form';
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
        usernameInput.style.color = "#805389";
        usernameInput.style.letterSpacing = '1px';
        usernameInput.style.marginBottom = '15px';
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
        passwordInput.style.marginBottom = '15px';
        passwordInput.style.padding = '5px 10px';
        passwordInput.style.borderRadius = '20px';  
        passwordInput.style.border  = '1px solid #9d9d9d'; 
        
        // Append inputs to form div
        formDiv.appendChild(usernameInput);
        formDiv.appendChild(passwordInput);

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
