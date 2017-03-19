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
var fs = require('fs');

/*====================================================
  Globals
====================================================*/

var SIMULATION_AMOUNT;
var NUMBER_OF_DOORS;
var DOOR_ARRAY;
var USE_SWITCH_STRATEGY;
var DEBUG_LOGGING;
var FAST_RUN;

var logger = {
	cache: "",
	info: "",
	debug: "",
	log: function(input, level){
		if (input == null || input == undefined){
			input = "";
		}
		if (level == null || level == undefined){
			level == "info";
			logger.cache += input + "\n";
		}

		if (level == "info"){
			logger.cache += input + "\n";
		}
		if (level == "debug" && DEBUG_LOGGING == true){
			logger.cache += input + "\n";
		}
	},

	print: function(){
		return logger.cache;
	}
};


/*====================================================
  Driver Area
====================================================*/

readConfigFile(main);

// main();

function main(){

	var wins = 0;

	for (var i = 0; i < SIMULATION_AMOUNT; i++){

		//From the pool of available doors, 
		//choose a winner and the picked one.

		var pickedDoor = random.integer(DOOR_ARRAY[0], DOOR_ARRAY.length);
		var prizeDoor = random.integer(DOOR_ARRAY[0], DOOR_ARRAY.length);

		if (USE_SWITCH_STRATEGY){
			var increaseWins = false;

			if (!FAST_RUN){
				increaseWins = switchDoor(pickedDoor, prizeDoor);
			} else{
				increaseWins = switchDoorFast(pickedDoor, prizeDoor);
			}

			if (increaseWins == true){
				wins++;
			}
		}

		else if (prizeDoor == pickedDoor){
			wins++;
		}


	}

	logger.log("WINS: " + wins, "info");
    logger.log("Win percentage: " + wins/SIMULATION_AMOUNT*100 + "%", "info");

    console.log(logger.print());

    // console.log("\n" + console.timeEnd());
    // console.log("Time to execute: " + elapsed_time(""));
    elapsed_time("");
}


/*====================================================
  Logic Area
====================================================*/

//This is where the bulk of the work will happen.

function switchDoor(pickedDoor, prizeDoor){

	var switchTo;

	logger.log("DOOR ARRAY: " + DOOR_ARRAY, "debug");

	//Create a safe copy of the door array
	var arrChoices = cloneArray(DOOR_ARRAY);

	//Always remove the picked door from our temporary array,
	//because we can't open it
	arrChoices.splice(arrChoices.indexOf(pickedDoor), 1);

	logger.log("PICKED : " + pickedDoor, "debug");
	logger.log("PRIZE: " + prizeDoor, "debug");
	logger.log("ARRAY WITH PICKED REMOVED: " + arrChoices, "debug");	

	//If the picked door and the prize door are the same
	if (pickedDoor == prizeDoor){

		//Pick a random door that will stay closed;
		//All the others will be revealed
		var indexOfSwitchDoor = random.integer(0, arrChoices.length-1);
		switchTo = arrChoices[indexOfSwitchDoor];

		logger.log("SWITCH TO: " + switchTo, "debug");

		var arrOpenedDoors = cloneArray(arrChoices);
		arrOpenedDoors.splice(arrChoices.indexOf(switchTo), 1);

		//Remove the opened doors from arrChoices
		for (j in arrOpenedDoors){
			if (arrChoices.indexOf(arrOpenedDoors[j]) != -1){
				arrChoices.splice(arrChoices.indexOf(arrOpenedDoors[j]), 1);
			}
		}

		logger.log("RESULTING ARRAY: " + arrChoices, "debug");


	} 
	//If the picked door and the prize door are different
	else{
		//Remove the prize door, because we don't open it
		var arrOpenedDoors = cloneArray(arrChoices);
		arrOpenedDoors.splice(arrChoices.indexOf(prizeDoor));

		//Remove the opened doors from arrChoices
		for (j in arrOpenedDoors){
			if (arrChoices.indexOf(arrOpenedDoors[j]) != -1){
				arrChoices.splice(arrChoices.indexOf(arrOpenedDoors[j]), 1);
			}
		}

		switchTo = arrChoices[0];
	}

	logger.log(null, "debug");
	return (switchTo == prizeDoor);
}

function switchDoorFast(pickedDoor, prizeDoor){

	var switchTo;

	var arrChoices = cloneArray(DOOR_ARRAY);
	arrChoices.splice(arrChoices.indexOf(pickedDoor), 1);

	if (pickedDoor == prizeDoor){
		var indexOfSwitchDoor = random.integer(0, arrChoices.length-1);
		switchTo = arrChoices[indexOfSwitchDoor];
	} 
	else{
		switchTo = prizeDoor;
	}
	return (switchTo == prizeDoor);
}

/*====================================================
  Tool Functions
====================================================*/

function populateDoorArray(input){
	var returnMe = [];

	for (var i = 0; i < input; i++){
		returnMe.push(i+1);
	}
	return returnMe;
}

function elapsed_time(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log("Execution Time: " + process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}


function cloneArray(input){
	return input.slice(0);
}

function readConfigFile(callback){
	// callback();
	var settingsRead = require("./monty_settings.json");

	SIMULATION_AMOUNT = settingsRead.SIMULATION_AMOUNT;
	NUMBER_OF_DOORS = settingsRead.NUMBER_OF_DOORS;
	DOOR_ARRAY = populateDoorArray(NUMBER_OF_DOORS);
	USE_SWITCH_STRATEGY = settingsRead.USE_SWITCH_STRATEGY;
	DEBUG_LOGGING = settingsRead.DEBUG_LOGGING;
	FAST_RUN = settingsRead.FAST_RUN;

	callback();
}