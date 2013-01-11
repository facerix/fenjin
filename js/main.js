/* main page code (basically just bootstraps Fenjin engine) */

dojo.addOnLoad(function init_loader(){

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

    // hide the "please wait" throbber
    dojo.style("throbber","display","none");

    game.start();

    // hook up the keyboard event handlers for player input
    dojo.connect(window, "onkeydown", game, game.keyDown);
    dojo.connect(window, "onkeyup", game, game.keyUp);
}

