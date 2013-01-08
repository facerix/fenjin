/***************************/
//@Author: Ryan Corradini
//@website: buyog.com
//@email: ryancorradini@yahoo.com
//@license: MIT (free to use & modify, but please keep this credits message)
/***************************/
dojo.provide("fen.Stage");

dojo.require("fen.ImageCache");
dojo.addOnLoad(function() {
    if (!window.imageCache) { window.imageCache = new fen.ImageCache(); }
});

dojo.declare("fen.Stage", null, {
    width: 320,
    height: 240,
    spriteSrc: '',
    canvas: null,
    ctx: null,
    constants: {
        floor: 210,
        floorZ: 190
    },

    constructor: function stage_constructor(args) {
        if ('spriteSrc' in args) {
            if (!(window.imageCache.hasImage(args.spriteSrc))) {
                window.imageCache.addImage( args.spriteSrc, args.spriteSrc );
            }
        }
        dojo.mixin(this,args);

        if (this.canvas) {
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            // get my drawing context
            this.ctx = this.canvas.getContext('2d');
            this.ctx.strokeStyle = "#4165b4";

            // gradient 1 (back wall)
            this.grad1 = this.ctx.createLinearGradient(0,0,0,this.constants.floorZ);
            this.grad1.addColorStop(0, '#00145a');
            this.grad1.addColorStop(0.5, '#1030ac');
            this.grad1.addColorStop(1, '#184ce6');

            // gradient 2 (floor)
            this.grad2 = this.ctx.createLinearGradient(0,this.constants.floorZ,0,this.height);
            this.grad2.addColorStop(0, '#102080');
            this.grad2.addColorStop(0.5, '#1030ac');
            this.grad2.addColorStop(1, '#1840d4');

        } else {
            // TODO: complain if I can't find stuff I need in the arguments bag
            console.error('cannot get context!');
        }
    },

    update: function sprite_update() {
        // TODO: run anim ticks for all background layers, calculate parallax scrolling, etc.
    },

    draw: function stage_draw() {
        if (this.ctx) {
            // back wall
            this.ctx.fillStyle = this.grad1; //"#113399";
            this.ctx.fillRect(0,0,this.width,this.constants.floorZ);

            // floor
            this.ctx.fillStyle = this.grad2; //"#001166";
            this.ctx.fillRect(0,this.constants.floorZ,this.width,this.height-this.constants.floorZ);


            // wall rects (25x25)
            this.ctx.beginPath();
            for (var x=25; x<this.width-25; x += 25) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.constants.floorZ);
            }
            for (var y=25; y<this.constants.floorZ; y += 25) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
            }

            // floor lines
            this.ctx.moveTo(0, this.constants.floorZ);
            this.ctx.lineTo(this.width, this.constants.floorZ);
            this.ctx.moveTo(0, this.constants.floorZ+5);
            this.ctx.lineTo(this.width, this.constants.floorZ+5);
            this.ctx.moveTo(0, this.constants.floorZ+20);
            this.ctx.lineTo(this.width, this.constants.floorZ+20);
            this.ctx.moveTo(0, this.constants.floorZ+45);
            this.ctx.lineTo(this.width, this.constants.floorZ+45);
            this.ctx.stroke();
        }
    }
});
