/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Building/Building.ts":
/*!**********************************!*\
  !*** ./src/Building/Building.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Building = void 0;\nvar ElevatorSystem_1 = __webpack_require__(/*! ../ElevatorSystem/ElevatorSystem */ \"./src/ElevatorSystem/ElevatorSystem.ts\");\nvar Floor_1 = __webpack_require__(/*! ../Floor/Floor */ \"./src/Floor/Floor.ts\");\n// Building class\nvar Building = /** @class */ (function () {\n    function Building(numberOfFloors, container, numberOfElevators) {\n        this.numberOfFloors = numberOfFloors;\n        this.container = container;\n        this.numberOfElevators = numberOfElevators;\n        this.createFloorButtons();\n        this.createElevatorSystem();\n        this.setupElevatorArrivalListener();\n    }\n    Building.prototype.createFloorButtons = function () {\n        var _this = this;\n        var floorButtonsContainer = document.createElement('div');\n        floorButtonsContainer.classList.add('floorButtonsContainer');\n        var _loop_1 = function (i) {\n            var button = document.createElement('button');\n            button.classList.add('floor', 'metal', 'linear');\n            button.innerText = i.toString();\n            var timer = document.createElement('div');\n            timer.classList.add('timer');\n            button.appendChild(timer); // Append the timer element to the button\n            button.addEventListener('click', function () {\n                _this.requestElevator(new Floor_1.Floor(i), button);\n            });\n            var div = document.createElement('div');\n            div.classList.add('blackline');\n            var floorDiv = document.createElement('div');\n            floorDiv.classList.add('floor');\n            floorDiv.appendChild(button);\n            floorButtonsContainer.appendChild(floorDiv);\n            floorButtonsContainer.appendChild(div);\n        };\n        // Loop from the ground floor (level 0) to the top floor\n        for (var i = 0; i <= this.numberOfFloors; i++) {\n            _loop_1(i);\n        }\n        // Wrap the floor buttons container in a scrollable container\n        var scrollContainer = document.createElement('div');\n        scrollContainer.classList.add('scrollContainer');\n        scrollContainer.appendChild(floorButtonsContainer);\n        this.container.appendChild(scrollContainer);\n    };\n    Building.prototype.createElevatorSystem = function () {\n        var elevatorsContainer = document.createElement('div');\n        elevatorsContainer.classList.add('elevatorsContainer', 'elevator');\n        elevatorsContainer.style.width = \"\".concat(this.numberOfElevators * 50, \"px\"); // Adjust elevator container width\n        this.container.appendChild(elevatorsContainer);\n        this.elevatorSystem = new ElevatorSystem_1.ElevatorSystem(elevatorsContainer, this.numberOfElevators);\n    };\n    Building.prototype.requestElevator = function (floor, button) {\n        this.elevatorSystem.requestElevator(floor);\n        // Change the color of the button text to green\n        button.style.color = 'green';\n        // Start the timer for this floor button\n        this.updateTimer(floor, button);\n    };\n    // Method to setup the elevator arrival listener\n    Building.prototype.setupElevatorArrivalListener = function () {\n        var _this = this;\n        document.addEventListener('elevatorArrival', function (event) {\n            var floorLevel = event.detail.floorLevel;\n            _this.handleElevatorArrival(floorLevel);\n        });\n    };\n    // Method to handle the elevator arrival and reset button color\n    Building.prototype.handleElevatorArrival = function (floorLevel) {\n        // Get all buttons within the floorButtonsContainer\n        var buttons = document.querySelectorAll('.floorButtonsContainer .floor button');\n        // Iterate over each button and find the one with the matching text content\n        buttons.forEach(function (button) {\n            if (button.innerText === floorLevel.toString()) {\n                // Remove the timer element\n                var timer = button.querySelector('.timer');\n                if (timer) {\n                    timer.remove();\n                }\n            }\n        });\n    };\n    Building.prototype.updateTimer = function (targetFloor, button) {\n        var timer = button.querySelector('.timer');\n        if (timer) {\n            var closestElevator_1 = null;\n            var minDistance_1 = Infinity;\n            // Find the closest elevator to the target floor\n            this.elevatorSystem.elevators.forEach(function (elevator) {\n                var distance = Math.abs(targetFloor.level - elevator.currentFloor.level);\n                if (distance < minDistance_1) {\n                    minDistance_1 = distance;\n                    closestElevator_1 = elevator;\n                }\n            });\n            if (closestElevator_1) {\n                // Use type assertion to ensure TypeScript recognizes closestElevator as an Elevator instance\n                var currentFloor = closestElevator_1.currentFloor;\n                var distance = Math.abs(targetFloor.level - currentFloor.level);\n                // Check if the elevator has a queue property before accessing its length\n                var queueLength = closestElevator_1.queue ? closestElevator_1.queue.length : 0;\n                var etaSeconds = distance * 0.5 + queueLength * 2; // Adjusting ETA based on queue length\n                var seconds_1 = etaSeconds;\n                timer.innerText = \"\".concat(seconds_1);\n                var interval_1 = setInterval(function () {\n                    seconds_1--;\n                    if (seconds_1 >= 0) {\n                        timer.innerText = \"\".concat(seconds_1);\n                    }\n                    else {\n                        clearInterval(interval_1);\n                        timer.remove();\n                        button.style.color = '';\n                    }\n                }, 500);\n            }\n        }\n    };\n    return Building;\n}());\nexports.Building = Building;\n\n\n//# sourceURL=webpack:///./src/Building/Building.ts?");

