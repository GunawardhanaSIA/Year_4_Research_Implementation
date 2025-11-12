import SidePanel from "../../components/SidePanel.js";

export default class SWord extends Phaser.Scene {
    constructor() {
        super("SWord");
        this.width = 0;
        this.height = 0;
        this.totalDropsCreated = 0; 
        this.maxDrops = 10;
        this.words = [
            { key: "sun", text: "Sun" },
            { key: "sock", text: "Sock" },
            { key: "star", text: "Star" },
            { key: "snake1", text: "Snake" }
        ];
    }

    preload() {
        this.load.image("word-bg", "assets/images/word-bg.png");
        this.load.audio("start", "assets/audio/lets-go.mp3");
        this.load.image("bucket", "assets/images/bucket.png");
        this.load.image("water-drop", "assets/images/water-drop.png");
        this.load.image("pause", "assets/icons/pause.png");
        this.load.image("settings", "assets/icons/settings.png");
        this.load.image("quit", "assets/icons/back.png");

        // preload word images
        this.words.forEach(word => {
            this.load.image(word.key, `assets/images/${word.key}.png`);
        });
    }

    create() {
        // Stop bgmusic in this scene
        const bgMusic = this.sound.get('bgmusic'); 
        if (bgMusic) {
            bgMusic.stop();
        }


        // Background
        this.width = this.scale.width;
        this.height = this.scale.height;

        const background = this.add.image(0, 0, 'word-bg').setOrigin(0, 0).setDepth(-1);
        background.setDisplaySize(this.width, this.height);

        this.sidePanel = new SidePanel(this);

        // Add bucket
        this.bucket = this.physics.add.image(this.scale.width/2, 520, 'bucket').setScale(0.035);
        this.bucket.body.setAllowGravity(false).setCollideWorldBounds(true)
        this.bucketGlow = this.bucket.postFX.addGlow(0xffffff, 4, 0)

        //input
        this.cursorKeys = this.input.keyboard.createCursorKeys()

        this.waterDrops = this.add.group();
        this.createSingleDrop();

        // time event to spawn drops that speeds up as time goes by
        this.time.addEvent({
            delay: 4000,
            loop: true,
            callback: this.spawnRandomDrop,
            callbackScope: this
        })

        // collision detection between bucket and drop
        this.physics.add.overlap(this.bucket, this.waterDrops.getChildren(), this.handleBucketWaterCollision, null, this);
    }


    createSingleDrop() {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(-200, -20);

        // Create container (drop + word)
        const dropContainer = this.add.container(x, y);

        const drop = this.add.image(0, 0, "water-drop").setScale(0.05);
        dropContainer.add(drop);

        this.addWordToDrop(dropContainer);

        this.physics.world.enable(dropContainer);

        dropContainer.body.setVelocityY(Phaser.Math.Between(80, 140));
        dropContainer.body.setAllowGravity(false);

        dropContainer.setActive(true).setVisible(true);
        this.waterDrops.add(dropContainer);
    }


    addWordToDrop(dropContainer) {
        const randomWord = Phaser.Utils.Array.GetRandom(this.words);

        // Add image
        const wordImage = this.add.image(0, -5, randomWord.key).setScale(0.02);
        dropContainer.add(wordImage);

        // Add label
        const label = this.add.text(0, 40, randomWord.text, {
            fontSize: "16px",
            color: "#000",
            fontStyle: "bold"
        }).setOrigin(0.5);
        dropContainer.add(label);
    }



    update() {
        if (this.cursorKeys.left.isDown) {
            this.bucket.setVelocityX(-350)
        } else if (this.cursorKeys.right.isDown) {
            this.bucket.setVelocityX(350)
        } else {
            this.bucket.setVelocityX(0)
        }
        
        this.waterDrops.getChildren().forEach(child => {
            if (!child.active) return;
            
            if (child.y > this.scale.height + 50) {
                child.setActive(false).setVisible(false);
                if (child.body) child.body.enable = false;
            }
        });
    }


    spawnRandomDrop() {
        if (this.totalDropsCreated >= this.maxDrops) {
            return; // do not create new drops
        }
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = -20;

        this.createSingleDrop();
    }


    handleBucketWaterCollision(bucket, dropContainer) {
        // Stop all drops from moving
        this.waterDrops.getChildren().forEach(drop => {
            if (drop.body) drop.body.enable = false;
        });

        // blur the background
        this.blurOverlay = this.add.rectangle(0, 0, this.width, this.height, 0xffffff, 0.5)
            .setOrigin(0, 0)
            .setDepth(10);

        // Create pop-up card
        this.card = this.add.container(this.width/2, this.height/2).setDepth(11);

        // Optional background for card
        const cardBg = this.add.rectangle(0, 0, 450, 350, 0xffffff, 1);
        cardBg.setStrokeStyle(2, 0x9d9d9d);
        this.card.add(cardBg);

        const instruction = this.add.text(0, -cardBg.height / 2 + 50, "Let's say...", {
            fontSize: "32px",
            color: "#9d9d9d",
            fontStyle: "bold"
        }).setOrigin(0.5, 0.5);

        this.card.add(instruction);

        // Water drop image
        const dropImage = this.add.image(0, -20, dropContainer.list[1].texture.key).setScale(0.05);
        this.card.add(dropImage);

        // Word label
        const dropLabel = this.add.text(0, cardBg.height / 2 - 50, dropContainer.list[2].text, {
            fontSize: '40px',
            color: '#c41d1dff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.card.add(dropLabel);

        // Disable drop
        if (dropContainer.body) dropContainer.body.enable = false;
        dropContainer.setActive(false).setVisible(false);

        // add a button or input to resume the game
        this.input.once('pointerdown', () => {
            this.blurOverlay.destroy();
            this.card.destroy();

            // re-enable all drops
            this.waterDrops.getChildren().forEach(drop => {
                if (drop.body) drop.body.enable = true;
            });
        });
    }

}
