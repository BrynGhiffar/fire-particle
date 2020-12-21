var myFire;

function setup(){
    createCanvas(400, 400);
    background(0);
    myFire = new fire();
}

function draw(){
    background(0);
    myFire.update();
}

class particle{
    // The particles class is used to specify individual particles

    constructor(posX, posY, diam){
        // --- non-cosmetics ---
        // Usually describe the behavior of the particle,
        // like how they move, age, etc.
        this.pos = createVector(posX, posY);
        this.vel = createVector(0, 0);
        this.maxLifeTime = 25;
        this.lifeTime = this.maxLifeTime;

        // --- cosmetics ---
        // How the particle will look.
        this.diam = diam;
        this.red = 255;
        this.green = 0;
        this.blue = 0;
        this.opacity = 0.8;
        this.color = 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.opacity.toString() + ')';
        this.hasStroke = false;

    }
    
    sketch(){
        // Draws the particle onto the canvas.
        this.color = 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.opacity.toString() + ')';
        if (!(this.hasStroke)){
            noStroke();
        }
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.diam);
    }
}

class fire{
    constructor(){
        this.pos = createVector(mouseX, mouseY);
        this.spawnRadius = 25; // How far the particle will spawn from the center of the fire.
        this.spawnTimeInterval = 0; // How many frames before spawning another particle, zero means
                                    // particles are spawned every frame.
        this.timeToSpawn = 0; // When this.timeToSpawn == this.spawnTimeIntervale, this.spawnPerFrame 
                                // particles will spawn
        this.particleDiamInterval = [10, 15]; // The range of diameters that the particle
                                                // will spawn to.
        this.varyColor = true; // If true the color of the spawned fire particles will vary
                                // based on the variables below.
        this.varyColorRed = [255, 255];
        this.varyColorGreen = [0, 150];
        this.varyColorBlue = [0,0];

        this.particlesPerSpawn = 20;

        // Array to store the particles
        this.particleArray = [];
    }
    spawnParticle(){
        // Spawns a particle every this.spawnTimeInterval frames
        // this.particlesPerSpawn particles are spawned every
        // spawn.
        for (var i = 0; i < this.particlesPerSpawn; i++){
            if (this.timeToSpawn >= this.spawnTimeInterval){

                // create the particle within the spawn radius
                var angle = random(TWO_PI);
                var particleDiam = random(this.particleDiamInterval[0], this.particleDiamInterval[1]);
                var particleDist = random(this.spawnRadius);

                var newParticle = new particle(particleDist * cos(angle) + this.pos.x, particleDist * sin(angle) + this.pos.y, particleDiam);

                if (this.varyColor){
                    newParticle.red = Math.round(random(this.varyColorRed[0], this.varyColorRed[1]));
                    newParticle.green = Math.round(random(this.varyColorGreen[0], this.varyColorGreen[1]));
                    newParticle.blue = Math.round(random(this.varyColorBlue[0], this.varyColorBlue[1]));
                }
                this.particleArray.push(newParticle);
                
                // reset this.timeToSpawn
                this.timeToSpawn = 0;

            } else {
                this.timeToSpawn += 1;
            }
        }
    }
    particleFade(){
        // Sets individual particles to fade as
        // they're lifetime wanes.
        for (var i = 0; i < this.particleArray.length; i++){
            // Maps the particles age to the opacity.
            var opacity = map(this.particleArray[i].lifeTime, 0, this.particleArray[i].maxLifeTime, 0.1, 0.8);
            this.particleArray[i].opacity = opacity;

        }
    }
    particleFloat(){
        // sets fire particle to float once
        // they are spawned.
        var floatVel = createVector(0, -10);
        for (var i = 0; i < this.particleArray.length; i++){
            this.particleArray[i].pos.add(floatVel);
        }
    }
    sketch(){
        // sketches the particle onto the canvas.
        for (var i = 0; i < this.particleArray.length; i++){
            this.particleArray[i].sketch();
        }
    }
    followMouse(){
        // sets the fire object to follow the mouse.
        this.pos.x = mouseX;
        this.pos.y = mouseY;
    }
    remParticles(){
        // removes particles from the this.particleArray
        // once they're this.lifeTime ends.
        var i = 0;
        while (i < this.particleArray.length){
            if (this.particleArray[i].lifeTime < 0){
                this.particleArray.splice(i, 1);
            } else {
                this.particleArray[i].lifeTime -= 1;
                i += 1;
            }
        }
    }
    update(){
        // collection of functions to be put into
        // the draw.
        this.followMouse();
        this.spawnParticle();
        this.particleFloat();
        this.particleFade();
        this.sketch();
        this.remParticles();
    }
}