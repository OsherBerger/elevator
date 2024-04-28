"use strict";
// Floor class
var Floor = /** @class */ (function () {
    function Floor(level) {
        this.level = level;
    }
    return Floor;
}());
// Elevator class
var Elevator = /** @class */ (function () {
    function Elevator(element) {
        this.currentFloor = new Floor(0);
        this.isMoving = false;
        this.queue = [];
        this.isWaiting = false;
        this.elevatorElement = element;
        this.updateElevatorPosition(); // Set the initial position
    }
    Elevator.prototype.move = function (floor) {
        var _this = this;
        if (!this.isMoving) {
            // If the elevator is not moving, start moving to the requested floor
            this.isMoving = true;
            var currentY = parseInt(getComputedStyle(this.elevatorElement).getPropertyValue('transform').split(',')[5], 10);
            var targetY = -57 * floor.level;
            // Calculate the distance and duration of the animation
            var distance = Math.abs(targetY - currentY);
            var animationDuration = distance * 5;
            // Ensure animationDuration is non-negative
            var duration = Math.max(animationDuration, 0);
            // Animate the elevator's movement
            this.animateElevator(currentY, targetY, duration, function () {
                _this.currentFloor = floor;
                console.log("Elevator arrived at floor ".concat(_this.currentFloor.level));
                _this.updateElevatorPosition();
                _this.dispatchArrivalEvent(); // Dispatch the arrival event
                _this.playSound(); // Play the sound immediately after updating position
                setTimeout(function () {
                    _this.isMoving = false;
                    if (_this.queue.length > 0) {
                        var nextFloor = _this.queue.shift();
                        if (nextFloor) {
                            _this.move(nextFloor);
                        }
                    }
                    else {
                        _this.isWaiting = false; // Reset isWaiting flag
                    }
                }, 2000);
            });
        }
        else {
            // If the elevator is already moving, add the floor to the queue
            this.queue.push(floor);
            // Update the flag to indicate that the elevator is waiting for its current movement to finish
            this.isWaiting = true;
        }
    };
    // Function to animate the elevator's movement
    Elevator.prototype.animateElevator = function (start, end, duration, callback) {
        var _this = this;
        var startTime = performance.now();
        var animate = function (currentTime) {
            var elapsedTime = currentTime - startTime;
            var progress = Math.min(elapsedTime / duration, 1);
            var newPosition = start + (end - start) * progress;
            _this.elevatorElement.style.transform = "translateY(".concat(newPosition, "px)");
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else {
                callback();
            }
        };
        requestAnimationFrame(animate);
    };
    Elevator.prototype.requestFloor = function (floor) {
        if (!this.isWaiting) {
            this.move(floor);
        }
        else {
            this.queue.push(floor);
        }
    };
    Elevator.prototype.playSound = function () {
        var audio = new Audio('ding.mp3');
        audio.play();
        console.log('Ding!');
    };
    Elevator.prototype.updateElevatorPosition = function () {
        var translateY = "calc(".concat(this.currentFloor.level, " * -57px)");
        this.elevatorElement.style.transform = "translateY(".concat(translateY, ")");
    };
    // Method to dispatch the elevator arrival event
    Elevator.prototype.dispatchArrivalEvent = function () {
        var arrivalEvent = new CustomEvent('elevatorArrival', {
            detail: {
                floorLevel: this.currentFloor.level
            }
        });
        document.dispatchEvent(arrivalEvent);
    };
    return Elevator;
}());
// ElevatorSystem class
var ElevatorSystem = /** @class */ (function () {
    function ElevatorSystem(container, numberOfElevators) {
        this.container = container;
        this.numberOfElevators = numberOfElevators;
        this.elevators = [];
        this.createElevators();
    }
    ElevatorSystem.prototype.createElevators = function () {
        for (var i = 0; i < this.numberOfElevators; i++) {
            var elevator = new Elevator(document.createElement('div')); // Create a new Elevator instance
            // Set the initial position of the elevator to the bottom floor
            elevator.currentFloor = new Floor(0);
            // Append the elevator container to the elevatorsContainer
            this.container.appendChild(elevator.elevatorElement);
            // Append an image element to the elevator container for styling
            var elevatorImage = document.createElement('img');
            elevatorImage.src = 'elv.png'; // Set the source of the elevator image
            elevatorImage.alt = 'elevator';
            elevator.elevatorElement.appendChild(elevatorImage); // Append the image to the elevator container
            this.elevators.push(elevator);
        }
    };
    ElevatorSystem.prototype.requestElevator = function (floor) {
        // Find all available elevators
        var availableElevators = this.elevators.filter(function (elevator) { return !elevator.isMoving; });
        if (availableElevators.length > 0) {
            // Calculate the distance of each available elevator to the requested floor
            var distances = availableElevators.map(function (elevator) { return Math.abs(elevator.currentFloor.level - floor.level); });
            // Find the index of the nearest available elevator
            var closestElevatorIndex = distances.indexOf(Math.min.apply(Math, distances));
            // Request the floor for the nearest available elevator
            availableElevators[closestElevatorIndex].requestFloor(floor);
        }
        else {
            // If all elevators are busy, queue the request until an elevator becomes available
            var distances = this.elevators.map(function (elevator) { return Math.abs(elevator.currentFloor.level - floor.level); });
            var closestElevatorIndex = distances.indexOf(Math.min.apply(Math, distances));
            this.elevators[closestElevatorIndex].queue.push(floor);
        }
    };
    return ElevatorSystem;
}());
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
                _this.requestElevator(new Floor(i), button);
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
        this.elevatorSystem = new ElevatorSystem(elevatorsContainer, this.numberOfElevators);
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
            // Ensure elevatorSystem.elevators only contains Elevator instances
            var elevators = this.elevatorSystem.elevators.filter(function (elevator) { return elevator instanceof Elevator; });
            // Find the closest elevator to the target floor
            elevators.forEach(function (elevator) {
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
                var etaSeconds = distance * 0.5; // Assuming 0.5 seconds per floor
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
// BuildingFactory class
var BuildingFactory = /** @class */ (function () {
    function BuildingFactory() {
    }
    BuildingFactory.prototype.createBuilding = function (numberOfFloors, numberOfElevators, marginLeft) {
        var _a;
        var container = document.createElement('div');
        container.classList.add('building');
        container.style.width = "".concat(numberOfElevators * 50, "px"); // Adjust building width
        container.style.marginLeft = "".concat(marginLeft, "px"); // Add margin to the building
        (_a = document.getElementById('buildingsContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(container);
        var buildingsContainer = document.getElementById('buildingsContainer');
        if (buildingsContainer) {
            buildingsContainer.style.display = 'flex';
        }
        return new Building(numberOfFloors, container, numberOfElevators);
    };
    return BuildingFactory;
}());
// Create buildings
var buildingFactory = new BuildingFactory();
var numberOfFloors = 9;
var numberOfElevators = 3;
var numberOfBuildings = 2;
var buildingMargin = 80 + (numberOfElevators * 50);
var marginLeft = 0;
for (var i = 0; i < numberOfBuildings; i++) {
    buildingFactory.createBuilding(numberOfFloors, numberOfElevators, marginLeft);
    marginLeft = buildingMargin;
}
//ToDo: Improve the Elevator algorithm and update the timer accordingly
//Todo: Improve way to build floors so no problem would appear at any number of floors
