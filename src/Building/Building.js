"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
var ElevatorSystem_1 = require("../ElevatorSystem/ElevatorSystem");
var Floor_1 = require("../Floor/Floor");
// Building class
var Building = /** @class */ (function () {
    function Building(numberOfFloors, container, numberOfElevators) {
        this.numberOfFloors = numberOfFloors;
        this.container = container;
        this.numberOfElevators = numberOfElevators;
        this.createFloorButtons();
        this.createElevatorSystem();
        this.setupElevatorArrivalListener();
    }
    Building.prototype.createFloorButtons = function () {
        var _this = this;
        var floorButtonsContainer = document.createElement('div');
        floorButtonsContainer.classList.add('floorButtonsContainer');
        var _loop_1 = function (i) {
            var button = document.createElement('button');
            button.classList.add('floor', 'metal', 'linear');
            button.innerText = i.toString();
            var timer = document.createElement('div');
            timer.classList.add('timer');
            button.appendChild(timer); // Append the timer element to the button
            button.addEventListener('click', function () {
                _this.requestElevator(new Floor_1.Floor(i), button);
            });
            var div = document.createElement('div');
            div.classList.add('blackline');
            var floorDiv = document.createElement('div');
            floorDiv.classList.add('floor');
            floorDiv.appendChild(button);
            floorButtonsContainer.appendChild(floorDiv);
            floorButtonsContainer.appendChild(div);
        };
        // Loop from the ground floor (level 0) to the top floor
        for (var i = 0; i <= this.numberOfFloors; i++) {
            _loop_1(i);
        }
        // Wrap the floor buttons container in a scrollable container
        var scrollContainer = document.createElement('div');
        scrollContainer.classList.add('scrollContainer');
        scrollContainer.appendChild(floorButtonsContainer);
        this.container.appendChild(scrollContainer);
    };
    Building.prototype.createElevatorSystem = function () {
        var elevatorsContainer = document.createElement('div');
        elevatorsContainer.classList.add('elevatorsContainer', 'elevator');
        elevatorsContainer.style.width = "".concat(this.numberOfElevators * 50, "px"); // Adjust elevator container width
        this.container.appendChild(elevatorsContainer);
        this.elevatorSystem = new ElevatorSystem_1.ElevatorSystem(elevatorsContainer, this.numberOfElevators);
    };
    Building.prototype.requestElevator = function (floor, button) {
        this.elevatorSystem.requestElevator(floor);
        // Change the color of the button text to green
        button.style.color = 'green';
        // Start the timer for this floor button
        this.updateTimer(floor, button);
    };
    // Method to setup the elevator arrival listener
    Building.prototype.setupElevatorArrivalListener = function () {
        var _this = this;
        document.addEventListener('elevatorArrival', function (event) {
            var floorLevel = event.detail.floorLevel;
            _this.handleElevatorArrival(floorLevel);
        });
    };
    // Method to handle the elevator arrival and reset button color
    Building.prototype.handleElevatorArrival = function (floorLevel) {
        // Get all buttons within the floorButtonsContainer
        var buttons = document.querySelectorAll('.floorButtonsContainer .floor button');
        // Iterate over each button and find the one with the matching text content
        buttons.forEach(function (button) {
            if (button.innerText === floorLevel.toString()) {
                // Remove the timer element
                var timer = button.querySelector('.timer');
                if (timer) {
                    timer.remove();
                }
            }
        });
    };
    Building.prototype.updateTimer = function (targetFloor, button) {
        var timer = button.querySelector('.timer');
        if (timer) {
            var closestElevator_1 = null;
            var minDistance_1 = Infinity;
            // Find the closest elevator to the target floor
            this.elevatorSystem.elevators.forEach(function (elevator) {
                var distance = Math.abs(targetFloor.level - elevator.currentFloor.level);
                if (distance < minDistance_1) {
                    minDistance_1 = distance;
                    closestElevator_1 = elevator;
                }
            });
            if (closestElevator_1) {
                // Use type assertion to ensure TypeScript recognizes closestElevator as an Elevator instance
                var currentFloor = closestElevator_1.currentFloor;
                var distance = Math.abs(targetFloor.level - currentFloor.level);
                // Check if the elevator has a queue property before accessing its length
                var queueLength = closestElevator_1.queue ? closestElevator_1.queue.length : 0;
                var etaSeconds = distance * 0.5 + queueLength * 2; // Adjusting ETA based on queue length
                var seconds_1 = etaSeconds;
                timer.innerText = "".concat(seconds_1);
                var interval_1 = setInterval(function () {
                    seconds_1--;
                    if (seconds_1 >= 0) {
                        timer.innerText = "".concat(seconds_1);
                    }
                    else {
                        clearInterval(interval_1);
                        timer.remove();
                        button.style.color = '';
                    }
                }, 500);
            }
        }
    };
    return Building;
}());
exports.Building = Building;
