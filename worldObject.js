var worldObjectId = 0;

class WorldObject{
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

    despawn = function(){
        for(var i in this.children){
            despawn(this.children[i]);
        }
        delete worldObjects[this.layer][this.id];
    }    
}