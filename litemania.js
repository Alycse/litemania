addScript(lmDeclare, lmInit, lmUpdate);

function lmDeclare(){

}

function lmInit(){
    track = new worldObject("Track", {id: 0, images: {default: "/assets/track.png"}}, {x: 0, y: 0}, 0, 1.5, 1, "track");
    track.spawn();

    spawnBar(0);
    spawnBar(1);
    spawnBar(2);
    spawnBar(3);
}

function lmUpdate(){

}

function spawnBar(position){
    if(position == 0){
        var bar = new worldObject("Bar", {id: 0, images: {default: "/assets/gray-bar.png"}}, {x: -363, y: -300}, 0, 1.45, 0, "bar");
    }else if(position == 1){
        var bar = new worldObject("Bar", {id: 0, images: {default: "/assets/pink-bar.png"}}, {x: -120, y: -100}, 0, 1.45, 0, "bar");
    }else if(position == 2){
        var bar = new worldObject("Bar", {id: 0, images: {default: "/assets/pink-bar.png"}}, {x: 123, y: 100}, 0, 1.45, 0, "bar");
    }else{
        var bar = new worldObject("Bar", {id: 0, images: {default: "/assets/gray-bar.png"}}, {x: 366, y: 300}, 0, 1.45, 0, "bar");
    }
    bar.spawn();
}