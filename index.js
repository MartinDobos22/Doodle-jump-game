

document.addEventListener("DOMContentLoaded", () => {

  //vyberieme si class grid s css 
  const grid = document.querySelector(".grid");

  //vytvoríme element s classom div 
  const doodler = document.createElement("div");

  let speed = 3

  const gravity = 0.9

  //pozícia postavičky 
  let doodlerLeftSpace = 50;

  let startPoint = 150;

  let doodlerBottomSpace = startPoint;

  let isGameOver = false;

  //počet platforiem 
  let platformCount = 5;

  let platform = [];

  let upTimerId;
  
  let downTimerId;

  let isJumping = true;

  let isGoingLeft = false;
  let isGoingRight = false;

  let leftTimerId;
  let rightTimerId;

  let score = 0;



  /**
   * FUNKCIA NA VYTVORENIE POSTAVIčKY 
   */
  function createDoodler(){

    grid.appendChild(doodler);
    doodler.classList.add("doodler");

    //zabezpečí že na začiatku bude postavička na prvej platforme 
    doodlerLeftSpace = platform[0].left;

    //pozícia postavičky na mape 
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
    
  }

 // 








 /**
  * vytváranie platforiem 
  */


  //konštruktor pre vytorenie platformy 
  class Platform {
    constructor(newPlatBottom){

      //vytváranie pozícií platforiem na mape 
                                  //šírka hracej plochy - platforma 
      this.left = Math.random() * 315;
      this.bottom = newPlatBottom;

      //vytvorí div element v html pre každú platformu
      this.visual = document.createElement("div");


      // pridať štýly platformám 
      const visual = this.visual;
      visual.classList.add("platform");

      
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      //na grid pripojíme vidual 
      grid.appendChild(visual);
    }
  }


 
 function createPlatforms(){

    for(let i = 0; i < platformCount; i++){

      //výška hracieho pola / počet platforiem
      let platGap = 600 / platformCount;

       //výška platformy + šírka platformy * počet platforiem *  medzera medzi platformamy
      let newPlatBottom = 100 + i * platGap;

      //zavolanie konštruktora 
      let newPlatform = new Platform(newPlatBottom);

      //pushne novo vytvorenú platformu do pola 
      platform.push(newPlatform);
      //console.log(platform);
     
    }
 }

 



 /**
  * pohyb platforiem 
  */

function movePlatforms(){

  if(doodlerBottomSpace > 200){

    //pre každú platformu v poli platform cez foreach priradíme hodnotu 
    platform.forEach(platforms => {
      //posunie platformu o 4 dole 
      platforms.bottom -= 4;
      //pridá visual 
      let visual = platforms.visual;

      visual.style.bottom = platforms.bottom + "px";


      // ak je hodnota platformy nižšia ako 10px 
      if(platforms.bottom < 10) {
        //do premennej si zapíšeme platformu v poli na prvom mieste
        let firstPlatform = platform[0].visual;

        // a tu ju odstranime pretože je uplne dole 
        firstPlatform.classList.remove("platform");
        //shift odstráni prvý elemnet z pola a vráti všetky ostatné pri vypísaní poľa
        platform.shift();
        
        //pripočítame skóre 
        score++;
        //console.log(platform);
        //vytvorí novú platformu 
        let newPlatform = new Platform(600);
        //pushne ju do poľa 
        platform.push(newPlatform);
      }

    })
  }

 }


 

 /**
  *  skákanie postavičky  
  */

 function jump(){

  //vyresetuje interval ktorý mu pridáva += 30
  clearInterval(downTimerId);

  isJumping = true;

  //nastavíme ako často/rýchlo bude postavička skákať hore 
  upTimerId = setInterval(function () {
    // pridá každých 30ms 20 px postavičke 
    doodlerBottomSpace += 20;
    doodler.style.bottom = doodlerBottomSpace + "px";

    if(doodlerBottomSpace > (startPoint + 200)){
      fall();
      isJumping = false
    }

  }, 30);

 }


 

 /**
  * ak postavička začne padať dole 
  */

 function fall(){

  isJumping = false;

  //vyresetuje interval ktorý mu uberá -= 5 
  clearInterval(upTimerId);

  
  
  //nastavíme ako často/rýchlo bude postavička padať 
  downTimerId = setInterval(function (){
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + "px";
    if(doodlerBottomSpace <= 0){
      gameOver();
    }

    //skontroluje či postavička spadla na platformu 
    platform.forEach(platforms => {
      if(
        //skontroluje či je postavička na platforme 
        (doodlerBottomSpace >= platforms.bottom) &&
        (doodlerBottomSpace <= (platforms.bottom + 15)) &&
        //skontroluje či postavička nevyšla z hracej plochy zprava alebo zľava
        ((doodlerLeftSpace + 60) >= platforms.left) &&
        (doodlerLeftSpace <= (platforms.left + 85)) &&
        !isJumping 
      ) {
        console.log("landed");
        startPoint = doodlerBottomSpace;
        jump();
      }
    });

  }, 30);
 }

//assign functions to keyCodes
  function control(e) { 

    doodler.style.bottom = doodlerBottomSpace + "px";
    if(e.key === "ArrowLeft"){
      moveLeft();
    } else if(e.key === "ArrowRight") {
      moveRight();
    } else if(e.key === "ArrowUp"){
      moveStraight();
    }
  }


  function moveLeft(){

    if(isGoingRight){
      clearInterval(rightTimerId);
      isGoingRight = false;
    }

    isGoingLeft = true;
    leftTimerId= setInterval(function(){

      if(doodlerLeftSpace >= 0){

      doodlerLeftSpace -=5;
      doodler.style.left = doodlerLeftSpace + "px";
    }else {
      moveRight();
    }

    },20)
  }

//okomentovať !!!!!!!!!!!!!!!!!!!!!!!!!!
  function moveRight() {


    if(isGoingLeft){
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }

    isGoingRight = true;

    rightTimerId = setInterval(function () { 
     //changed to 313 to fit doodle image
      if(doodlerLeftSpace <= 313){
          doodlerLeftSpace += 5;
          doodler.style.left = doodlerLeftSpace + "px";
      } else {
        moveLeft();
      }
     }, 20)

    }


    function moveStraight() {

      isGoingRight = false;
      isGoingLeft = false;

      clearInterval(rightTimerId);
      clearInterval(leftTimerId);

      }


      


 function gameOver() { 
 // console.log("game over");
  isGameOver = true;
  // okomentovať !!!!!!!!!!!!!!!!!
  while (grid.firstChild){
    grid.removeChild(grid.firstChild);
  }

  grid.innerHTML = score;
  clearInterval(upTimerId);
  clearInterval(downTimerId);
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
}



  function start(){

    if(!isGameOver){
      createPlatforms();
      createDoodler();
      //funkcia setinterval Vyzve funkciu movePlatforms aby sa vykonala každých 30ms
      setInterval(movePlatforms, 30);
      jump(startPoint);
      document.addEventListener("keyup", control);
    }
  }
  
start();

});