addScript(lmDeclare, lmInit, lmUpdate);

function lmDeclare(){
    window.bars = new Array();
    window.settings = {
        speed: 350,
    }
    window.config = {
        despawnPosY: 650,
        missPosY: 600,
        barSpawnPosY: -550,
        lane0PosX: -363,
        lane1PosX: -120,
        lane2PosX: 123,
        lane3PosX: 366
    }
}

var currentSong = null;

function lmInit(){
    track = new WorldObject("Track", {id: 0, images: {default: "/assets/track.png"}}, {x: 0, y: 0}, 0, 1.5, 1, "track");
    track.spawn();

    var song = new Song();
    song.addBar(0, 0);
    song.addBar(1, 1);
    song.addBar(2, 3);
    song.addBar(3, 2);

    startSong(song);
}

function startSong(song){
    currentSong = song;
    currentSong.reset();
}

function lmUpdate(){
    if(currentSong != null){
        currentSong.currentTime += deltaTime;
        if(currentSong.currentBeatmapPosition < currentSong.beatmap.length){
            if(currentSong.currentTime >= currentSong.beatmap[currentSong.currentBeatmapPosition].time){
                spawnBar(currentSong.beatmap[currentSong.currentBeatmapPosition].lane);
                currentSong.currentBeatmapPosition++;
            }
        }else{
            console.log("Song finished!");
            currentSong = null;
        }
    }

    for(var i in bars){
        bars[i].body.position.y += deltaTime * settings.speed;
        bars[i].fadeIn();
        if(bars[i].body.position.y > config.despawnPosY){
            bars[i].despawn();
        } else if(bars[i].body.position.y > config.missPosY){
            bars[i].missFadeOut();
        }
    }
}

function spawnBar(lane){
    var bar = new Bar(lane);
    bars.push(bar);
}

class Bar {
    constructor(lane){
        if(lane == 0){
            this.body = new WorldObject("Bar", {id: 0, images: {default: "/assets/gray-bar.png"}}, {x: config.lane0PosX, y: config.barSpawnPosY}, 0, 1.45, 0, "bar");
        }else if(lane == 1){
            this.body = new WorldObject("Bar", {id: 0, images: {default: "/assets/pink-bar.png"}}, {x: config.lane1PosX, y: config.barSpawnPosY}, 0, 1.45, 0, "bar");
        }else if(lane == 2){
            this.body = new WorldObject("Bar", {id: 0, images: {default: "/assets/pink-bar.png"}}, {x: config.lane2PosX, y: config.barSpawnPosY}, 0, 1.45, 0, "bar");
        }else{
            this.body = new WorldObject("Bar", {id: 0, images: {default: "/assets/gray-bar.png"}}, {x: config.lane3PosX, y: config.barSpawnPosY}, 0, 1.45, 0, "bar");
        }
        this.body.alpha = 0;
        this.body.spawn();
    }

    fadeIn = function(){
        this.body.alpha = Math.min(this.body.alpha + (deltaTime * 3), 1);
    }

    missFadeOut = function(){
        this.body.width += deltaTime * 400;
        this.body.height += deltaTime * 400;
        this.body.alpha = Math.max(this.body.alpha - (deltaTime * 10), 0);
    }

    despawn = function(){
        this.body.despawn();
    }
}

class Song {
    constructor(){
        this.barCount = 0;
        this.beatmap = new Array();
        this.currentTime = 0;
        this.currentBeatmapPosition = 0;
    }
    addBar = function(time, lane){
        this.beatmap[this.barCount++] = {time: time, lane: lane};
    }
    reset = function(){
        this.currentTime = 0;
        this.currentBeatmapPosition = 0;
    }
}