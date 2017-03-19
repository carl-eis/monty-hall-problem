/*
    Solution to the Monty Hall Door Problem

    Author: Carl Eiserman
    Website: https://github.com/carl-eis
    
*/

/*====================================================
  Imports
====================================================*/

var Random = require("random-js");
var random = new Random(Random.engines.mt19937().autoSeed());
var start = process.hrtime();

// var value = random.integer(1, 3);

/*====================================================
  Globals
====================================================*/

var prize_door = null;
var picked_door = null;
var final_choice = null;
var possibilities = [1,2,3];

//GLOBAL VARIABLE!!!
var simulation_number = 1000000;

//GLOBAL VARIABLE!!!
var wins = 0;

//GLOBAL VARIABLE!!!
var switchMe = true;

/*====================================================
  Driver Area
====================================================*/

main();



/*====================================================
  Functions
====================================================*/


function main(){
    console.log("\n\n========================");
    console.log("Running simulation...");
    console.log("========================");

    for (var i = 0; i < simulation_number; i++){
      //prize door is a random from 1 to 3
      prize_door = random.integer(1, 3);
      // console.log("Prize door: " + prize_door);


      //picked door is a random from 1 to 3
      picked_door = random.integer(1, 3);
      // console.log("Picked door: " + picked_door);

      //reveal one door
      // console.log(possibilities);
      switchDoor(prize_door, picked_door);



      //switch to second door

      //if door = prize, wins++
    }

    console.log("Number of wins: " + wins);
    console.log("Win percentage: " + wins/simulation_number*100 + "%");
    console.log("\n\n");
    elapsed_time("");


}

function switchDoor(prize, picked){

  if (prize != picked) {
    removePossible(prize, function(){
      removePossible(picked, function(){
        validateDoor(prize, picked);
      });
    })
  } else {
    removePossible(prize, function(){
      validateDoor(prize, picked);
    });
  }


  // console.log("\nPrinting possibilities...");
  // console.log(possibilities);


}

function removePossible(number, callback){
  try {
    var index = possibilities.indexOf(number);
    // possibilities.splice(index_prize, 1);
    // console.log("Removed " + possibilities.splice(index, 1))
    possibilities.splice(index, 1)
    // console.log(possibilities);

    callback();

  } catch (e) {
    console.log(e);
  }
}

function removeFromArray(array, number, callback){
  try {
    var index = array.indexOf(number);
    // possibilities.splice(index_prize, 1);
    // console.log("Removed " + array.splice(index, 1));
    array.splice(index, 1);
    // console.log(possibilities);

    callback();

  } catch (e) {
    console.log(e);
  }
}

function validateWins(p, fc){
  // console.log("Prize: " + p);
  // console.log("Choice: " + fc);
  if (p == fc){
    wins++;
  }
  possibilities = [1,2,3];
}
function validateDoor(prize, picked){
  switch (possibilities.length) {
    case 1:
      //The numbers are different
      //Reveal the only possible door
      // console.log("Revealing door " + possibilities[0] + " to be empty!\n");

      //Create new array, determine switched number
      var newArray = [1,2,3];
      //Remove the number we picked
      removeFromArray(newArray, picked, function(){
        //Remove the number that was revealed
        removeFromArray(newArray, possibilities[0], function(){
          // switchMe = true;
          if (switchMe){
            final_choice = newArray[0];
            // console.log("Final choice: " + final_choice);
          } else {
            final_choice = picked;
            // console.log("Final choice: " + final_choice);
          }

          validateWins(prize, final_choice);
        })
      });

      break;

    case 2:
      var revealNum = random.integer(1, 2);
      // console.log("Revealing door " + possibilities[revealNum] + " to be empty!\n");

      //Create new array, determine switched number
      var newArray = [1,2,3];
      //Remove the number we picked
      removeFromArray(newArray, picked, function(){
        //Remove the number that was revealed
        removeFromArray(newArray, possibilities[revealNum], function(){
          // switchMe = true;
          if (switchMe){
            final_choice = newArray[0];
            // console.log("Final choice: " + final_choice);
          } else {
            final_choice = picked;
            // console.log("Final choice: " + final_choice);
          }

          validateWins(prize, final_choice);
        })
      });


    default:

  }
}

function elapsed_time(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log("Execution Time: " + process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}