export default class LProgressGraphScene extends Phaser.Scene {
    constructor() {
        super("LProgressGraphScene");
        this.width = 0;
        this.height = 0;
    }


    preload() {
        this.load.image('graph-scene-bg', 'assets/images/ground.png');
        this.load.image('back-to-map', 'assets/images/back-to-map.png');
        this.load.image('graph-bg', 'assets/images/graph-bg.png');
        this.load.image('x-axis', 'assets/images/x-axis.png');
        this.load.image('y-axis', 'assets/images/y-axis.png');
        this.load.spritesheet('riko', 'assets/spritesheets/riko-waving.png', {
            frameWidth: 235,
            frameHeight: 273
        });
    }


    create() {
        // Background
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'graph-scene-bg')
            .setOrigin(0, 0)
            .setDepth(-10);

        // Correct way to get texture width/height
        const bgPicWidth = background.texture.getSourceImage().width;
        const bgPicHeight = background.texture.getSourceImage().height;

        // Scale to fit screen
        const scale = Math.max(this.width / bgPicWidth, this.height / bgPicHeight);

        background.setScale(scale);


        // Back to menu button
        const backToMenuBtn = this.add.image(90, 40, 'back-to-map')
        .setScale(0.15)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('LLevelScene'); 
                });
            })
        .on('pointerover', () => backToMenuBtn.setAlpha(0.7))
        .on('pointerout', () => backToMenuBtn.setAlpha(1));


        const graphBg = this.add.image(this.width / 2, this.height / 2, 'graph-bg')
        .setScale(0.55)
        .setDepth(1);

        const graph = this.add.graphics().setDepth(2);

        graph.lineStyle(2, 0x818181, 1);
        graph.strokeLineShape(
            new Phaser.Geom.Line(this.width / 2 - 450, this.height / 2 - 225, this.width / 2 - 450, this.height / 2 + 220)
        );
        graph.strokeLineShape(
            new Phaser.Geom.Line(this.width / 2 - 450, this.height / 2 + 220, this.width / 2 + 500, this.height / 2 + 220)
        );

        const data = [10, 30, 20, 50, 40, 60, 55, 70, 80, 75];

        graph.lineStyle(4, 0x5A8203, 1);

        const startX = this.width / 2 - 450;
        const startY = this.height / 2 + 220;
        const gapX = 100;
        const scaleY = 5;

        graph.beginPath();

        data.forEach((value, index) => {
            const x = startX + index * gapX;
            const y = startY - value * scaleY;

            if (index === 0) {
                graph.moveTo(x, y);
            } else {
                graph.lineTo(x, y);
            }
        });

        graph.strokePath();

        const xLabels = ["01/03", "01/04", "01/05", "01/06", "01/07", "01/08", "01/09", "01/10", "01/11", "01/12"];
        xLabels.forEach((label, i) => {
            const x = startX + i * gapX;
            this.add.text(x, startY+15, label, {
                fontSize: "20px",
                color: "#6F6043",
                fontFamily: "Arial"
            }).setOrigin(0.5, 0).setDepth(3);
        });

        for (let i = 0; i <= 80; i += 10) {
            const y = startY - i * scaleY;
            this.add.text(startX - 15, y, `${i}`, {
                fontSize: "20px",
                color: "#6F6043",
                fontFamily: "Arial"
            }).setOrigin(1, 0.5).setDepth(3);
        }


        const xAxisLabel = this.add.image(this.width / 2, startY + 55, "x-axis")
        .setScale(0.2)
        .setDepth(3);

        const yAxisLabel = this.add.image(startX - 60, this.height / 2, "y-axis")
        .setScale(0.23)
        .setDepth(3);
    }
}
