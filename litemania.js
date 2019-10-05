addScript(lmDeclare, lmInit, lmUpdate);

function lmDeclare(){

}

function lmInit(){
    track = new worldObject("Track", {id: 0, images: {default: "/assets/track.png"}}, {x: 0, y: 0}, 0, 1.5, 0, "track");
    track.spawn();
}

function lmUpdate(){

}