/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

dojo.provide("fen.SoundManager");

dojo.declare("fen.SoundManager", null, {
    sounds: {},
    _isReady: false,
    constructor: function preloader_constructor(args){
        dojo.mixin(this, args);

        // TODO: preload the sounds? or should Preloader do that for me?
    },
    ready: function soundManager_ready() {
        return this._isReady;
    },
    play: function soundManager_play(id) {
        // TODO
    },
    resumeAll: function soundManager_resumeAll() {
        // TODO
    }
});