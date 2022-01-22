/* 

EXTRAS (They are marked with the text "EXTRA THING". ctrl + f should be able to find them)
EXCEPT for #8, search for "denyplayermoves"


#1 
Store player and computer points so that they persist through reloads of the page

#2
If player picks an ace card, they are able to change its value to 11

#3
Adds delay to computer's picking time, that is "random" (configurable), so that it feels more realistic
than the computer instantly picking

#4
Flips the card when showing it, and also stacks them on top of each other for great visual appeal for the game

#5
Make an actual deck for the game so that duplicate cards can't be drawn until the cards are reshuffled or the reset button is pressed
Also persists through reloads so you can continue playing the game if you memorized the cards

#6
Stop players from reloading over and over to get an incredibly good hand. Reloading only returns your hand

#7 (not as hard as other ones)
Don't use a single alert, confirm, or prompt in the code, so that no breaking of 
gameplay loop is staged. Everything flows smoothly and is always interactable

#8 (search for denyplayermoves)
Stops player from pressing stand button multiple times or pressing hit button during the computer's turn



*/




// defines variables for use in the game
var playerScore = 0; // player score for current round
var computerScore = 0; // computer score for current round
var xCoord = 0; // variable for calculating card x position
var yCoord = 0; // variable for calculating card y position
var denyPlayerMoves = false; // variable for prevention of spamming the stand button
const delays = [400, 700, 1000, 1300, 1500]; // configurable array for computer card picking delay
const suits = ["hearts", "diamonds", "spades", "clubs"]; // array for picking suits
var timer; // timeout variable for computer card picking
var timer2; // timeout variable for win/loss/tie


// supporting code for blocking reload abuse
if (localStorage.playerHandCloud == undefined || localStorage.playerHandCloud == "undefined") { // grab localStorage player hand
      var playerHand = [];
} else {
      var playerHand = JSON.parse(localStorage.playerHandCloud)
}



// EXTRA THING
// More code in functions below to support
// Stores player and computer points so that they can continue
// through reloads of the page.
if (localStorage.playerPointsStorage === undefined) { // grab localStorage player points
      var playerPoints = 0;
} else {
      var playerPoints = parseInt(localStorage.playerPointsStorage);
}

if (localStorage.computerPointsStorage === undefined) { // grab localStorage computer points
      var computerPoints = 0;
} else {
      var computerPoints = parseInt(localStorage.computerPointsStorage);
}

if (localStorage.deckCloud == undefined || localStorage.playerHandCloud == "undefined") { // grab localStorage current deck
      var cardsPicked = []; // array for listing all cards picked
} else {
      var cardsPicked = JSON.parse(localStorage.deckCloud);
}




// resets the game to initial state
function reset() {

      clearTimeout(timer); // clears computer card picking timeout
      clearTimeout(timer2); // clears win/loss/tie timeout
      restart(); // call restart function to reset variables
      playerPoints = 0; // reset player points
      computerPoints = 0; // reset computer points
      updatePoints(); // update points
      cardsPicked = []; // reset card picked array
      localStorage.deckCloud = "undefined"; // reset deck localStorage
      document.getElementById("thinkingText").style.visibility = "hidden"; // reset thinking text
      document.getElementById("aceButton").style.visibility = "hidden"; // reset ace button
      localStorage.computerPointsStorage = 0; // reset locally stored computer points
      localStorage.playerPointsStorage = 0; // reset locally stored player points
      playerHand = [];
      localStorage.playerHandCloud = undefined;
}

// updates player and computer points
function updatePoints() {

      document.getElementById("playerPoints").innerHTML = "Points: " + playerPoints; // update player points
      document.getElementById("computerPoints").innerHTML = "Points: " + computerPoints; // update computer points

}

// game end function
// receives game score state in arg1, updates points, displays win, loss, tie message
// winning is one point, losing is zero points, tying is 0.5 points
function gameEnd(state) {

      document.getElementById("thinkingText").style.visibility = "hidden"; // remove computer thinking message

      if (state == "win") {
            document.getElementById("announcements").innerHTML = "You Won!"; // change announcement text
            playerPoints += 1;
            localStorage.playerPointsStorage = playerPoints;
            gameEndScreen();
      } else if (state == "lose") {
            document.getElementById("announcements").innerHTML = "You Lost!"; // change announcement text
            computerPoints += 1;
            localStorage.computerPointsStorage = computerPoints;
            gameEndScreen();
      } else if (state == "tie") {
            document.getElementById("announcements").innerHTML = "You Tied!"; // change announcement text
            playerPoints += 0.5;
            computerPoints += 0.5;
            localStorage.playerPointsStorage = playerPoints;
            localStorage.computerPointsStorage = computerPoints;
            gameEndScreen();
      }

}

