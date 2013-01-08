/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

dojo.require("fen.Sprite");
dojo.provide("fen.Player");

dojo.declare("fen.Player", fen.Sprite, {
    baseClass: "fen.Player",
    _hurtTimer: 0,
    _heldItem: null,
    const: {
        walkFwd: 3,
        walkBwd: 2.5,
        jumpUp: 2
    },
    health: 1000,
    power: 3000,

    constructor: function sprite_constructor(args){
        if (args.spriteSheet) {
            if (!(window.imageCache.hasImage(args.spriteSheet.name))) { window.imageCache.addImage(args.spriteSheet.name, args.spriteSheet.path); };
            this.spriteSrc = args.spriteSheet.name;

            dojo.mixin(this,args);
            this._stateDefs = {
                0: {stateno: 0, name: 'stand/walk', nextState: 0, canMove: true, anim: [
                    {x:1382,y:740,w:58,h:136,dx:27,dy:135,t:5}
                ]},

                10: {stateno: 10, name: 'stand to crouch', nextState: 11, canMove: false, anim: [
                    {x:1802,y:337,w:62,h:134,dx:21,dy:133,t:2},
                    {x:1703,y:107,w:81,h: 96,dx:35,dy:92,t:2},
                    {x:1338,y:392,w:87,h: 83,dx:40,dy:79,t:2}
                ]},
                11: {stateno: 11, name: 'crouch', nextState: 11, canMove: true, anim: [
                    {x:1156,y:368,w:92,h:82,dx:40,dy:72,t:16}
                ]},
                12: {stateno: 12, name: 'crouch to stand', nextState: 0, canMove: false, anim: [
                    {x:1338,y:392,w:87,h: 83,dx:40,dy:79,t:2},
                    {x:1703,y:107,w:81,h: 96,dx:35,dy:92,t:2}
                ]},
                20: {stateno: 20, name: 'walk fwd', nextState: 22, canMove: true, anim: [
                    {x:1500,y:721,w:57,h:131,dx:12,dy:130,t:2},
                    {x:1785,y:124,w:75,h:113,dx:32,dy:117,t:2},
                    {x:1239,y:805,w:68,h:114,dx:32,dy:121,t:10,loopstart:true}
                ]},
                21: {stateno: 21, name: 'walk back', nextState: 23, canMove: true, anim: [
                    {x:1161,y:706,w:77,h:126,dx:37,dy:132,t:2},
                    {x:1594,y:329,w:71,h:112,dx:43,dy:123,t:10,loopstart:true}
                ]},
                22: {stateno: 22, name: 'stop walking fwd', nextState: 0, canMove: false, anim: [
                    {x:1785,y:124,w:75,h:113,dx:32,dy:117,t:2},
                    {x:1500,y:721,w:57,h:131,dx:12,dy:130,t:2}
                ]},
                23: {stateno: 23, name: 'stop walking back', nextState: 0, canMove: false, anim: [
                    {x:1161,y:706,w:77,h:126,dx:37,dy:132,t:2}
                ]},
                210: {stateno: 210, name: 'spunch1', nextState: 0, canMove: false, anim: [
                    {x:1802,y:337,w:62,h:134, dx:21,dy:133, t:2},
                    {x:1249,y:368,w:88,h:122, dx:43,dy:127, t:2},
                    {x:1104,y:229,w:96,h:124, dx:43,dy:128, t:2},
                    {x:1061,y:395,w:94,h:124, dx:35,dy:128, t:3},
                    {x:1104,y:229,w:96,h:124, dx:43,dy:128, t:2},
                    {x:1249,y:368,w:88,h:122, dx:43,dy:127, t:2}
                ]},
                215: {stateno: 215, name: 'spunch1-alt', nextState: 0, canMove: false, anim: [
                    {x:1802,y:337,w:62,h:134, dx:21,dy:133, t:3},
                    {x:1737,y:337,w:64,h:130, dx:21,dy:129, t:7},
                    {x:907,y:512,w:104,h:120, dx:27,dy:129, t:9},
                    {x:1737,y:337,w:64,h:130, dx:21,dy:129, t:6}
                ]},
                220: {stateno: 220, name: 'spunch2', nextState: 0, canMove: false, anim: [
                    {x:1502,y:587,w: 64,h:133, dx:23,dy:130, t:3},
                    {x:1613,y:  0,w: 89,h:112, dx:45,dy:117, t:3},
                    {x:1426,y:420,w: 78,h:107, dx:35,dy:115, t:3},
                    {x: 480,y:148,w:138,h:111, dx:38,dy:120, t:3},
                    {x:   0,y:628,w:116,h:110, dx:36,dy:118, t:4},
                    {x:1502,y:587,w: 64,h:133, dx:23,dy:130, t:3}
                ]},
                230: {stateno: 230, name: 'spunch3', nextState: 0, canMove: false, anim: [
                    {x:117,y:512,w:116,h: 93, dx:62,dy:115, t:3},
                    {x:881,y:182,w:120,h:129, dx:65,dy:158, t:3},
                    {x:229,y:715,w:109,h:120, dx:59,dy:150, t:5},
                    {x:  0,y:739,w:112,h:118, dx:57,dy:142, t:4},
                    {x:117,y:715,w:111,h: 98, dx:50,dy:121, t:4}
                ]},
                240: {stateno: 240, name: 'skick1', nextState: 0, canMove: false, anim: [
                    {x:1192,y:570,w:84,h:121, dx:38,dy:122, t:2},
                    {x:1311,y:704,w:70,h:114, dx:18,dy:118, t:2},
                    {x:1427,y:306,w:85,h:113, dx:31,dy:118, t:3},
                    {x:1311,y:704,w:70,h:114, dx:18,dy:118, t:2},
                    {x:1192,y:570,w:84,h:121, dx:38,dy:122, t:2}
                ]},
                250: {stateno: 250, name: 'skick2', nextState: 0, canMove: false, anim: [
                    {x: 989,y:684,w: 88,h:114, dx:34,dy:126, t:3},
                    {x:1513,y:286,w: 80,h:113, dx:27,dy:124, t:3},
                    {x: 845,y:312,w:118,h:116, dx:20,dy:126, t:3},
                    {x:   0,y:512,w:116,h:115, dx:19,dy:125, t:3},
                    {x:1430,y:623,w: 66,h:116, dx:27,dy:126, t:3},
                    {x: 989,y:684,w: 88,h:114, dx:34,dy:126, t:3}
                ]},
                260: {stateno: 260, name: 'skick3', nextState: 0, canMove: false, anim: [
                    {x:1192,y:570,w: 84,h:121, dx:38,dy:122, t:2},
                    {x:1311,y:704,w: 70,h:114, dx:18,dy:118, t:2},
                    {x: 768,y:  0,w:134,h:112, dx:34,dy:120, t:8},
                    {x:1311,y:704,w: 70,h:114, dx:18,dy:118, t:2}
                ]},

                99999: { stateno: 99999, name: 'last state', nextState: -1, canMove: false, anim: [
                    {x:-1,y:-1,w:0,h:0,t:1}
                ]}
            };

        } else {
            // TODO: throw an error because args.spriteSheet is kind of crucial
            alert('arrrgh!');
        }
    },
    _animTick: function _animTick() {
        // decrement the "hurt" counter, if active
        if (this._hurtTimer) { this._hurtTimer--; }

        return this.inherited(arguments);
    },
    drawChildren: function player_drawChildren(ctx) {
        //if (this._state) { console.log("player.drawChildren(state:",this._state,")"); };

        //var halfSize = game.scale * 8;
        //var quarterSize = game.scale * 4;

        // determine what, if any, subordinate sprites to draw
        switch (this._state) {
            default:
                break;
        }
    },
    die: function die() {
        dojo.publish("player.onDie", []);
        this.inherited(arguments);
    },
    reset: function reset(){
        this.inherited(arguments);
        this.health = 1000; this.power = 3000;
    },
    _getAttackPos: function player_getAttackPos() {
        return dojo.clone(this.pos);
    },
    _getAttackVector: function player_attackVector() {
        var v = this.vel;
        if (v.x == 0 && v.y == 0) {
            switch (this._facing) {
                case game.constants.direction.left:
                    v = {x: -1, y: 0};
                    break;
                case game.constants.direction.up:
                    v = {x: 0, y: -1};
                    break;
                case game.constants.direction.right:
                    v = {x: 1, y: 0};
                    break;
                case game.constants.direction.down:
                    v = {x: 0, y: 1};
                    break;
            }
        }
        return v;
    },
    changeState: function player_changeState(index) {
        // do anything necessary here to transition from the old state to the new one

        /*
        if (this._state == 3 || this._state == 4) {
            // we were in "got item" state, resume the paused music now
            game.sounds.resumeAll();
            this._heldItem = null;  // no need to keep track of this anymore
        }
        */
        this.inherited(arguments);
    },
    keyUp: function player_keyUp(key) {
        //console.log('keyUp:',key);
        switch(key){
            case 37: // left
                if (this._state == 21) this.changeState(23);
                break;
            case 38: // up
                break;
            case 39: // right
                if (this._state == 20) this.changeState(22);
                break;
            case 40: // down
                if (this._state == 11) this.changeState(12);
                break;
            case 65: // A (button 1)
                break;
            case 83: // S (button 2)
                break;
            case 68: // D (button 3)
                break;
            case 90: // Z (button 4)
                break;
            case 88: // X (button 5)
                break;
            case 67: // C (button 6)
                break;

            default:
                // shouldn't ever get here
                return;
        }
    },
    keyDown: function player_keyDown(key) {
        if (this.isControllable()) {
            //console.log('keyDown:',key);
            switch(key){
                case 37: // left
                    this.changeState(21);
                    break;
                case 38: // up
                    break;
                case 39: // right
                    this.changeState(20);
                    break;
                case 40: // down
                    this.changeState(10);
                    break;
                case 65: // A (button 1)
                    this.changeState(210);
                    break;
                case 83: // S (button 2)
                    this.changeState(220);
                    break;
                case 68: // D (button 3)
                    this.changeState(230);
                    break;
                case 90: // Z (button 4)
                    this.changeState(240);
                    break;
                case 88: // X (button 5)
                    this.changeState(250);
                    break;
                case 67: // C (button 6)
                    this.changeState(260);
                    break;

                default:
                    // shouldn't ever get here
                    return;
            }
        }
    },
    getHit: function player_getHit(damage) {
        if (!this._hurtTimer) {
            game.sounds.play('hurt');
            this.health -= damage;
            this._hurtTimer = 50;
            if (this.health <= 0) {
                this.die();
            }
        }
    },
    killProjectile: function player_killProj(proj) {
        if (proj) {
            if ('index' in proj) { delete game.projectiles[proj.index]; }
            this._proj = null;
        }
    }
});