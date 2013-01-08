/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

dojo.provide("fen.Fenjin");

dojo.require("fen.SoundManager");
dojo.require("fen.Player");
dojo.require("fen.Stage");

dojo.declare("fen.Fenjin", null, {
    currKeys: {},
    aButton: false,
    bButton: false,
    interval: 30,
    scale: 1,
    width: 320,
    height: 240,
    projectiles: [],
    stage: null,
    sounds: null,
    _bgCanvas: null,
    _bgCtx: null,
    _sprCanvas: null,
    _sprCtx: null,
    constructor: function game_constructor(args){
        dojo.mixin(this, args);

        // make sure required args got passed, and are valid
        if (this.stageCanvasID) {
            this._bgCanvas = dojo.byId(this.stageCanvasID);
            this.height = this._bgCanvas.height;
            this.width = this._bgCanvas.width;
            this._bgCtx = this._bgCanvas.getContext('2d');
            this.stage = new fen.Stage({
                canvas: this._bgCanvas
            });
        }
        if (this.spriteCanvasID) {
            this._sprCanvas = dojo.byId(this.spriteCanvasID);
            this._sprCtx = this._sprCanvas.getContext('2d');
        }

        //this.scale = args['scale'];

        this.constants = {
            direction: { left: 0, up: 1, right: 2, down: 3 },
            screenBound: {
                top: 0, left: 0,
                bottom: this.height,
                right: this.width
            }
        }
        this.sounds = new fen.SoundManager();
        this.player = new fen.Player({
            pos:{x:64,y:this.stage.constants.floor},
            scale:this.scale,
            size:{w:16,h:16},
            _facing:2,
            spriteSheet: {
                name: 'Sinestro',
                path: 'res/sinestro.png'
            }
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
        // move all active projectiles
        for (var j in this.projectiles) {
            if ("updatePosition" in this.projectiles[j]) { this.projectiles[j].updatePosition(); }
        }

        // apply player physics/etc
        if (this.player) {
            this.player.update();
        }

        // do sprite collision tests
        //this.doHitTests();

        // draw everything
        try {
            this.drawStage();
            this.drawSprites();
        } catch(e) {
            console.error("error drawing sprites:",e,"[in game_main()]");
            this.stop();
        }
    },
    drawStage: function game_drawStage() {
        if (this.stage) {
            this.stage.draw();
        } else {
            this._ctx.fillStyle = "#FFFFFF";
            this._ctx.fillRect(0,0,this.width,this.height);
        }
    },
    drawSprites: function game_drawSprites() {
        try {
            // clear context
            this._sprCtx.clearRect(0,0,this.width,this.height);

            // draw projectiles
            for (var k in this.projectiles) {
                this.projectiles[k].draw(this._sprCtx);
            }

            // draw player
            if (this.player) {
                this.player.draw(this._sprCtx);
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
    keyDown: function game_keyDown(e) {
        //console.log('keyDown:',e.keyCode);
        if (e.keyCode in this.currKeys) { return; }
        switch(e.keyCode){
            case 37: // left
            case 38: // up
            case 39: // right
            case 40: // down
            case 65: // A
            case 83: // S
            case 68: // D
            case 90: // Z (button 4)
            case 88: // X (button 5)
            case 67: // C (button 6)
                break;

            default:
                //console.log("ignoring pressed key:", e.keyCode);
                return;
        }
        this.player.keyDown(e.keyCode);
        this.currKeys[e.keyCode] = true;
    },
    keyUp: function game_keyUp(e) {
        //console.log('keyUp:',e.keyCode);
        if (e.keyCode in this.currKeys) {
            this.player.keyUp(e.keyCode);
            delete this.currKeys[e.keyCode];
        }
    },
    over: function gameOver() {
        // wipe the current screen & draw the "continue/save/retry?" screen
        this._bgCtx.fillStyle = "rgb(0,0,0)";
        this._bgCtx.fillRect(0,0, this.width, this.height);

        // clear the timer, stick a fork in me; I'm done.
        this.stop();
    }
});
