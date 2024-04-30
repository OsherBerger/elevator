"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElevatorSystem = void 0;
var Elevator_1 = require("../Elevator/Elevator");
var Floor_1 = require("../Floor/Floor");
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
            var elevator = new Elevator_1.Elevator(document.createElement('div')); // Create a new Elevator instance
            elevator.currentFloor = new Floor_1.Floor(0);
            this.container.appendChild(elevator.elevatorElement);
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
            // Find the elevator with the shortest estimated time of arrival (ETA)
            var shortestETA_1 = Infinity;
            var selectedElevator_1 = null;
            this.elevators.forEach(function (elevator) {
                var distance = Math.abs(elevator.currentFloor.level - floor.level);
                var ETA = distance * 0.5 + elevator.queue.length * 2; // Adjusting ETA based on queue length
                if (ETA < shortestETA_1) {
                    shortestETA_1 = ETA;
                    selectedElevator_1 = elevator;
                }
            });
            if (selectedElevator_1) {
                selectedElevator_1.requestFloor(floor);
            }
        }
    };
    return ElevatorSystem;
}());
exports.ElevatorSystem = ElevatorSystem;
