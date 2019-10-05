var worldObjectId = 0;

class worldObject{
    constructor(name, component, position, rotation, size, layer, tag){
        this.id = worldObjectId++;
        this.name = name;
        this.component = component;
        this.position = position;
        this.rotation = rotation;
        this.size = size / 1000;
        this.layer = layer;
        this.tag = tag;

        if(this.component.id == 0){
            this.component.image = window.images[this.component.images.default];
            this.width = this.component.image.naturalWidth * this.size * browserScreen.height;
            this.height = this.component.image.naturalHeight * this.size * browserScreen.height;
        }else{
            context.font = (this.size * 100 * browserScreen.height) + "px " + this.component.font;
            this.width = context.measureText(this.component.content).width;
            this.height = (this.size * 100 * browserScreen.height);
        }

        this.children = new Array();
    }

    changeImage = function(newImageSrc){
        if(this.component.assignedImageSrc != newImageSrc){
            this.component.assignedImageSrc = newImageSrc;
            var newImage = new Image();
            newImage.src = newImageSrc;
            newImage.onload = function(){
                this.component.image = newImage;
            }
        }
    }

    spawn = function(){
        if(worldObjects[this.layer] == null){
            worldObjects[this.layer] = new Array();
        }
        worldObjects[this.layer][this.id] = this;
        for(var i in this.children){
            this.children[i].layer = this.layer + 1;
            spawnWorldObject(this.children[i]);
        }
    }

    despawnWorldObject = function(){
        for(var i in this.children){
            despawnWorldObject(this.children[i]);
        }
        delete worldObjects[this.layer][this.id];
    }    
}

function intersects(lineA, lineB) {
    var x1 = lineA[0].x;
    var y1 = lineA[0].y;
    var x2 = lineA[1].x;
    var y2 = lineA[1].y;

    var x3 = lineB[0].x;
    var y3 = lineB[0].y;
    var x4 = lineB[1].x;
    var y4 = lineB[1].y;

    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return null;
    }
  
    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  
    if (denominator === 0) {
        return null;
    }
  
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
  
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return null;
    }
  
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
      
    return {x, y};
}

function getObjectLines(x, y, halfWidth, halfHeight, angle){
    var cos = Math.cos(angle * Math.PI / 180);
    var sin = Math.sin(angle * Math.PI / 180);

    var r1x = -halfWidth * cos - halfHeight * sin;
    var r2x =  halfWidth * cos - halfHeight * sin;
    var r1y = -halfWidth * sin + halfHeight * cos;
    var r2y =  halfWidth * sin + halfHeight * cos;

    var topLeft = {x: x - r2x, y: y - r2y};
    var topRight = {x: x - r1x, y: y - r1y};
    var bottomLeft = {x: x + r1x, y: y + r1y};
    var bottomRight = {x: x + r2x, y: y + r2y};

    return [ 
        [topLeft, topRight],
        [topRight, bottomRight],
        [bottomRight, bottomLeft],
        [bottomLeft, topLeft]
    ];
}

