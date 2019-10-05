addScript(lmDeclare, lmInit, lmUpdate);

function lmDeclare(){
    window.bars = new Array();
    window.settings = {
        speed: 350,
    }
    window.config = {
        despawnPosY: 650,
        missPosY: 600
    }
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
    for(var i in bars){
        bars[i].position.y += deltaTime * settings.speed;
        if(bars[i].position.y > config.despawnPosY){
            bars[i].despawn();
        } else if(bars[i].position.y > config.missPosY){
            missBar(bars[i]);
        }
    }
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
    bar.alpha = 1;
    bars.push(bar);
    bar.spawn();
}

function missBar(bar){
    bar.width += deltaTime * 400;
    bar.height += deltaTime * 400;
    bar.alpha = Math.max(bar.alpha - (deltaTime * 10), 0);
}