// call for points update
// display round over screen
function gameEndScreen() {

      updatePoints();
      document.getElementById("next").style.visibility = "visible"; // display next round button
      document.getElementById("hitCircle").style.visibility = "hidden"; // hide hit button
      document.getElementById("standCircle").style.visibility = "hidden"; // hide stand button
      localStorage.playerHandCloud = undefined;

}

// EXTRA THING
// allows player to change ace cards to a value of 11, like real blackjack
function changeToAce() {
      playerScore += 10;
      document.getElementById("aceButton").style.visibility = "hidden";
      document.getElementById("playerScore").innerHTML = playerScore; // updates player score
      if (playerScore > 21) {
            gameEnd("lose"); // player loses game if they pick higher than 21
      }

}

// generate card and number for player and adds to player score, checks for player instant lose
function playerHit() {


      if (denyPlayerMoves == false) { // only allow running if it is player's turn
            var cardPlayerPicked = cardGen();
            playerScore += cardPlayerPicked; // runs cardGen which returns number, and also creates card
            document.getElementById("playerScore").innerHTML = playerScore; // updates player score

            if (cardPlayerPicked == 1) {
                  document.getElementById("aceButton").style.visibility = "visible";
            }
            

            if (playerScore > 21) {
                  gameEnd("lose"); // player loses game if they pick higher than 21
            }

      }

}

// starts the recursion for computer picking cards after setting card position values to default
function computerHit() {
      document.getElementById("aceButton").style.visibility = "hidden";
      if (denyPlayerMoves == false) { // only run if denyPlayerMoves is false to prevent running recursion function multiple times
            document.getElementById("thinkingText").style.visibility = "visible"; // display the thinking text for computer
            denyPlayerMoves = true; // set denyPlayerMoves to true to prevent parallel recursion function runs
            xCoord = 0; // reset x coords for card for computer turn
            yCoord = 0; // reset y coords for card for computer turn
            computerRecursion(); // start recursion     
      }

}

// EXTRA THING
// adds CONFIGURABLE delay to the computer's picking delay
// configurable by changing the delays array
function computerRecursion() { // recursion function for computer picking cards

      if (playerScore > computerScore || (playerScore == computerScore && playerScore <= 11)) {
            var cardComputerPicked = cardGen();
            computerScore += cardComputerPicked; // runs cardGen which returns number, and also creates card
            if (cardComputerPicked == 1 && 10 + computerScore < 22) {
                  computerScore += 10;

            }
            document.getElementById("computerScore").innerHTML = computerScore; // updates computer score

            if (!(playerScore > computerScore || (playerScore == computerScore && playerScore <= 11))) {

                  if (computerScore == playerScore) {
                        //game is a tie
                        timer2 = setTimeout(gameEnd, 300, "tie"); // slight timeout to delay gameEnd function so values can update
                        return; // Technically optional return, but avoids unnecessary recursive calls, optimizing performance
                  } else if (computerScore > 21) {
                        //player wins
                        timer2 = setTimeout(gameEnd, 300, "win"); // slight timeout to delay gameEnd function so values can update
                        return; // Technically optional return, but avoids unnecessary recursive calls, optimizing performance
                  } else {
                        //player loses
                        timer2 = setTimeout(gameEnd, 300, "lose"); // slight timeout to delay gameEnd function so values can update
                        return; // Technically optional return, but avoids unnecessary recursive calls, optimizing performance
                  }

            }

            timer = setTimeout(computerRecursion, delays[Math.floor(Math.random() * delays.length)]); // call itself after a random delay from the array "delay"
      }

}

// sets all required variable values to default for another round
function restart() {

      playerScore = 0;
      computerScore = 0;
      xCoord = 0;
      yCoord = 0;
      denyPlayerMoves = false;
      removeObjects();
      document.getElementById("computerScore").innerHTML = "";
      document.getElementById("playerScore").innerHTML = "";
      document.getElementById("next").style.visibility = "hidden";
      document.getElementById("announcements").innerHTML = "";
      document.getElementById("hitCircle").style.visibility = "visible";
      document.getElementById("standCircle").style.visibility = "visible";
      document.getElementById("aceButton").style.visibility = "hidden";
      playerHand = [];
      localStorage.playerHandCloud = undefined;
}

// function used to check where to place card for cardGen() function
function compTurnCheck() {

      if (denyPlayerMoves == true) {
            return 25;
      } else {
            return 0;
      }

}

// flips the card (With the correct element id)
function flip() {

      void document.getElementById("flipThis").offsetWidth; // trigger dom reflow (to update animation)
      document.getElementById("flipThis").classList.add("flip-action");

}

