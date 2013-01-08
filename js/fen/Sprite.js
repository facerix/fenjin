/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/
dojo.provide("fen.Sprite");


/*

3/5/2012

Some thoughts on how better to structure this class

Core methods called from Fenjin:
.update()    -- for this tick, applies current user inputs and physics to determine current state and animtick
.draw()      -- draws player sprite (and any associated helpers/projectiles) according to current state/animtick
.input(keys) -- sets the player inputs to be considered on the next iteration of update()
  -- button-mashing may not work well with this input mechanism; we may need to move to a pressKey()/releaseKey() type of approach


fen.Stage
.constants = {
    floor: 190
}

*/


dojo.require("fen.ImageCache");
dojo.addOnLoad(function() {
    if (!window.imageCache) { window.imageCache = new fen.ImageCache(); }
});

dojo.declare("fen.Sprite", null, {
    pos: {x:0, y:0},
    _facing: 1,      /* 0: Left, 1: Right */
    const: {
        walkFwd: 4,
        walkBwd: 2,
        jumpUp: 2
    },
    _defaultState: 0,
    _state: 0,
    _animElem: 0,
    _animTime: 0,
    _stateDefs: {
        0: { stateNum: 0, name: 'default', nextState: 0, canMove: true, anim: [{x:0,y:0,t:5}] }
    },
    vel: {x:0,y:0},
    baseClass: "fen.Sprite",

    constructor: function sprite_constructor(args){
        if ('spriteSrc' in args) {
            if (!(window.imageCache.hasImage(args['spriteSrc']))) {
                window.imageCache.addImage( args['spriteSrc'], args['spriteSrc'] );
            }
        }
        dojo.mixin(this,args);

        this._startPosition = dojo.clone(this.pos);
        this._halfw = 8; //this.size.w / 2;
        this._halfh = 8; //this.size.h / 2;
    },
    toString: function sprite_str(){
        return this.declaredClass + " [Position: " + this.pos.x + "," + this.pos.y + "; State: " + this._state + "]";
    },
    update: function sprite_update(){
        if (this.isActive()) {
            // this move function is overly simplistic, and should have actual physics applied at some point
            var dir = -1;
            if (this.vel.x > 0) {
                dir = game.constants.direction.right;
            } else if (this.vel.x < 0) {
                dir = game.constants.direction.left;
            } else if (this.vel.y > 0) {
                dir = game.constants.direction.down;
            } else if (this.vel.y < 0) {
                dir = game.constants.direction.up;
            }


            if (dir != -1) {
                this._facing = dir;
                if (this.isControllable() && this.canMove()) {
                    this.pos.x += this.vel.x;  // * this._speed;
                    this.pos.y += this.vel.y;  // * this._speed;
                }
            }
        }
    },
    draw: function(ctx){
        var img = window.imageCache.getImage(this.spriteSrc),
            cut = this._animTick(),
            xpos = this.pos.x - cut.dx,
            ypos = this.pos.y - cut.dy;


        // animation tick count
        //console.log("draw(): _state ==",this._state, "; x,y == ", [xpos,ypos], "; cut params ==", cut);
        if (cut.x === -1 || cut.y === -1) { return; } // -1 in an anim is code for "don't draw me"
        ctx.drawImage(img, cut.x,cut.y,cut.w,cut.h, xpos,ypos, cut.w, cut.h);

        // draw any additional sprite elements I currently "own" (e.g. a swinging sword, etc)
        this.drawChildren(ctx);

        /* debug:
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(xpos,ypos,5,0,Math.PI*2,true);
        ctx.stroke();
        ctx.strokeRect(xpos,ypos,width,height);
        */
    },
    drawChildren: function sprite_drawChildren(ctx) { /* (implement in subclasses) */ },
    isActive: function isActive() {
        return true;
    },
    isControllable: function sprite_isControllable() {
        return (this._state in this._stateDefs) ? this._stateDefs[this._state].canMove : false;
    },
    _currentAnim: function _currentAnim() {
        return (this._state in this._stateDefs) ? this._stateDefs[this._state].anim : null;
    },
    _animTick: function _animTick() {
        var currentAnim = this._currentAnim(),
            currentElem = null,
            returnVal = {x:-1,y:-1,w:64,h:128,dx:0,dy:0,t:1},
            nextState = (this._state in this._stateDefs && 'nextState' in this._stateDefs[this._state]) ? this._stateDefs[this._state].nextState : -1;
        if (!currentAnim) {
            console.warn("Couldn't get current animation details for this sprite:",this);
            this.changeState( nextState );
            return returnVal;
        } else {
            if (this._animElem in currentAnim) {
                currentElem = currentAnim[this._animElem];
                returnVal = dojo.clone(currentElem);
            } else {
                console.warn("Couldn't get current animation element for this sprite:",this);
                this.changeState( nextState );
            }
        }

        // increment anim timer and determine next frame
        if (currentAnim && currentElem && this._animateCurrent()) {
            this._animTime++;
            //if ((currentElem.loopstart != true) || (this._animTime >= currentElem.t)) {
            if (this._animTime >= currentElem.t) {
                if (currentElem.loopstart) {
                    // loop back to the start of this elem
                    this._animTime = 0;
                } else {
                    // move on to next elem
                    this._animElem++;
                    if (this._animElem >= currentAnim.length) {
                        this.changeState( nextState );
                    } else {
                        this._animTime = 0;
                    }
                }
            }
        }

        return returnVal;
    },
    _animateCurrent: function _animateCurrent() {
        return (this._state != this._defaultState || this.vel.x || this.vel.y);
    },
    canMove: function() {
        var can_move = true;
        var dx = this.pos.x + this.vel.x;
        var dy = this.pos.y + this.vel.y;
        this.moveability = '';
        if (this.vel.x > 0) {
            // check for rightward movement
            can_move &= (dx+this._halfw < game.constants.screenBound.right);
            can_move &= (game.map) ? (game.map.canWalk(dx+this._halfw, dy)) : true;
            if (can_move) { this.moveability += 'x' }
        } else if (this.vel.x < 0) {
            // check for leftward movement
            can_move &= (dx-this._halfw > game.constants.screenBound.left);
            can_move &= (game.map) ? (game.map.canWalk(dx-this._halfw, dy)) : true;
            if (can_move) { this.moveability += 'x' }
        }
        if (this.vel.y > 0) {
            // check for downward movement
            can_move &= (dy+this._halfh < game.constants.screenBound.bottom);
            can_move &= (game.map) ? (game.map.canWalk(dx,dy+this._halfh)) : true;
            if (can_move) { this.moveability += 'y' }
        } else if (this.vel.y < 0) {
            // check for upward movement
            can_move &= (dy-this._halfh > game.constants.screenBound.top);
            can_move &= (game.map) ? (game.map.canWalk(dx,dy)) : true;
            if (can_move) { this.moveability += 'y' }
        }
        return this.moveability;    //can_move;
    },
    moveVector: function(vec){
        this.vel.x = vec.x * this.const.walkFwd;
        this.vel.y = vec.y * this.const.jumpUp;
    },
    die: function die() {
        if (1 in this._stateDefs) {
            this.changeState(1);
        }
    },
    stop: function stop() {
        this.vel.x;
        this.vel.y;
    },
    reset: function reset(){
        this.pos = dojo.clone(this._startPosition);
        this._facing = 1;
        this._state = this._defaultState;
        this._animElem = this._animTime = 0;
    },
    changeState: function changeState(index) {
        //console.log(this.declaredClass,".changeState(",index,")");
        if (index == -1) {
            // this is a signal that the sprite is ready to be destroyed
            dojo.publish("sprite.onTerminate", [this.declaredClass, this.baseClass, this.index]);
        } else if (index in this._stateDefs) {
            this._state = index;
            this._animElem = 0;
            this._animTime = 0;
        } else {
            console.log("Invalid state number:",index);
        }
    },
    clonePos: function sprite_clonePos() {
        return dojo.clone(this.pos);
    }
});
