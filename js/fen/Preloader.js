/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

dojo.provide("fen.Preloader");

dojo.require("fen.ImageCache");
dojo.addOnLoad(function() {
    if (!window.imageCache) { window.imageCache = new fen.ImageCache(); }
});

dojo.declare("fen.Preloader", null, {
    images: {},
    modules: [],
    _isReady: false,
    constructor: function preloader_constructor(args){
        dojo.mixin(this, args);

        for (var i in this.images) {
            // treat item as a key:value pair
            window.imageCache.addImage( i, this.images[i] );
        }
        for (i in this.modules) {
            // load each requested item and then register an OnLoad handler to be notified when they're all done
            dojo.require(this.modules[i]);
        }
        dojo.addOnLoad(function() {
            if (window.imageCache.ready()) {
                dojo.publish("fen.Preloader.onReady",[]);
            } else {
                this.listener = dojo.subscribe("fen.ImageCache.onReady", function() {
                    console.log("(preloader):: all images are now loaded and ready.");
                    dojo.unsubscribe(this.listener);
                    delete this.listener;
                    this._isReady = true;
                    dojo.publish("fen.Preloader.onReady",[]);
                });
            }
        });
    },
    ready: function preloader_ready() {
        return this._isReady;
    }
});