function isCollided(worldObjectA, worldObjectB, deltaY = 0){
    var worldObjectARealPosition = {x: browserScreen.width * worldObjectA.position.x, y: browserScreen.height * (worldObjectA.position.y + deltaY)};

    worldObjectATopEdge = worldObjectARealPosition.y - (worldObjectA.height/2);
    worldObjectABottomEdge = worldObjectARealPosition.y + (worldObjectA.height/2);
    worldObjectALeftEdge = worldObjectARealPosition.x - (worldObjectA.width/2);
    worldObjectARightEdge = worldObjectARealPosition.x + (worldObjectA.width/2);

    var worldObjectBRealPosition = {x: browserScreen.width * worldObjectB.position.x, y: browserScreen.height * worldObjectB.position.y};

    worldObjectBTopEdge = worldObjectBRealPosition.y - (worldObjectB.height/2);
    worldObjectBBottomEdge = worldObjectBRealPosition.y + (worldObjectB.height/2);
    worldObjectBLeftEdge = worldObjectBRealPosition.x - (worldObjectB.width/2);
    worldObjectBRightEdge = worldObjectBRealPosition.x + (worldObjectB.width/2);

    return !(worldObjectARightEdge < worldObjectBLeftEdge || worldObjectALeftEdge > worldObjectBRightEdge ||
        worldObjectATopEdge > worldObjectBBottomEdge || worldObjectABottomEdge < worldObjectBTopEdge);
}
function isCollidedComplex(worldObjectA, worldObjectB, deltaY = 0){
    var worldObjectARealPosition = {x: browserScreen.width * worldObjectA.position.x, y: browserScreen.height * (worldObjectA.position.y + deltaY)};

    var worldObjectALines = getObjectLines(worldObjectARealPosition.x, worldObjectARealPosition.y, 
        worldObjectA.width/2, worldObjectA.height/2, worldObjectA.rotation);
    
    var worldObjectBRealPosition = {x: browserScreen.width * worldObjectB.position.x, y: browserScreen.height * worldObjectB.position.y};

    var worldObjectBLines = getObjectLines(worldObjectBRealPosition.x, worldObjectBRealPosition.y, 
        worldObjectB.width/2, worldObjectB.height/2, worldObjectB.rotation);

    for(var j in worldObjectALines){
        for(var k in worldObjectBLines){
            var intersection = intersects(worldObjectALines[j], worldObjectBLines[k]);
            if(intersection != null){
                worldObjectB.lineAIntersection = worldObjectALines[j];
                worldObjectB.lineBIntersection = worldObjectBLines[k];
                worldObjectB.pointIntersection = intersection;
                return true;
            }
        }
    }

    return false;
}

function isCollidedGround(worldObjectA, worldObjectB, deltaY = 0){
    var worldObjectARealPosition = {x: browserScreen.width * worldObjectA.position.x, y: browserScreen.height * (worldObjectA.position.y + deltaY)};

    worldObjectATopEdge = worldObjectARealPosition.y - (worldObjectA.height/2);
    worldObjectABottomEdge = worldObjectARealPosition.y + (worldObjectA.height/2);
    worldObjectALeftEdge = worldObjectARealPosition.x - (worldObjectA.width/2);
    worldObjectARightEdge = worldObjectARealPosition.x + (worldObjectA.width/2);

    var worldObjectBRealPosition = {x: browserScreen.width * worldObjectB.position.x, y: browserScreen.height * worldObjectB.position.y};

    worldObjectBTopEdge = worldObjectBRealPosition.y - (worldObjectB.height/2);
    worldObjectBBottomEdge = worldObjectBRealPosition.y + (worldObjectB.height/2);
    worldObjectBLeftEdge = worldObjectBRealPosition.x - (worldObjectB.width/2);
    worldObjectBRightEdge = worldObjectBRealPosition.x + (worldObjectB.width/2);
    
    return !(worldObjectARightEdge < worldObjectBLeftEdge || worldObjectALeftEdge > worldObjectBRightEdge || 
        worldObjectABottomEdge - (deltaY*browserScreen.height)-groundCollisionAllowance > worldObjectBTopEdge || 
        worldObjectABottomEdge+groundCollisionAllowance < worldObjectBTopEdge);
}

function isCollidedTag(worldObjectA, worldObjectBTag, deltaY = 0){
    for(var i = 0; i < worldObjects.length; i++){
        for(var name in worldObjects[i]){
            if(worldObjects[i][name].tag == worldObjectBTag){
                var worldObjectB = worldObjects[i][name];
                if(isCollided(worldObjectA, worldObjectB, deltaY)){
                    return worldObjectB;
                }
            }
        }
    }
    return null;
}
function isCollidedComplexTag(worldObjectA, worldObjectBTag, deltaY = 0){
    for(var i = 0; i < worldObjects.length; i++){
        for(var name in worldObjects[i]){
            if(worldObjects[i][name].tag == worldObjectBTag){
                var worldObjectB = worldObjects[i][name];
                if(isCollidedComplex(worldObjectA, worldObjectB, deltaY)){
                    return worldObjectB;
                }
            }
        }
    }
    return null;
}
function isCollidedGroundTag(worldObjectA, worldObjectBTag, deltaY = 0){
    for(var i = 0; i < worldObjects.length; i++){
        for(var name in worldObjects[i]){
            if(worldObjects[i][name].tag == worldObjectBTag){
                var worldObjectB = worldObjects[i][name];
                if(isCollidedGround(worldObjectA, worldObjectB, deltaY)){
                    return worldObjectB;
                }
            }
        }
    }
    return null;
}