const story = {
  start: {
    text: "Te llamás Lyra, barista del Café Olimpo. Hoy llegan clientes divinos... literalmente.",
    img: "img/img1.png",
    choices: [{ text: "Atender al primer cliente", next: "zeus1" }]
  },
  zeus1: {
    text: "Un trueno suena afuera. Entra Zeus con su capa empapada y con mucha de sed de tomarse un buen café",
    img: "img/img2.png",
    choices: [{ text: "Servirle su café", next: "zeus2" }]
  },
  zeus2: {
    text: "Zeus mira el cafe con una expresion muy seria, para soprresa de todos luego de probar el café sonríe y dice 'Este néctar podría despertar hasta a los titanes'.",
    img: "img/img3.png",
    choices: [{ text: "Agradecer", next: "eleccionRutas" }]
  },
  eleccionRutas: {
    text: "De repente entra Hades, lanzando una mirada fría hacia su hermano. Tenes que elegir a quien atender.",
    img: "img/img4.png",
    choices: [
      { text: "Atender a Hades", next: "hades1" },
      { text: "Quedarte con Zeus", next: "zeus3" }
    ]
  },
  // RUTA HADES
  hades1: {
    text: "Hades pide un espresso 'tan oscuro como su alma'. Lo preparás con cuidado.",
    img: "img/hades1.png",
    choices: [{ text: "Servir el espresso", next: "hades2" }]
  },
  hades2: {
    text: "Lo bebe de un trago. 'Interesante... quizá tengas talento, mortal'. ",
    img: "img/hades2.png",
    choices: [{ text: "Responder con sarcasmo", next: "hades3" }]
  },
  hades3: {
    text: "No te das cuenta que dejas la cafetera prendida por el tenso ambiente y de repente se prende fuego. Todo el local empieza a arder.",
    img: "img/fuego.png",
    choices: [{ text: "Intentar apagar el fuego", next: "finalHades" }]
  },
  finalHades: {
    text: "Por el desastre todos salen afuera, sabes que te van a despedir despues de esto. Hades publica en redes: '#BaristaDelInfierno 🔥☕'.",
    img: "img/finalHades.png",
    choices: [{ text: "Reiniciar", next: "start" }]
  },
  // RUTA ZEUS
  zeus3: {
    text: "Zeus pide un cafe celestial y te empieza a sacar conversación",
    img: "img/zeus3.png",
    choices: [{ text: "Aceptar la invitación", next: "zeus4" }]
  },
  zeus4: {
    text: "Mientras charlan, él empieza a mostrarte los trucos que puede hacer con sus rayos",
    img: "img/zeus4.png",
    choices: [{ text: "Reírte de su truco", next: "zeus5" }]
  },
  zeus5: {
    text: "Ups... uno de sus rayos cae sobre el cafe haciendolo explotar...",
    img: "img/zeus5.png",
    choices: [{ text: "Decidir qué hacer ahora", next: "eleccionZeusFinal" }]
  },
  eleccionZeusFinal: {
    text: "Ves de primera mano como la explosión ensucio todo a Zeus",
    img: "img/zeusDesastre.png",
    choices: [
      { text: "Burlarte de él", next: "finalZeusRaton" },
      { text: "Ayudarlo a limpiar", next: "finalZeusCafe" }
    ]
  },
  finalZeusRaton: {
    text: "Luego de estarte riendo de la situacion, Zeus ofendido intenta castigarte, pero se equivoca... y ¡se transforma en un ratón! 🐭⚡ ",
    img: "img/finalZeusRaton.png",
    choices: [{ text: "Reírte y reiniciar", next: "start" }]
  },
  finalZeusCafe: {
    text: "Luego de ayudarlo a limpiar el desastre, Zeus dice: “Has servido el mejor café que un dios haya probado. Eso merece una recompensa… digna de los cielos.” Y te regala un boleto de vacaciones todo pagado al Olimpo",
    img: "img/finalZeusCafe.png",
    choices: [{ text: "Volver al inicio", next: "start" }]
  }
};

let currentScene = "start";

function showScene(sceneName) {
  const scene = story[sceneName];
  currentScene = sceneName;

  const bg = document.getElementById("background");
  bg.style.opacity = 0;
  setTimeout(() => {
    bg.src = scene.img;
    bg.style.opacity = 1;
  }, 200);

  document.getElementById("story-text").innerText = scene.text;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => showScene(choice.next);
    choicesDiv.appendChild(btn);
  });
}

showScene("start");

// ====== BOTÓN DE MÚSICA ======
const musicBtn = document.getElementById("music-btn");
const bgMusic = document.getElementById("bg-music");
let musicPlaying = false;

musicBtn.onclick = () => {
  if (!musicPlaying) {
    bgMusic.play();
    musicPlaying = true;
    musicBtn.style.opacity = 1;
  } else {
    bgMusic.pause();
    musicPlaying = false;
    musicBtn.style.opacity = 0.6;
  }
};

// ====== BOTÓN DE CRÉDITOS ======
const creditsBtn = document.getElementById("credits-btn");

// Creamos el div de créditos dinámicamente
const creditsScreen = document.createElement("div");
creditsScreen.id = "credits-screen";
creditsScreen.innerHTML = `
  <h1>Café del Olimpo</h1>
  <h2>Créditos</h2>
  <p>Alumno: Elias Esquibel</p>
  <p>Legajo:119019/4 Comisión:David Bedoian</p>
  <button id="back-btn">Volver al inicio</button>
`;
document.getElementById("game").appendChild(creditsScreen);

creditsBtn.onclick = () => {
  creditsScreen.style.display = "flex";
};

// Botón para volver al inicio
document.getElementById("back-btn").onclick = () => {
  creditsScreen.style.display = "none";
  showScene("start");
};
