/*
    Solution to the Monty Hall Door Problem

    Author: Carl Eiserman
    Website: https://github.com/carl-eis

*/

/*====================================================
  Imports
====================================================*/

const Random = require("random-js");
const random = new Random(Random.engines.mt19937().autoSeed());
const fs = require('fs');
let start = process.hrtime();

/*====================================================
  Globals
====================================================*/

let SIMULATION_AMOUNT;
let NUMBER_OF_DOORS;
let DOOR_ARRAY;
let USE_SWITCH_STRATEGY;
let DEBUG_LOGGING;
let FAST_RUN;

const logger = {
    cache: "",
    info: "",
    debug: "",
    log: (input, level) => {
        if (!input) {
            input = "";
        }
        logger.cache += input + "\n";
    },
    print: () => logger.cache,
};


/*====================================================
  Driver Area
====================================================*/

readConfigFile(main);

// main();

function main() {
    let wins = 0;

    for (let i = 0; i < SIMULATION_AMOUNT; i++) {
        const [DOOR] = DOOR_ARRAY;
        //From the pool of available doors,
        //choose a winner and the picked one.

        const pickedDoor = random.integer(DOOR, DOOR_ARRAY.length);
        const prizeDoor = random.integer(DOOR, DOOR_ARRAY.length);

        if (USE_SWITCH_STRATEGY) {
            let increaseWins = FAST_RUN ? switchDoorFast(pickedDoor, prizeDoor) : switchDoor(pickedDoor, prizeDoor);

            if (increaseWins === true) {
                wins++;
            }
        }
        else if (prizeDoor === pickedDoor) {
            wins++;
        }
    }

    logger.log("WINS: " + wins, "info");
    logger.log("Win percentage: " + wins / SIMULATION_AMOUNT * 100 + "%", "info");

    console.log(logger.print());

    elapsed_time("");
}


/*====================================================
  Logic Area
====================================================*/

//This is where the bulk of the work will happen.

function removeOpenDoor(arr, doors) {
    for (let j in doors) {
        if (arr.indexOf(doors[j]) !== -1) {
            arr.splice(arr.indexOf(doors[j]), 1);
        }
    }
}

function switchDoor(pickedDoor, prizeDoor) {
    let switchTo;

    logger.log("DOOR ARRAY: " + DOOR_ARRAY, "debug");

    //Create a safe copy of the door array
    const arrChoices = cloneArray(DOOR_ARRAY);

    //Always remove the picked door from our temporary array,
    //because we can't open it
    arrChoices.splice(arrChoices.indexOf(pickedDoor), 1);

    logger.log("PICKED : " + pickedDoor, "debug");
    logger.log("PRIZE: " + prizeDoor, "debug");
    logger.log("ARRAY WITH PICKED REMOVED: " + arrChoices, "debug");

    //If the picked door and the prize door are the same
    if (pickedDoor === prizeDoor) {

        //Pick a random door that will stay closed;
        //All the others will be revealed
        const indexOfSwitchDoor = random.integer(0, arrChoices.length - 1);
        switchTo = arrChoices[indexOfSwitchDoor];

        logger.log("SWITCH TO: " + switchTo, "debug");

        const arrOpenedDoors = cloneArray(arrChoices);
        arrOpenedDoors.splice(arrChoices.indexOf(switchTo), 1);

        //Remove the opened doors from arrChoices
        removeOpenDoor(arrChoices, arrOpenedDoors);

        logger.log("RESULTING ARRAY: " + arrChoices, "debug");
    }
    //If the picked door and the prize door are different
    else {
        //Remove the prize door, because we don't open it
        const arrOpenedDoors = cloneArray(arrChoices);
        arrOpenedDoors.splice(arrChoices.indexOf(prizeDoor));

        //Remove the opened doors from arrChoices
        removeOpenDoor(arrChoices, arrOpenedDoors);

        switchTo = arrChoices[0];
    }

    logger.log(null, "debug");
    return (switchTo === prizeDoor);
}

function switchDoorFast(pickedDoor, prizeDoor) {
    let switchTo;

    const arrChoices = cloneArray(DOOR_ARRAY);
    arrChoices.splice(arrChoices.indexOf(pickedDoor), 1);

    if (pickedDoor === prizeDoor) {
        const indexOfSwitchDoor = random.integer(0, arrChoices.length - 1);
        switchTo = arrChoices[indexOfSwitchDoor];
    }
    else {
        switchTo = prizeDoor;
    }
    return (switchTo === prizeDoor);
}

/*====================================================
  Tool Functions
====================================================*/

function populateDoorArray(input) {
    return Array.from(Array(input).keys(), n => n + 1);
}

function elapsed_time(note) {
    const precision = 3; // 3 decimal places
    const elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log("Execution Time: " + process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}


function cloneArray(input) {
    return input.slice(0);
}

function readConfigFile(callback) {
    const settingsRead = require("./monty_settings.json");

    SIMULATION_AMOUNT = settingsRead.SIMULATION_AMOUNT;
    NUMBER_OF_DOORS = settingsRead.NUMBER_OF_DOORS;
    DOOR_ARRAY = populateDoorArray(NUMBER_OF_DOORS);
    USE_SWITCH_STRATEGY = settingsRead.USE_SWITCH_STRATEGY;
    DEBUG_LOGGING = settingsRead.DEBUG_LOGGING;
    FAST_RUN = settingsRead.FAST_RUN;

    callback();
}
