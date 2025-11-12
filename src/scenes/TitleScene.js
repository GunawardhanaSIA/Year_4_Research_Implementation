export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
    this.width = 0;
    this.height = 0;
  }

  preload() {
    // Load assets
    this.load.video('background', 'assets/videos/bg-with-title.mp4');
    this.load.audio('bgmusic', 'assets/audio/bg-music.mp3');
  }

  create() {
    this.width = this.scale.width;
    this.height = this.scale.height;

    // Add background video
    const background = this.add.video(this.width / 2, this.height / 2, 'background');
    background.setMute(true);
    background.play(true);
    background.setLoop(true);
    background.setDepth(-1);
    this.handleVideoScaling(background);

    // Add game title
    // this.add.text(this.width / 2, this.height / 2 - 100, 'Tiny Talks', {
    //   fontSize: '80px',
    //   fontStyle: 'bold',
    //   color: '#805389',
    //   stroke: '#ffffff',
    //   strokeThickness: 10
    // }).setOrigin(0.5);



    // start button with rexUI
    const startButton = this.rexUI.add.label({
        x: this.width / 2,
        y: this.height / 2 + 150,

        background: this.rexUI.add
            .roundRectangle(0, 0, 200, 700, 20, 0x805389)
            .setStrokeStyle(2, 0xffffff), 

        text: this.add.text(0, 0, 'Start Game', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: "Comic Relief",
            letterSpacing: 1,
            fontStyle: 'bold'
        }).setShadow(1, 2, '#9d9d9d', 3, true, true),

        space: { left: 20, right: 20, top: 15, bottom: 15 }
    })
    .layout() // ✅ This is essential — positions and sizes all internal elements
    .setInteractive()
    .on('pointerdown', () => {
        this.cameras.main.fadeOut(500, 255, 255, 255);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('AuthenticationScene');
        });
    })
    .on('pointerover', () => {
        startButton.getElement('background').setFillStyle(0x9963a0);
    })
    .on('pointerout', () => {
        startButton.getElement('background').setFillStyle(0x805389);
    });

    

    // Fade in effect
    this.cameras.main.fadeIn(500, 255, 255, 255);

    // Play background music
    this.sound.play('bgmusic', {
      volume: 0.5,
      loop: true
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

    if (!videoWidth || !videoHeight) return;

    const scale = Math.max(this.width / videoWidth, this.height / videoHeight);
    bg.setDisplaySize(videoWidth * scale, videoHeight * scale);
  }
}
