var Floor = /** @class */ (function () {
    function Floor(level) {
        this.level = level;
    }
    return Floor;
}());
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
                _this.playSound();
                _this.updateElevatorPosition();
                setTimeout(function () {
                    _this.isMoving = false;
                    if (_this.queue.length > 0) {
                        _this.isWaiting = true;
                        var nextFloor = _this.queue.shift();
                        if (nextFloor) {
                            _this.move(nextFloor);
                        }
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
    return Elevator;
}());
var ElevatorSystem = /** @class */ (function () {
    function ElevatorSystem(elevatorElements) {
        this.elevators = elevatorElements.map(function (element) { return new Elevator(element); });
    }
    ElevatorSystem.prototype.requestElevator = function (floor) {
        // Calculate the distance of each elevator to the requested floor
        var distances = this.elevators.map(function (elevator) { return Math.abs(elevator.currentFloor.level - floor.level); });
        // Find the index of the elevator with the minimum distance
        var closestElevatorIndex = distances.indexOf(Math.min.apply(Math, distances));
        // Request the floor for the closest elevator
        this.elevators[closestElevatorIndex].requestFloor(floor);
    };
    return ElevatorSystem;
}());
// Usage example
var elevatorElements = Array.prototype.slice.call(document.querySelectorAll('.elevator img'));
var elevatorSystem = new ElevatorSystem(elevatorElements.map(function (el) { return el; }));
function requestElevator(floor) {
    elevatorSystem.requestElevator(floor);
}
// Create a Building class and BuildingFactory class if needed
var Building = /** @class */ (function () {
    function Building(numberOfFloors, floorButtonsContainer) {
        this.numberOfFloors = numberOfFloors;
        this.floorButtonsContainer = floorButtonsContainer;
    }
    Building.prototype.createFloorButtons = function () {
        var _loop_1 = function (i) {
            var button = document.createElement('button');
            button.classList.add('floor', 'metal', 'linear');
            button.innerText = i.toString();
            button.addEventListener('click', function () {
                requestElevator(new Floor(i));
            }.bind(this_1));
            var div = document.createElement('div');
            div.classList.add('blackline');
            var floorDiv = document.createElement('div');
            floorDiv.classList.add('floor');
            floorDiv.appendChild(button);
            this_1.floorButtonsContainer.appendChild(div);
            this_1.floorButtonsContainer.appendChild(floorDiv);
        };
        var this_1 = this;
        for (var i = this.numberOfFloors; i >= 0; i--) {
            _loop_1(i);
        }
    };
    return Building;
}());
var BuildingFactory = /** @class */ (function () {
    function BuildingFactory() {
    }
    BuildingFactory.prototype.createBuilding = function (numberOfFloors, floorButtonsContainer) {
        return new Building(numberOfFloors, floorButtonsContainer);
    };
    return BuildingFactory;
}());
var floorButtonsContainer = document.getElementById('floorButtonsContainer');
var buildingFactory = new BuildingFactory();
var elevator = null;
// function requestElevator(floor: Floor) {
//   if (!elevator) {
//     elevator = new Elevator(document.querySelector('.elevator img')!);
//   }
//   elevator.requestFloor(floor);
// }
var numberOfFloors = 15;
var building = buildingFactory.createBuilding(numberOfFloors, floorButtonsContainer);
building.createFloorButtons();
