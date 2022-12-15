var ground, invisibleGround, groundImage; //variavel do chão

var trex, trex_running; //variavel do trex

var cloud, cloudImage; //variavel da nuvem 01/12

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6; 
//variavel para carregar as imagens dos obstaculos 06/12

var trex_collided; //variavel para o trex surpreso 08/12

var score; //variavel para a pontuação 08/12

var PLAY = 1; //variavel do jogo no estado de Jogar com valor para troca (switch) 08/12

var END = 0; //variavel do jogo no estado de Final com valor para troca (switch) 08/12

var gamestate = PLAY; //variavel de Estado de Jogo, sendo a inicial de Jogar 08/12

var obstacles; //variavel para obstaculos (grupo) 08/12

var clouds; //variavel para nuvens (grupo) 08/12

var gameOver, restart; //variavel para Fim de Jogo e Reiniciar 13/12

var gameOverImg, restartImg; //variavel para imagem de Game Over e Reiniciar 13/12
//---------------------------------------
function preload(){
  //Preload vai carregar arquivos de imagem e som
  trex_running = loadAnimation ("trex1.png" , "trex3.png" , "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png"); //01/12
  //imagens para os obstáculos 06/12
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_collided = loadImage("trex_collided.png"); //trex surpreso pela colisão 08/12

//imagens para reiniciar e game over 13/12
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
}
//---------------------------------------
function setup(){
  //Setup vai definir as configurações
  createCanvas(600,200); //cria a tela
  //criar o sprite trex
  trex = createSprite(50, 180, 20, 50);
  //adiciona a animação criada no preload
  trex.addAnimation("running", trex_running);
  //definir a escala
  trex.scale = 0.5;
  //definir a posição inicial no eixo horizontal
  trex.x = 50;
  //criar o chão (ground)
  ground = createSprite(200,180,400,20);
  //adiciona imagem ao chão
  ground.addImage("ground",groundImage);
  //posição do chão em x sempre vai ser metade da sua largura, ou seja, 400/2 = 200
  ground.x = ground.width /2;
  //velocidade de movimento do chão em x
  ground.velocityX = -4;
  //chão invisivel para o trex colidir e não flutuar
  invisibleGround = createSprite(200,190,400,10);
  //sprite.visible escolhe a visibilidade. True = aparece. False = desaparece
  invisibleGround.visible = false;
  //pontuação inicial 08/12
  score = 0;

  //cria os grupos de obstaculos e nuvens 13/12
  clouds = new Group();
  obstacles = new Group();

  //cria o sprite de Fim de Jogo 13/12
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  //cria o sprite de Reiniciar 13/12
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

//verifica se o trex encostou no obstaculo 13/12
  trex.setCollider("circle",0,0,40); 
  
  trex.debug = false;
  //se False, não exibe o modelo de distancia de colisao 13/12
  //se True, exibe o modelo de distancia de colisao 13/12
}
//------------------------------------------
function draw(){
  //Draw vai desenhar na nossa tela
  background("white"); //cor do fundo
  //----------ESTADO DE JOGO JOGAR(PLAY)-----------
  if (gamestate === PLAY){ //estado de JOGAR 08/12
    //exibe o texto de pontuação 08/12
    text("Pontuação" + score, 500, 50);
      //calcula a pontuação dividindo o total de frames gerados por 60 08/12
    score = score + Math.round(frameCount/60);
      //pular quando a tecla espaço for pressionada e somente quando estiver acima do eixo y 100
    if(keyDown("space") && trex.y >= 100) {
      trex.velocityY = -10;
    }
      //trex voltar ao chão depois do pulo
    trex.velocityY = trex.velocityY + 0.8
      //impedir que o trex caia 
    trex.collide(invisibleGround);
      //chão volta a posição original quando passa da posição x = 0 (-1,-2,-3...)
    if (ground.x < 0){
     ground.x = ground.width/2;
     }
    spawnClouds(); //chama a função de gerar nuvens 01/12
    spawnObstacles();//chama a função de gerar obstaculos 06/12

      //se os obstaculos tocarem o trex, o jogo acaba 13/12
    if(obstacles.isTouching(trex))
        { 
          gamestate = END; // mudar o estado de jogo para Final
        }

    gameOver.visible = false; //não tem visibilidade da imagem de GameOver 13/12
    restart.visible = false; //não tem visibilidade da imagem de Restart 13/12
  }
    //----------ESTADO DE JOGO FINAL(END)-----------
  else if (gamestate === END) { //estado de FINAL 08/12
    ground.velocityX=0; //movimento do chão parado 08/12
    trex.velocityY = 0;//MOVIMENTO DO TREX PARADO 08/12

      //mudar a animação do trex para colidiu 08/12
    trex.changeAnimation("collide", trex_collided);

     gameOver.visible = true; //visibilidade da imagem de GameOver 13/12
      restart.visible = true; //visibilidade da imagem de Restart 13/12

      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos 13/12
       obstacles.setLifetimeEach(-1);
       clouds.setLifetimeEach(-1);

     //definir velocidade aos objetos do jogo para que nunca se movam 13/12
       obstacles.setVelocityXEach(0);
       clouds.setVelocityXEach(0);
  }
  //desenho dos sprites
  drawSprites(); 
}

//função de gerar nuvens 01/12
function spawnClouds(){
  if(frameCount % 60 === 0){ //gera nuvens nos intervalos 0, 60, 120, 180,...
    //simbolo de % e === indicam o que sobra da divisão
      cloud = createSprite(600,100,40,10);
      cloud.velocityX =-3; 
      cloud.addImage(cloudImage); //adiciona a imagem ao sprite
      cloud.scale = 0.4; 
      cloud.y = Math.round(random(10,60)); 
      //Math.round arredonda os valores
      //random vai gerar em intervalos aleatorios (a,b) 
      //a = intervalo inicial
      //b = intervalo final
      cloud.lifetime = 200; // largura dividida por velocidade = valor em segundos
      //tempo de vida das nuvens na memória 06/12
      cloud.depth = trex.depth;
      //depth = profundidade 06/12
      trex.depth = trex.depth + 1;
      //trex fica a frente dos sprites de nuvem 06/12
      clouds.add(cloud);
      //adiciona as nuvens ao grupo de nuvem 13/12
    }}
//função de gerar obstáculos 06/12
function spawnObstacles(){  if (frameCount % 60 === 0){
    var obstacle = createSprite(400,165,10,40);
    obstacle.velocityX = -6;
     //gerar obstáculos aleatórios
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
               break;//reinicia a escolha
       case 2: obstacle.addImage(obstacle2);
               break;//reinicia a escolha
       case 3: obstacle.addImage(obstacle3);
               break;//reinicia a escolha
       case 4: obstacle.addImage(obstacle4);
               break;//reinicia a escolha
       case 5: obstacle.addImage(obstacle5);
               break;//reinicia a escolha
       case 6: obstacle.addImage(obstacle6);
               break;//reinicia a escolha
       default: break;
     }
     //atribua dimensão e tempo de vida aos obstáculos              
     obstacle.scale = 0.5;
     obstacle.lifetime = 300;
     //adiciona os obstáculos ao grupo de obstáculos 13/12
     obstacles.add(obstacle);
  }
 }