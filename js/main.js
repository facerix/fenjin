/* main page code (basically just bootstraps Fenjin engine) */

dojo.addOnLoad(function init_loader(){
    window.noSound = false;
    window.sounds = {
        'bgm'    : dojo.byId('sndBGM'),
        'item'   : dojo.byId('sndItem'),
        'stairs' : dojo.byId('sndStairs'),
        'win'    : dojo.byId('sndWin')
    }
    // hack to make background music continuous-loop
    if (sounds.bgm && typeof sounds.bgm.loop != 'boolean') {
        dojo.connect(sounds.bgm, "onended", function() {
            this.currentTime = 0;
            this.play();
        });
    }
    dojo.connect(sounds.item, 'onended', snd_ended);
    dojo.connect(sounds.stairs, 'onended', snd_ended);

    // before ANYTHING else, see if we can get a canvas context
    var big_canvas = dojo.byId('stageCanvas');
    if (big_canvas.getContext) {
        dojo.require("fen.Preloader");
        dojo.addOnLoad(preload);
    } else {
        // hide the "please wait" throbber & info pane
        dojo.style("throbber","display","none");
        dojo.style("infoPane","display","none");
        // display an "o noes" message about the user's lack of canvasness
        dojo.style("messages","top","80px");
        game_message("Rats! It looks like your browser doesn't support HTML5 Canvas or Audio.\nSorry, I can't help you.\nYou could always try me in a newer browser, though. Even IE9.\nYes, really.");
    }
}); // end of init_loader()

function preload() {
    window.loader = new fen.Preloader({
      images: {
      },
      modules: [
        "fen.Fenjin"
      ]
    })

    if (loader.ready()) {
        init_game();
        delete window.loader;
    } else {
        var listener = dojo.subscribe("fen.Preloader.onReady", function() {
            dojo.unsubscribe(listener);
            init_game();
            delete window.loader;
        });
    }
} // end of preload()

function init_game() {
    window.game = new fen.Fenjin({
        stageCanvasID : "stageCanvas",
        spriteCanvasID: "spriteCanvas"
    });
    dojo.connect(game, "gameStart", game_start);
    dojo.connect(game, "message", game_message);
    dojo.connect(game, "getItem", game_gotItem);
    dojo.connect(game, "gameover", game_over);

    // hide the "please wait" throbber
    dojo.style("throbber","display","none");

    game.start();

    // hook up the keyboard event handlers for player input
    dojo.connect(window, "onkeydown", game, game.keyDown);
    dojo.connect(window, "onkeyup", game, game.keyUp);
}

function game_start() {
    if (!(noSound)) {
        sounds.bgm.currentTime = 0;
        sounds.bgm.play();
    }
}
function nosound_onclick() {
    sounds.bgm.pause();
    window.noSound = true;
}

function game_message(msg) {
    dojo.byId('messages').innerHTML = msg.replace(/\n/g,"<p/>");
}

function game_gotItem(itm) {
    if (!(noSound)) {
        sounds.bgm.pause();
        if (itm)
        sounds.item.play();
    }
}
function snd_ended() {
    if (!(noSound)) {
        sounds.bgm.play();
    }
}
function play_stairs_sound() {
    if (!(noSound)) {
        sounds.bgm.pause();
        sounds.stairs.play();
    }
}

function game_over() {
    if (!(noSound)) {
        sounds.bgm.pause();
        sounds.win.play();
    }
}
