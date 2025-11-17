let canvas, ctx;
let game;

// ----------------- Variables -----------------
const STATE_MENU = 0;
const STATE_STORY1 = 1;
const STATE_STORY2 = 2;
const STATE_PLAYING = 3;
const STATE_VICTORY = 4;
const STATE_TUTORIAL = 5;
const STATE_CREDITS = 6;
let gameState = STATE_MENU;

let musicOn = false;
let bgm = new Audio("musica/Life Will Change -instrumental version-.mp3");
bgm.loop = true;

// ----------------- Imagenes  -----------------
const bgMenu = new Image();
bgMenu.src = "img/img1.png";  
let menuLoaded = false;
bgMenu.onload = () => menuLoaded = true;

const bgHistoria1 = new Image();
bgHistoria1.src = "img/img2.png";   
let historia1Loaded = false;
bgHistoria1.onload = () => historia1Loaded = true;

const bgHistoria2 = new Image();
bgHistoria2.src = "img/img3.png";   
let historia2Loaded = false;
bgHistoria2.onload = () => historia2Loaded = true;

const zeusMouse = new Image();
zeusMouse.src = "zeus_mouse.png";
let zeusLoaded = false;
zeusMouse.onload = () => zeusLoaded = true;

const floorImg = new Image();
floorImg.src = "img/piso.png";
let floorLoaded = false;
floorImg.onload = () => floorLoaded = true;

const playerImg = new Image();
playerImg.src = "img/raton.png";
let playerLoaded = false;
playerImg.onload = () => playerLoaded = true;

const enemyImg = new Image();
enemyImg.src = "img/plato.png";
let enemyLoaded = false;
enemyImg.onload = () => enemyLoaded = true;

const bgVictory = new Image();
bgVictory.src = "img/escape.png";
let bgVictoryLoaded = false;
bgVictory.onload = () => bgVictoryLoaded = true;

const heartImg = new Image();
heartImg.src = "img/corazon.png";
let heartLoaded = false;
heartImg.onload = () => heartLoaded = true;


window.onload = () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  game = new Game();
  canvas.addEventListener("click", handleClick);
  loop();
};


function loop() {
  game.update();
  game.draw();
  requestAnimationFrame(loop);
}

// ----------------- CLICK -----------------
function handleClick(e) {
  const x = e.offsetX;
  const y = e.offsetY;

  // ----------------- MENÚ -----------------
  if (gameState === STATE_MENU) {
    if (x > 230 && x < 410) {
      if (y > 200 && y < 245) gameState = STATE_STORY1; 
      if (y > 260 && y < 305) gameState = STATE_TUTORIAL; 
      if (y > 320 && y < 365) gameState = STATE_CREDITS;
      if (y > 380 && y < 420) {  // Botón música
        musicOn = !musicOn;
        if (musicOn) bgm.play();
        else bgm.pause();
      }
    }
    return;
  }

  // ----------------- HISTORIA 1 -----------------
  if (gameState === STATE_STORY1) {
    if (x > 330 && x < 450 && y > 405 && y < 440) gameState = STATE_STORY2;
    return;
  }

  // ----------------- HISTORIA 2 -----------------
  if (gameState === STATE_STORY2) {
    if (x > 230 && x < 350 && y > 405 && y < 440) gameState = STATE_PLAYING;
    return;
  }

  // ----------------- TUTORIAL -----------------
  if (gameState === STATE_TUTORIAL) {
    if (x > 230 && x < 410 && y > 400 && y < 445) {
      gameState = STATE_MENU;
      return;
    }
  }

  // ----------------- CRÉDITOS -----------------
  if (gameState === STATE_CREDITS) {
    if (x > 230 && x < 410 && y > 400 && y < 445) {
      gameState = STATE_MENU;
      return;
    }
  }

  // ----------------- Victoria  -----------------
  if (gameState === STATE_VICTORY) {
    if (x > 230 && x < 350 && y > 405 && y < 440) {
      gameState = STATE_MENU; 
      game.reset();
    }
  }
}