// EXTRA THING
// card flipping
// generates the card using img src and appends it to document body, then after that
// flips the card in a realistic way
function drawCard(suit, number) { // draws the card, every 5 cards, card wraps around. All cards styled, and attributes edited, then id is changed to random id.

      // div 1 is outermost division for perspective changing
      // div 2 is inner card that actually gets flipped
      // div 3 is inside inner card and is visible right away, and when flip() is run, flips 180 degrees to disappear.
      // div 4 is also inside inner card but is flipped 180 degrees, and when flip() is run, flips to show.
      // backImg is backside image
      // elem is frontside image

      // create elements and store them in variables
      var div1 = document.createElement("div"); // creates div 1
      var div2 = document.createElement("div"); // creates div 2
      var div3 = document.createElement("div"); // creates div 3
      var div4 = document.createElement("div"); // creates div 4
      var backImg = document.createElement("img"); // creates backside image
      var elem = document.createElement("img"); // creates frontside image

      // add required classes, ids, styles for card flipping
      // div 1
      div1.classList.add("card-outer");
      div1.style.position = "absolute";
      // div 2
      div2.id = "flipThis";
      div2.classList.add("card-inner");
      div2.style.left = 27 + xCoord * 2.6 + compTurnCheck() + "vw"; // positions card differently depending on if computer turn or not
      div2.style.top = 15 + yCoord * 6 + "vh"; // wraparound
      // div 3
      div3.classList.add("card-front");
      // card back
      backImg.src = "deck/backside/backside3.png"; // pull source for backside image
      backImg.classList.add("card-image");
      backImg.setAttribute("draggable","false");
      // card front
      elem.src = "deck/" + suit + "/" + number + ".png" ; // navigates to correct card in folder and sets it as source
      elem.classList.add("card-image");
      elem.setAttribute("draggable","false");
      
      // append the nodes in the correct way
      div1.appendChild(div2);
      div2.appendChild(div3);
      div2.appendChild(div4);
      div3.appendChild(elem);
      div4.appendChild(backImg);

      
      // insert card into document body
      document.body.append(div1);
      
      flip() // flip the card
      document.getElementById("flipThis").id = Math.random().toString(36).slice(2); // generate random id for element and set div2 id to it
      // javascript rng seeding algorithm guarantees that ids cannot be duplicate.
      
      // wraparound code
      xCoord++;

      if (xCoord >= 5) {
            xCoord = 0;
            yCoord++;
      }

}

// remove all elements with the "card-outer" class INCLUDING ITS CHILD NODES
// also resets card positions
function removeObjects() {

      var list = document.querySelectorAll(".card-outer");

      for (var i = 0; i < list.length; i++) {
            list[i].remove();
      }

      xCoord = 0;
      yCoord = 0;

}

// EXTRA THING: 
// uses array to keep the deck that has been currently picked until now. This prevents duplicate card draws until
// the deck is reshuffled
// extra in the function marked with "EXTRA1"
// ALSO PERSISTS THROUGH RELOADS

// randomly generates a suit and a number
// uses those to draw a card using cardGen()
// returns the number, rounded down to 10 if over
// uses cardsPicked array to search for duplicates so that all cards are unique
// once cardsPicked array hits 52, the array is reset so the card picking can continue
// when this occurs, a message is shown to the player telling them that the cards have been
// reshuffled
function cardGen() {

      var suit = suits[Math.floor(Math.random() * 4)];
      var numb = Math.floor(Math.random() * 13) + 1;

      // EXTRA1
      while (cardsPicked.includes(suit + numb)) {
            suit = suits[Math.floor(Math.random() * 4)];
            numb = Math.floor(Math.random() * 13) + 1;
      }
      // EXTRA1
      cardsPicked.push(suit + numb);
      localStorage.deckCloud = JSON.stringify(cardsPicked);
      // EXTRA1
      if (cardsPicked.length == 52) {
            cardsPicked = [];
            localStorage.deckCloud = "undefined";
            document.getElementById("announcements2").style.visibility = "visible";
            setTimeout(function () {document.getElementById("announcements2").style.visibility = "hidden";}, 3000);
      }

      drawCard(suit, numb);

      if (denyPlayerMoves == false) { // localStorage for player hand
            let playerHandNestedArray = [suit, numb]
            playerHand.push(playerHandNestedArray)
            localStorage.playerHandCloud = JSON.stringify(playerHand)
      }


      if (numb > 10) {
            numb = 10;
      }

      return numb;

}

updatePoints(); // update points that were grabbed from local storage

// EXTRA THING
// stop player from reloading to get a better hand for themself
// reloading the page gives them the cards they picked before back into their hand, so they can't abuse the reload to get
// the best hand every single time
// Supporting code in the variables section
for (let i = 0; i < playerHand.length; i++) { // stops player from being able to use window reload to get the best hand every single time.
      let cardSuit = playerHand[i][0];
      let cardNumber = playerHand[i][1];
      drawCard(cardSuit, cardNumber);
      if (cardNumber > 10) {
            cardNumber = 10;
      }
      playerScore += cardNumber;
      if (cardNumber == 1) {
            document.getElementById("aceButton").style.visibility = "visible";
      }
     
}
document.getElementById("playerScore").innerHTML = playerScore; // updates player score