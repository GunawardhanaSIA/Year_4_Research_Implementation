export default class AuthenticationScene extends Phaser.Scene {
    constructor() {
        super("AuthenticationScene");
        this.isRegisterMode = false;
    }

    preload() {
        this.load.video('bg-plain', 'assets/videos/bg-plain.mp4');
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Background video
        const background = this.add.video(this.width / 2, this.height / 2, 'bg-plain');
        background.setMute(true).play(true).setLoop(true).setDepth(-1);
        this.handleVideoScaling(background);

        this.cameras.main.fadeIn(2000, 255, 255, 255);

        // Create main UI
        this.createAuthCard();

        // Create HTML input fields
        this.createHtmlInputs();
    }

    createAuthCard() {
        const x = this.width / 2;
        const y = this.height / 2;
        const cardWidth = 350;
        const cardHeight = 400;

        // Card background
        this.cardBg = this.add.graphics();
        this.cardBg.fillStyle(0xffffff, 0.7);
        this.cardBg.fillRoundedRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 65);
        this.cardBg.lineStyle(3, 0x805389, 0.7);
        this.cardBg.strokeRoundedRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 65);

        // Title
        this.cardTitle = this.add.text(x, y - cardHeight / 2 + 40, 'Log In', {
            fontSize: '30px',
            color: '#805389',
            fontStyle: 'bold',
            fontFamily: "Comic Relief",
            letterSpacing: 1
        })
        .setOrigin(0.5)
        .setShadow(1, 2, '#9d9d9d', 3, true, true);


        // Store text reference for button
        this.actionButtonText = this.add.text(0, 0, 'Log In', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: "Comic Relief",
            letterSpacing: 1,
            fontStyle: 'bold'
        }).setShadow(1, 2, '#9d9d9d', 3, true, true);

        this.actionButton = this.rexUI.add.label({
            x: this.width / 2,
            y: this.height / 2 + 100,
            background: this.rexUI.add.roundRectangle(0, 0, 300, 80, 20, 0x805389),
            text: this.actionButtonText,
            space: { left: 35, right: 35, top: 15, bottom: 15 },
        })
        .layout()
        .setInteractive()
        .on('pointerdown', () => {
            const username = document.getElementById('usernameInput').value;
            const password = document.getElementById('passwordInput').value;
            const age = document.getElementById('ageSelect').value;
            console.log('Username:', username);
            console.log('Password:', password);
            console.log('Age:', age);

            document.getElementById('login-form').style.display = 'none';
            this.scene.start('MenuScene');
        });


        // Store text reference for toggle button
        this.toggleButtonText = this.add.text(0, 0, 'Don\'t have an account ?', {
            fontSize: '16px',
            color: '#9d9d9d',
            fontFamily: "Comic Relief",
            letterSpacing: 1,
        });

        this.toggleButton = this.rexUI.add.label({
            x: this.width / 2,
            y: this.height / 2 + 150,
            text: this.toggleButtonText
        })
        .layout()
        .setInteractive()
        .on('pointerdown', () => {
            this.toggleAuthMode();
        });
    }

    createButton(x, y, text, callback) {
        const width = 180;
        const height = 50;
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x805389, 1);
        buttonBg.fillRoundedRect(x - width / 2, y - height / 2, width, height, 20);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '22px',
            color: '#fff'
        }).setOrigin(0.5);

        const button = this.add.container(0, 0, [buttonBg, buttonText])
            .setSize(width, height)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                buttonBg.clear();
                buttonBg.fillStyle(0x9963a0, 1);
                buttonBg.fillRoundedRect(x - width / 2, y - height / 2, width, height, 20);
            })
            .on('pointerout', () => {
                buttonBg.clear();
                buttonBg.fillStyle(0x805389, 1);
                buttonBg.fillRoundedRect(x - width / 2, y - height / 2, width, height, 20);
            })
            .on('pointerdown', callback);

        return button;
    }

    toggleAuthMode() {
        this.isRegisterMode = !this.isRegisterMode;

        if (this.isRegisterMode) {
            this.cardTitle.setText('Register');
            this.actionButtonText.setText('Register'); // Use direct reference
            this.toggleButtonText.setText('Back to Login'); // Use direct reference
            document.getElementById('usernameInput').placeholder = 'Enter email';
            document.getElementById('passwordInput').placeholder = 'Create password';
            document.getElementById('ageSelect').style.display = 'block';
        } else {
            this.cardTitle.setText('Log In');
            this.actionButtonText.setText('Log In');
            this.toggleButtonText.setText('Register');
            document.getElementById('usernameInput').placeholder = 'Enter username';
            document.getElementById('passwordInput').placeholder = 'Enter password';
            document.getElementById('ageSelect').style.display = 'none';
        }
    }

    createHtmlInputs() {
        // Create container div for login form
        const formDiv = document.createElement('div');
        formDiv.id = 'login-form';
        formDiv.style.position = 'absolute';
        formDiv.style.top = '38%';
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
        
        // Age dropdown
        const ageSelect = document.createElement('select');
        ageSelect.id = 'ageSelect';
        ageSelect.style.width = '100%';
        ageSelect.style.height = '40px';
        ageSelect.style.fontSize = '20px';
        ageSelect.style.fontFamily = 'Comic Relief';
        ageSelect.style.fontWeight = 'bold';
        ageSelect.style.color = '#805389';
        ageSelect.style.letterSpacing = '1px';
        ageSelect.style.marginBottom = '15px';
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

        // Hide by default (only show in Register mode)
        ageSelect.style.display = 'none';

        // Append inputs to form div
        formDiv.appendChild(usernameInput);
        formDiv.appendChild(passwordInput);
        formDiv.appendChild(ageSelect);

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