// ----------------- Classes -----------------
class Game {
  constructor() {
    this.reset();
    this.keys = {};
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = true;
      if (key === "r") this.reset();
    });
    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;
    });
  }

  reset() {
    this.player = new Player(270, 190);
    this.objects = [];
    this.spawnTimer = 0;
    this.lives = 5;
    this.gameOver = false;
    this.victory = false;
    this.timeLeft = 30 * 60;
  }

  update() {
    if (gameState !== STATE_PLAYING || this.gameOver || this.victory) return;

    this.player.update(this.keys);
    this.spawnTimer++;

    if (this.objects.length < 3 && this.spawnTimer % 40 === 0) {
      this.objects.push(new FallingObject());
    }

    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      obj.update();
      if (obj.x < -50 || obj.x > canvas.width + 50 || obj.y < -50 || obj.y > canvas.height + 50) {
        this.objects.splice(i, 1);
        continue;
      }
      if (this.player.collides(obj)) {
        this.lives--;
        this.objects.splice(i, 1);
        if (this.lives <= 0) this.gameOver = true;
      }
    }

    this.timeLeft--;
    if (this.timeLeft <= 0) {
      this.victory = true;
      gameState = STATE_VICTORY;
    }
  }

  draw() {
    ctx.clearRect(0, 0, 640, 480);

    // ------------------ Pantalla menu ------------------
    if (gameState === STATE_MENU) {
      if (menuLoaded) ctx.drawImage(bgMenu, 0, 0, 640, 480);

      drawRoundedButton(230, 200, 180, 40, "Empezar");
      drawRoundedButton(230, 260, 180, 40, "Tutorial");
      drawRoundedButton(230, 320, 180, 40, "Créditos");
      drawMusicMenuButton();  // Botón música debajo
      return;
    }

    // ------------------ Pantalla 1 ------------------
    if (gameState === STATE_STORY1) {
      if (historia1Loaded) ctx.drawImage(bgHistoria1, 0, 0, 640, 480);

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(20, 340, 600, 120);

      ctx.fillStyle = "white";
      ctx.font = "22px Arial";
      ctx.fillText("Luego de que Zeus de convierta en un ratoncito.", 40, 380);

      drawRoundedButton(330, 405, 120, 35, "Continuar"); 
      return;
    }

    // ------------------ Pantalla 2 ------------------
    if (gameState === STATE_STORY2) {
      if (historia2Loaded) ctx.drawImage(bgHistoria2, 0, 0, 640, 480);

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(20, 340, 600, 120);

      ctx.fillStyle = "white";
      ctx.font = "22px Arial";
      ctx.fillText("Todos en la cafetería, asustados al verlo le empezaron ,", 40, 370);
      ctx.fillText("a tirar cosas sin saber que era el mismisimo Zeus.", 40, 400);

      drawRoundedButton(230, 405, 120, 35, "Empezar");
      return;
    }

    // ------------------ Tutorial pantalla ------------------
    if (gameState === STATE_TUTORIAL) {
      if (menuLoaded) ctx.drawImage(bgMenu, 0, 0, 640, 480);

      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, 0, 640, 480);

      ctx.fillStyle = "white";
      ctx.font = "22px Arial";
      ctx.fillText("Evita que los platos te golpeen!", 120, 150);
      ctx.fillText("Tenés 5 vidas antes de perder ¡Tene cuidado!", 80, 200);
      ctx.fillText("Presiona WASD para moverte", 140, 250);
      ctx.fillText("En cualquier momento durante el gameplay", 120, 300);
      ctx.fillText("puedes presionar R para reiniciar", 140, 350);

      drawRoundedButton(230, 400, 180, 45, "Volver");
      return;
    }

    // ------------------ Pantalla de creditos ------------------
    if (gameState === STATE_CREDITS) {
      if (menuLoaded) ctx.drawImage(bgMenu, 0, 0, 640, 480);

      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, 0, 640, 480);

      ctx.fillStyle = "white";
      ctx.font = "22px Arial";
      ctx.fillText("Alumno: Elias Esquibel", 180, 180);
      ctx.fillText("Legajo: 119019/4", 200, 230);
      ctx.fillText("Comision: David Bedoian", 180, 280);

      drawRoundedButton(230, 400, 180, 45, "Volver");
      return;
    }

    // ------------------ Juego ------------------
    if (gameState === STATE_PLAYING) {
      if (floorLoaded) ctx.drawImage(floorImg, 0, 0, 640, 480);

      this.player.draw();
      this.objects.forEach((obj) => obj.draw());
      this.drawLives();

      ctx.fillStyle="black";
      ctx.font="24px Arial";
      ctx.fillText("Tiempo: " + Math.ceil(this.timeLeft/60), 480, 40);

      if (this.gameOver) this.drawEndScreen("PERDISTE - R para reiniciar");
    }

    // ------------------ Victoria  ------------------
    if (gameState === STATE_VICTORY) {
      if (bgVictoryLoaded) ctx.drawImage(bgVictory, 0, 0, 640, 480);

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(20, 340, 600, 120);

      ctx.fillStyle = "white";
      ctx.font = "22px Arial";
      ctx.fillText("¡Zeus sobrevivió! Ahora tiene que volver a su forma", 40, 370);
      ctx.fillText("normal,no parece que volvera a una cafetería pronto", 40, 400);

      drawRoundedButton(230, 405, 120, 35, "Volver");
    }
  }

  drawLives() {
    const padding = 10;
    const size = 30;
    const totalWidth = this.lives * size + (this.lives - 1) * padding;
    const startX = (canvas.width - totalWidth) / 2;

    for (let i = 0; i < this.lives; i++) {
      const x = startX + i * (size + padding);
      const y = 15;

      if (heartLoaded) ctx.drawImage(heartImg, x, y, size, size);
      else {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  drawEndScreen(text) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0,0,640,480);
    ctx.fillStyle = "yellow";
    ctx.font = "30px Arial";
    ctx.fillText(text,100,240);
  }
}

