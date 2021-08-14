var END , gameState , PLAY ;

PLAY=1;
gameState=PLAY;
END=0;

var trex, trex_running, trex_collided;

var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage, obstacle4, obstacle5, obstacle6;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, jumpSound;

var score,gameOverImg,restartImg, dieSound, checkPointSound;




function preload()
{
    trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadAnimation("trex_collided.png");
    
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
    
    jumpSound = loadSound("jump.mp3")
    dieSound = loadSound("die.mp3")
    checkPointSound = loadSound("checkPoint.mp3")
}

function setup() 
{
    //createCanvas(600, 200);
    createCanvas(windowWidth,windowHeight)
    
    trex = createSprite(50,height-85,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided" ,trex_collided);
    trex.scale = 0.5;
    
    ground = createSprite(1200,height-80,width,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    
    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(300,140);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.5;
    
    invisibleGround = createSprite(200,height-70,width,10);
    invisibleGround.visible = false;
    
    //create Obstacle and Cloud Groups
    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();
    
    console.log("Hello" + 5);
    
    //trex.setCollider("rectangle",0,0,230,trex.height);
    trex.setCollider("circle",0,0,40);
    trex.debug = true
    
    score = 0;
  
}

function draw() 
{
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  //console.log("this is ",gameState)
  
  
 
  if(gameState === PLAY)
  {
        gameOver.visible = false
        restart.visible = false
        //move the ground
        ground.velocityX = -4;
        //scoring
        score = score + Math.round(getFrameRate()/60);
        
        if (score>0 && score%300===0)
        {
          checkPointSound.play();
        }
        
        if (ground.x < 0)
        {
          ground.x = ground.width/2;
        }
        
        //jump when the space key is pressed
        touches.length>0
        if((touches.length>0 || keyDown("space"))&& trex.y >= height-135) 
        {
            trex.velocityY = -12;
          jumpSound.play ();
          touches=[]
        }
        
        //add gravity
        trex.velocityY = trex.velocityY + 0.8
      
        //spawn the clouds
        spawnClouds();
      
        //spawn obstacles on the ground
        spawnObstacles();
        
        if(obstaclesGroup.isTouching(trex))
        {
            gameState = END;
        dieSound.play ();
        // trex.velocityY=-10;
          //jumpSound.play();
        }
  }
   
  else if (gameState === END) 
   {
        console.log("hey")
          gameOver.visible = true;
          restart.visible = true;
        
          ground.velocityX = 0;
          trex.velocityY = 0
        
          //change the trex animation
          trex.changeAnimation("collided", trex_collided);
        
          //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
      
        if(mousePressedOver(restart))
      {
        text("reinicia aqui!!!",260,165);
        renacimiento();
      }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles()
{
 
  if (frameCount % 60 === 0)
  {
      var obstacle = createSprite(width-20,height-90,10,40);
      obstacle.velocityX= -(6+score/300)
      // obstacle.velocityX = -6;
      
        //generate random obstacles
        var rand = Math.round(random(1,6));
        
        switch(rand) 
        {
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
      
        //assign scale and lifetime to the obstacle           
        obstacle.scale = 0.5;
        obstacle.lifetime = 300;
      
      //add each obstacle to the group
        obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() 
{
  //write code here to spawn the clouds
  
  if (frameCount % 60 === 0) 
  {
      cloud = createSprite(600,100,40,10);
      cloud.y = Math.round(random(10,60));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      cloud.velocityX= -(3 * score/300)
      
      //assign lifetime to the variable
      cloud.lifetime = 134;
      
      //adjust the depth
      cloud.depth = trex.depth;
      trex.depth = trex.depth + 1;
      
      //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}
function renacimiento()
{
  gameState=PLAY;
  gameOver.visible = false;
  restart.visible = false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
}
