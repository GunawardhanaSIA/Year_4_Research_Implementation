export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
    this.width = 0;
    this.height = 0;
  }

  preload() {
    // Load assets
    this.load.video('background', 'assets/videos/forest-bg.mp4');
    this.load.audio('bgmusic', 'assets/audio/bg-music.mp3');
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('start-btn', 'assets/images/start-btn.png');
    this.load.spritesheet('riko', 'assets/spritesheets/riko-waving.png', {
      frameWidth: 235,
      frameHeight: 273
    });
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

    const logo = this.add.image(this.width / 2, this.height / 2 - 100, 'logo');
    logo.setScale(0.65);

    const startBtn = this.add.image(this.width / 2, this.height / 2 + 220, 'start-btn')
    .setScale(0.3)
    .setInteractive({ useHandCursor: true });

    // Hover: make bigger
    startBtn.on('pointerover', () => {
        this.tweens.add({
            targets: startBtn,
            scale: 0.32,
            duration: 150,
            ease: 'Power1'
        });
    });

    // Hover out: shrink back
    startBtn.on('pointerout', () => {
        this.tweens.add({
            targets: startBtn,
            scale: 0.3,
            duration: 150,
            ease: 'Power1'
        });
    });

    // Click: animate and go to login page
    startBtn.on('pointerdown', () => {
        this.tweens.add({
            targets: startBtn,
            scale: 0.32,
            duration: 100,
            yoyo: true,
            ease: 'Power1',
            onComplete: () => {
                this.scene.start('LoginScene');   
            }
        });
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


    // Fade in effect
    this.cameras.main.fadeIn(500, 255, 255, 255);

    // Play background music
    // this.sound.play('bgmusic', {
    //   volume: 0.5,
    //   loop: true
    // });
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