// ----------------- Botones -----------------
function drawRoundedButton(x, y, w, h, text) {
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, x + (w - textWidth)/2, y + h/2 + 6);
}

// ----------------- Musica -----------------
function drawMusicMenuButton() {
  const x = 230;
  const y = 380;
  const w = 180;
  const h = 40;

  ctx.fillStyle = musicOn ? "violet" : "gray";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  const text = "Música " + (musicOn ? "ON" : "OFF");
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, x + (w - textWidth)/2, y + h/2 + 6);
}

// ----------------- Jugador  -----------------
class Player {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 100;
    this.speed = 5;
  }
  update(keys){
    if(keys["w"]) this.y -= this.speed;
    if(keys["s"]) this.y += this.speed;
    if(keys["a"]) this.x -= this.speed;
    if(keys["d"]) this.x += this.speed;
    this.x = Math.max(0, Math.min(640 - this.w, this.x));
    this.y = Math.max(0, Math.min(480 - this.h, this.y));
  }
  draw(){
    if(playerLoaded) ctx.drawImage(playerImg, this.x, this.y, this.w, this.h);
    else ctx.fillStyle="cyan", ctx.fillRect(this.x,this.y,this.w,this.h);
  }
  collides(obj){
    return !(this.x+this.w<obj.x || this.x>obj.x+obj.w || this.y+this.h<obj.y || this.y>obj.y+obj.h);
  }
}

// ----------Platos -----//
class FallingObject {
  constructor(){
    this.w = 40;
    this.h = 40;
    const speed = 1.5 + Math.random()*1.5;
    const side = Math.floor(Math.random()*4);

    switch(side){
      case 0: this.x = Math.random()*(640-this.w); this.y=-this.h; this.vx=0; this.vy=speed; break;
      case 1: this.x = Math.random()*(640-this.w); this.y=480; this.vx=0; this.vy=-speed; break;
      case 2: this.x=-this.w; this.y=Math.random()*(480-this.h); this.vx=speed; this.vy=0; break;
      case 3: this.x=640; this.y=Math.random()*(480-this.h); this.vx=-speed; this.vy=0; break;
    }
  }
  update(){ this.x+=this.vx; this.y+=this.vy; }
  draw(){ 
    if(enemyLoaded) ctx.drawImage(enemyImg, this.x, this.y, this.w, this.h);
    else ctx.fillStyle="red", ctx.fillRect(this.x,this.y,this.w,this.h);
  }
}