/***/ }),

/***/ "./src/BuildingFactory/BuildingFactory.ts":
/*!************************************************!*\
  !*** ./src/BuildingFactory/BuildingFactory.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.BuildingFactory = void 0;\nvar Building_1 = __webpack_require__(/*! ../Building/Building */ \"./src/Building/Building.ts\");\n// BuildingFactory class\nvar BuildingFactory = /** @class */ (function () {\n    function BuildingFactory() {\n    }\n    BuildingFactory.prototype.createBuilding = function (numberOfFloors, numberOfElevators, buildingIndex) {\n        var _a;\n        var container = document.createElement('div');\n        container.classList.add('building');\n        container.style.width = \"\".concat(numberOfElevators * 50, \"px\"); // Adjust building width\n        container.style.marginLeft = \"\".concat(buildingIndex * (numberOfElevators * 50 + 200), \"px\"); // Add margin to the building\n        (_a = document.getElementById('buildingsContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(container);\n        return new Building_1.Building(numberOfFloors, container, numberOfElevators);\n    };\n    return BuildingFactory;\n}());\nexports.BuildingFactory = BuildingFactory;\n\n\n//# sourceURL=webpack:///./src/BuildingFactory/BuildingFactory.ts?");

/***/ }),

/***/ "./src/Elevator/Elevator.ts":
/*!**********************************!*\
  !*** ./src/Elevator/Elevator.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Elevator = void 0;\nvar Floor_1 = __webpack_require__(/*! ../Floor/Floor */ \"./src/Floor/Floor.ts\");\n// Elevator class\nvar Elevator = /** @class */ (function () {\n    function Elevator(element) {\n        this.currentFloor = new Floor_1.Floor(0);\n        this.isMoving = false;\n        this.queue = [];\n        this.isWaiting = false;\n        this.elevatorElement = element;\n        this.updateElevatorPosition(); // Set the initial position\n    }\n    Elevator.prototype.move = function (floor) {\n        var _this = this;\n        if (!this.isMoving) {\n            // If the elevator is not moving, start moving to the requested floor\n            this.isMoving = true;\n            var currentY = parseInt(getComputedStyle(this.elevatorElement).getPropertyValue('transform').split(',')[5], 10);\n            var targetY = -57 * floor.level;\n            // Calculate the distance and duration of the animation\n            var distance = Math.abs(targetY - currentY);\n            var animationDuration = distance * 5;\n            // Ensure animationDuration is non-negative\n            var duration = Math.max(animationDuration, 0);\n            // Animate the elevator's movement\n            this.animateElevator(currentY, targetY, duration, function () {\n                _this.currentFloor = floor;\n                console.log(\"Elevator arrived at floor \".concat(_this.currentFloor.level));\n                _this.updateElevatorPosition();\n                _this.dispatchArrivalEvent(); // Dispatch the arrival event\n                _this.playSound(); // Play the sound immediately after updating position\n                setTimeout(function () {\n                    _this.isMoving = false;\n                    if (_this.queue.length > 0) {\n                        var nextFloor = _this.queue.shift();\n                        if (nextFloor) {\n                            _this.move(nextFloor);\n                        }\n                    }\n                    else {\n                        _this.isWaiting = false; // Reset isWaiting flag\n                    }\n                }, 2000);\n            });\n        }\n        else {\n            // If the elevator is already moving, add the floor to the queue\n            this.queue.push(floor);\n            // Update the flag to indicate that the elevator is waiting for its current movement to finish\n            this.isWaiting = true;\n        }\n    };\n    // Function to animate the elevator's movement\n    Elevator.prototype.animateElevator = function (start, end, duration, callback) {\n        var _this = this;\n        var startTime = performance.now();\n        var animate = function (currentTime) {\n            var elapsedTime = currentTime - startTime;\n            var progress = Math.min(elapsedTime / duration, 1);\n            var newPosition = start + (end - start) * progress;\n            _this.elevatorElement.style.transform = \"translateY(\".concat(newPosition, \"px)\");\n            if (progress < 1) {\n                requestAnimationFrame(animate);\n            }\n            else {\n                callback();\n            }\n        };\n        requestAnimationFrame(animate);\n    };\n    Elevator.prototype.requestFloor = function (floor) {\n        if (!this.isWaiting) {\n            this.move(floor);\n        }\n        else {\n            this.queue.push(floor);\n        }\n    };\n    Elevator.prototype.playSound = function () {\n        var audio = new Audio('ding.mp3');\n        audio.play();\n        console.log('Ding!');\n    };\n    Elevator.prototype.updateElevatorPosition = function () {\n        var translateY = \"calc(\".concat(this.currentFloor.level, \" * -57px)\");\n        this.elevatorElement.style.transform = \"translateY(\".concat(translateY, \")\");\n    };\n    // Method to dispatch the elevator arrival event\n    Elevator.prototype.dispatchArrivalEvent = function () {\n        var arrivalEvent = new CustomEvent('elevatorArrival', {\n            detail: {\n                floorLevel: this.currentFloor.level\n            }\n        });\n        document.dispatchEvent(arrivalEvent);\n    };\n    return Elevator;\n}());\nexports.Elevator = Elevator;\n\n\n//# sourceURL=webpack:///./src/Elevator/Elevator.ts?");

