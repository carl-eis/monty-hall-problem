# Monty Hall - Javascript
A simple solution to the monty hall problem, using javascript.



### Getting started

Clone the repo:

    $ git clone https://github.com/carl-eis/monty-hall-problem.git
    $ cd monty-hall-problem
    $ npm install -g yarn
    $ yarn

Run the program:

    $ node monty.js

### Notes

You can change the boolean `switchMe` to choose whether a contestant
will implement a switch strategy or not.


### Config Variables

- **SIMULATION_AMOUNT** - Number of simulations to run 
- **NUMBER_OF_DOORS** - Number of doors to use (must be 3 or more)
- **USE_SWITCH_STRATEGY** - True if switching every time
- **DEBUG_LOGGING** - (slow mode only) - log debug text to console
- **FAST_RUN** - Run improved algorithym