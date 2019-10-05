setCanvas();

function getBrowserScreenWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}
  
function getBrowserScreenHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

window.addEventListener('resize', function() {
    setCanvas();
});

function setCanvas(){
    window.browserScreen = {width: getBrowserScreenWidth(), height: getBrowserScreenHeight()};

    window.canvas = document.getElementById('gameCanvas');
    canvas.setAttribute("width", browserScreen.width * 2);
    canvas.setAttribute("height", browserScreen.height * 2);

    window.context = canvas.getContext('2d');
    context.globalCompositeOperation = 'destination-over';
}

var images = new Array();
preloadImages([
    "/assets/track.png",
    "/assets/gray-bar.png",
    "/assets/pink-bar.png"
]);
var imagesLength;
var progress = 0;
var loaded = false;
function preloadImages(imagesToPreload){
    for(var i in imagesToPreload){
        images[imagesToPreload[i]] = new Image();
        images[imagesToPreload[i]].src = imagesToPreload[i];
    }
    imagesLength = Object.keys(images).length;
    for(var i in images){
        images[i].onload = imageLoadCheck;
    }
}
function imageLoadCheck() {
    if(!loaded){
        if (progress == imagesLength-1) {
            init();
            loaded = true;
        }else{
            progress++;
        }
    }
}

var worldObjects = new Array();
var updates = new Array();
var declares = new Array();
var inits = new Array();

function addScript(scriptDeclare, scriptInit, scriptUpdate = null){
    if(loaded){
        scriptDeclare();
        scriptInit();
    }else{
        inits.push(scriptInit);
        declares.push(scriptDeclare);
    }
    if(scriptUpdate != null){
        updates.push(scriptUpdate);
    }
}

function init() {
    for(var i in declares){
        declares[i]();
    }
    for(var i in inits){
        inits[i]();
    }
    window.requestAnimationFrame(update);
}

document.addEventListener('visibilitychange', function(e) {
    previousTime = new Date().getTime();
});

var previousTime = new Date().getTime();
var deltaTime = 0;
function update(){
    deltaTime = Math.min((new Date().getTime() - previousTime)/1000, 0.05);
    previousTime = new Date().getTime();

    for(var i in updates){
        updates[i]();
    }

    draw();

    window.requestAnimationFrame(update);
}

var globalAlpha = 1;
function draw() {
    context.clearRect(0, 0, browserScreen.width * 2, browserScreen.height * 2);

    for(var layer = 0; layer < worldObjects.length; layer++){
        for(var name in worldObjects[layer]){
            if(worldObjects[layer][name].component.id == 0){
                context.translate(browserScreen.width + (browserScreen.width * worldObjects[layer][name].position.x),
                browserScreen.height + (browserScreen.height * worldObjects[layer][name].position.y));
                context.rotate(worldObjects[layer][name].rotation * Math.PI / 180);
                context.translate(-worldObjects[layer][name].width/2, -worldObjects[layer][name].height/2);
            } else if(worldObjects[layer][name].component.name == "text"){
                context.textAlign = "center";
                context.font = worldObjects[layer][name].height + "px " + worldObjects[layer][name].component.font;
            }
    
            if(worldObjects[layer][name].alpha != null){
                context.globalAlpha = worldObjects[layer][name].alpha * globalAlpha;
                document.getElementById("gameContent").style.opacity = globalAlpha;
            }

            if(worldObjects[layer][name].component.id == 0){
                context.drawImage(worldObjects[layer][name].component.image, 0, 0, worldObjects[layer][name].width, worldObjects[layer][name].height);
            } else if(worldObjects[layer][name].component.name == "text"){
                context.fillText(worldObjects[layer][name].component.content, 
                    browserScreen.width + (browserScreen.width * worldObjects[layer][name].position.x), 
                    browserScreen.height + (worldObjects[layer][name].height * 0.4) + (browserScreen.height * worldObjects[layer][name].position.y));
            }
            
            context.globalAlpha = globalAlpha;

            if(worldObjects[layer][name].component.id == 0){
                context.translate(worldObjects[layer][name].width/2, worldObjects[layer][name].height/2);
                context.rotate(-worldObjects[layer][name].rotation * Math.PI / 180);
                context.translate(-(browserScreen.width + (browserScreen.width * worldObjects[layer][name].position.x)),
                    -(browserScreen.height + (browserScreen.height * worldObjects[layer][name].position.y)));
            }
        }
    }
}