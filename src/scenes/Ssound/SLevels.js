export default class SLevel extends Phaser.Scene {
    constructor() {
        super("SLevel");
        this.width = 0;
        this.height = 0;
    }

    preload() {
        this.load.image("bg-levels", "assets/images/bg-levels.jpg");
    }

    create() {
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'bg-levels');
        background.setOrigin(0, 0);
        background.setDepth(-1);
        background.setDisplaySize(this.width, this.height);
    }

}
