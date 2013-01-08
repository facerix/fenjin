/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

dojo.provide("fen.SpriteDemo");

dojo.require("fen.Player");

dojo.declare("fen.SpriteDemo", null, {
    currDirKey: 0,
    aButton: false,
    bButton: false,
    interval: 30,
    scale: 1,
    projectiles: [],
    constructor: function game_constructor(args){
        dojo.mixin(this, args);
        //this.ctx = args['context'];
        this.ctx.fillStyle = "#FCD8A8";
        //this.scale = args['scale'];

        this.constants = {
            direction: { left: 0, up: 1, right: 2, down: 3 },
            screenBound: {
                top: 0, left: 0,
                bottom: this.height,
                right: this.width
            }
        }
        this.player = new fen.Player({
            pos:{x:64,y:64}, scale:this.scale, size:{w:16,h:16}, _facing:2
        });
        this.spriteListener = dojo.subscribe("sprite.onTerminate", function(spriteClass, index) {
            //console.log("caught sprite.onTerminate(",spriteClass, index, ")");
            if (spriteClass == "fen.Player") {
                //game.over();
                //alert('game over!');      // for some reason this is firing over and over again...
            }
        });
        this.projectileListener = dojo.subscribe("monster.onAttack", function(spriteClass, index) {
            //console.log("caught monster.onAttack(",spriteClass, index, ")");
            if (index != 'undefined' && game.monsters[index]) {
                var newProj = game.monsters[index].getProjectile();
                if (newProj) {
                    //console.log("got projectile:", newProj);
                    newProj.index = game.projectiles.length;
                    game.projectiles.push(newProj);
                }
            }
        });
    },
    main: function game_main() {
        // draw everything
        try {
            this.drawMap();
            this.drawSprites();
        } catch(e) {
            console.error("error drawing sprites:",e,"[in game_main()]");
            this.stop();
        }

        // move all active projectiles
        for (var j in this.projectiles) {
            if ("updatePosition" in this.projectiles[j]) { this.projectiles[j].updatePosition(); }
        }

        // do sprite collision tests
        //this.doHitTests();

        // apply physics

    },
    drawMap: function game_drawMap() {
        this.ctx.fillRect(0,0,160*this.scale,120*this.scale);
    },
    drawSprites: function game_drawSprites() {
        try {
            // draw projectiles
            for (var k in this.projectiles) {
                this.projectiles[k].draw(this.ctx);
            }

            // draw player
            if (this.player) {
                this.player.update();
                this.player.draw(this.ctx);
            }
        } catch(e) {
            console.error("error drawing sprites:",e,"[in game_drawSprites()]");
            this.stop();
        }
    },
    insertItem: function game_insertItem(itm) {
        if (itm) {
            if (!("_index" in itm) || !(itm._index)) {
                itm._index = this.items.length;
            }
            this.items.push(itm);
        }
    },
    insertProjectile: function game_insertProjectile(proj) {
        if (proj) {
            proj.index = this.projectiles.length;
            this.projectiles.push(proj);
        }
    },
    start: function game_start(interval_override) {
        if (interval_override) { this.interval = interval_override; }

        // start the main game loop
        if (!this._timerid) {
            this._timerid = setInterval("game.main()", this.interval);
        } else {
            console.log("Already started.");
        }
    },
    stop: function game_stop() {
        // stop the main game loop
        clearInterval( this._timerid );
        this._timerid = null;
    },
    setScale: function setScale(size) {
        if (size > 0 && size < 5) {
            this.scale = size;
            this.player.scale = size;
            //this.player.reset();
        }
    },
    keyDown: function game_keyDown(keyCode) {
        if (this.currDirKey == keyCode) { return; }
        var dx = dy = 0;
        switch(keyCode){
            case 39: // right
                dx = 1;
                break;
            case 37: // left
                dx = -1;
                break;
            case 38: // up
                //dy = -1;
                break;
            case 40: // down
                //dy = 1;
                break;

            case 88: // X (A button)
                if (!this.aButton) {
                    this.aButton = true;
                    this.player.attack();
                }
                break;
            case 90: // Z (B button)
                if (!this.bButton) {
                    this.bButton = true;
                    this.player.useItem();
                }
                break;

            default:
                //console.log("key pressed:", keyCode);
                break;
        }
        if (dx != 0 || dy != 0) {
            this.player.moveVector({x:dx,y:dy});
            this.currDirKey = keyCode;
        }
    },
    keyUp: function game_keyUp(keyCode) {
        switch(keyCode){
            case 39: // right
            case 37: // left
            case 38: // up
            case 40: // down
                if (this.currDirKey != keyCode) { return; }
                this.currDirKey = 0;
                this.player.stop();
                break;

            case 88: // X (A button)
                this.aButton = false;
                break;
            case 90: // Z (B button)
                this.bButton = false;
                break;

            default:
                break;
        }
    },
    pressStart: function pressStart() {
        // todo
    },
    pressSelect: function pressSelect() {
        // todo
    },
    over: function gameOver() {
        // wipe the current screen & draw the "continue/save/retry?" screen
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0,0, this.width*this.scale, this.height*this.scale);

        // clear the timer, stick a fork in me; I'm done.
        this.stop();
    }
});