/***/ }),

/***/ "./src/ElevatorSystem/ElevatorSystem.ts":
/*!**********************************************!*\
  !*** ./src/ElevatorSystem/ElevatorSystem.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ElevatorSystem = void 0;\nvar Elevator_1 = __webpack_require__(/*! ../Elevator/Elevator */ \"./src/Elevator/Elevator.ts\");\nvar Floor_1 = __webpack_require__(/*! ../Floor/Floor */ \"./src/Floor/Floor.ts\");\n// ElevatorSystem class\nvar ElevatorSystem = /** @class */ (function () {\n    function ElevatorSystem(container, numberOfElevators) {\n        this.container = container;\n        this.numberOfElevators = numberOfElevators;\n        this.elevators = [];\n        this.createElevators();\n    }\n    ElevatorSystem.prototype.createElevators = function () {\n        for (var i = 0; i < this.numberOfElevators; i++) {\n            var elevator = new Elevator_1.Elevator(document.createElement('div')); // Create a new Elevator instance\n            // Set the initial position of the elevator to the bottom floor\n            elevator.currentFloor = new Floor_1.Floor(0);\n            // Append the elevator container to the elevatorsContainer\n            this.container.appendChild(elevator.elevatorElement);\n            // Append an image element to the elevator container for styling\n            var elevatorImage = document.createElement('img');\n            elevatorImage.src = 'elv.png'; // Set the source of the elevator image\n            elevatorImage.alt = 'elevator';\n            elevator.elevatorElement.appendChild(elevatorImage); // Append the image to the elevator container\n            this.elevators.push(elevator);\n        }\n    };\n    ElevatorSystem.prototype.requestElevator = function (floor) {\n        // Find all available elevators\n        var availableElevators = this.elevators.filter(function (elevator) { return !elevator.isMoving; });\n        if (availableElevators.length > 0) {\n            // Calculate the distance of each available elevator to the requested floor\n            var distances = availableElevators.map(function (elevator) { return Math.abs(elevator.currentFloor.level - floor.level); });\n            // Find the index of the nearest available elevator\n            var closestElevatorIndex = distances.indexOf(Math.min.apply(Math, distances));\n            // Request the floor for the nearest available elevator\n            availableElevators[closestElevatorIndex].requestFloor(floor);\n        }\n        else {\n            // Find the elevator with the shortest estimated time of arrival (ETA)\n            var shortestETA_1 = Infinity;\n            var selectedElevator_1 = null;\n            this.elevators.forEach(function (elevator) {\n                var distance = Math.abs(elevator.currentFloor.level - floor.level);\n                var ETA = distance * 0.5 + elevator.queue.length * 2; // Adjusting ETA based on queue length\n                if (ETA < shortestETA_1) {\n                    shortestETA_1 = ETA;\n                    selectedElevator_1 = elevator;\n                }\n            });\n            if (selectedElevator_1) {\n                selectedElevator_1.requestFloor(floor);\n            }\n        }\n    };\n    return ElevatorSystem;\n}());\nexports.ElevatorSystem = ElevatorSystem;\n\n\n//# sourceURL=webpack:///./src/ElevatorSystem/ElevatorSystem.ts?");

/***/ }),

/***/ "./src/Floor/Floor.ts":
/*!****************************!*\
  !*** ./src/Floor/Floor.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Floor = void 0;\n// Floor class\nvar Floor = /** @class */ (function () {\n    function Floor(level) {\n        this.level = level;\n    }\n    return Floor;\n}());\nexports.Floor = Floor;\n\n\n//# sourceURL=webpack:///./src/Floor/Floor.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar BuildingFactory_1 = __webpack_require__(/*! ./BuildingFactory/BuildingFactory */ \"./src/BuildingFactory/BuildingFactory.ts\");\n// Create buildings\nvar buildingFactory = new BuildingFactory_1.BuildingFactory();\nvar numberOfFloors = 15;\nvar numberOfElevators = 3;\nvar numberOfBuildings = 3;\nfor (var i = 0; i < numberOfBuildings; i++) {\n    buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);\n}\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;