var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var gameOver, restart; 
var jumpSound, checkPointSound, dieSound; 


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided= loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
 
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3"); 
  dieSound = loadSound("die.mp3"); 
  checkPointSound = loadSound("checkPoint.mp3"); 
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-30,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.8;
  trex.debug=false;
  trex.setCollider("circle",0,0,40);
  
  ground = createSprite(200,height-40,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  
    gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2+50);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;
  invisibleGround = createSprite(200,height-30,400,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  score = 0;
}

function draw() {
  background(180);
  //mostrar puntuación
  textSize(20);
  text("Puntuación: "+ score, width-200,50);
  
  
  
  if(gameState === PLAY){
     gameOver.visible = false
    restart.visible = false

    //mover el suelo
   ground.velocityX = -(4+3 * score/100); 
    
    //puntuación

    score = score + Math.round(getFrameRate()/60);

    
    }
  
    if(score > 0 && score % 100 === 0){
      checkPointSound.play(); 
    }

    if(keyDown("space") && trex.y >= 100){
      trex.velocityY = -7; 
      jumpSound.play(); 
    }
  
    trex.velocityY = trex.velocityY + 0.8; 
  
    spawnClouds(); 
    spawnObstacles(); 

    if(ground.x < 0){
      ground.x = ground.width/2;     
    }

    if(obstaclesGroup.isTouching(trex)){
      gameState = END; 
    }
  
  
  else if (gameState === END) {
      ground.velocityX = 0;
      trex.changeAnimation("collided", trex_collided);
      gameOver.visible = true;
    restart.visible = true;
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
   }
  
 
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
   }
  
  
  drawSprites();


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-40,10,40);
   obstacle.velocityX = -6;
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.8;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(10,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.8;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 450;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }
}




function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;

}