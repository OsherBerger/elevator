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

/***/ "./src/Building.ts":
/*!*************************!*\
  !*** ./src/Building.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**\n * This script represents a building with floors and an elevator system.\n * It creates floor buttons, manages elevator requests, and updates floor buttons' timers.\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Building = void 0;\nvar ElevatorSystem_1 = __webpack_require__(/*! ./ElevatorSystem */ \"./src/ElevatorSystem.ts\");\nvar Floor_1 = __webpack_require__(/*! ./Floor */ \"./src/Floor.ts\");\nvar Building = /** @class */ (function () {\n    function Building(numberOfFloors, container, numberOfElevators) {\n        this.numberOfFloors = numberOfFloors;\n        this.container = container;\n        this.numberOfElevators = numberOfElevators;\n        this.createFloorButtons();\n        this.createElevatorSystem();\n        this.setupElevatorArrivalListener();\n    }\n    Building.prototype.createFloorButtons = function () {\n        var _this = this;\n        var floorButtonsContainer = document.createElement('div');\n        floorButtonsContainer.classList.add('floorButtonsContainer');\n        var _loop_1 = function (i) {\n            var button = document.createElement('button');\n            button.classList.add('floor', 'metal', 'linear');\n            button.innerText = i.toString();\n            var timer = document.createElement('div');\n            timer.classList.add('timer');\n            button.appendChild(timer);\n            button.addEventListener('click', function () {\n                _this.requestElevator(new Floor_1.Floor(i), button);\n            });\n            var div = document.createElement('div');\n            div.classList.add('blackline');\n            var floorDiv = document.createElement('div');\n            floorDiv.classList.add('floor');\n            floorDiv.appendChild(button);\n            floorButtonsContainer.appendChild(floorDiv);\n            floorButtonsContainer.appendChild(div);\n        };\n        for (var i = 0; i <= this.numberOfFloors; i++) {\n            _loop_1(i);\n        }\n        var scrollContainer = document.createElement('div');\n        scrollContainer.classList.add('scrollContainer');\n        scrollContainer.appendChild(floorButtonsContainer);\n        this.container.appendChild(scrollContainer);\n    };\n    Building.prototype.createElevatorSystem = function () {\n        var elevatorsContainer = document.createElement('div');\n        elevatorsContainer.classList.add('elevatorsContainer', 'elevator');\n        elevatorsContainer.style.width = \"\".concat(this.numberOfElevators * 50, \"px\");\n        this.container.appendChild(elevatorsContainer);\n        this.elevatorSystem = new ElevatorSystem_1.ElevatorSystem(elevatorsContainer, this.numberOfElevators);\n    };\n    Building.prototype.requestElevator = function (floor, button) {\n        this.elevatorSystem.requestElevator(floor);\n        button.style.color = 'green';\n        this.updateTimer(floor, button);\n    };\n    Building.prototype.setupElevatorArrivalListener = function () {\n        var _this = this;\n        document.addEventListener('elevatorArrival', function (event) {\n            var floorLevel = event.detail.floorLevel;\n            _this.handleElevatorArrival(floorLevel);\n        });\n    };\n    Building.prototype.handleElevatorArrival = function (floorLevel) {\n        var buttons = document.querySelectorAll('.floorButtonsContainer .floor button');\n        buttons.forEach(function (button) {\n            if (button.innerText === floorLevel.toString()) {\n                var timer = button.querySelector('.timer');\n                if (timer) {\n                    timer.remove();\n                }\n            }\n        });\n    };\n    Building.prototype.updateTimer = function (targetFloor, button) {\n        var timer = button.querySelector('.timer');\n        if (!timer) {\n            timer = document.createElement('div');\n            timer.classList.add('timer');\n            button.appendChild(timer);\n        }\n        var closestElevator = null;\n        var minDistance = Infinity;\n        this.elevatorSystem.elevators.forEach(function (elevator) {\n            var distance = Math.abs(targetFloor.level - elevator.currentFloor.level);\n            if (distance < minDistance) {\n                minDistance = distance;\n                closestElevator = elevator;\n            }\n        });\n        if (closestElevator) {\n            var currentFloor = closestElevator.currentFloor;\n            var distance = Math.abs(targetFloor.level - currentFloor.level);\n            var queueLength = closestElevator.queue ? closestElevator.queue.length : 0;\n            var etaSeconds = distance * 0.5 + queueLength;\n            var seconds_1 = etaSeconds;\n            timer.innerText = \"\".concat(seconds_1);\n            timer.style.color = 'green';\n            var interval_1 = setInterval(function () {\n                seconds_1--;\n                if (seconds_1 >= 0) {\n                    timer.innerText = \"\".concat(seconds_1);\n                }\n                else {\n                    button.style.color = '';\n                    timer.style.color = 'red';\n                    timer.innerText = \"2\";\n                    seconds_1 = 2;\n                    var delayInterval_1 = setInterval(function () {\n                        seconds_1--;\n                        if (seconds_1 >= 0) {\n                            timer.innerText = \"\".concat(seconds_1);\n                        }\n                        else {\n                            clearInterval(delayInterval_1);\n                            timer.remove();\n                        }\n                    }, 500);\n                    clearInterval(interval_1);\n                }\n            }, 500);\n        }\n    };\n    return Building;\n}());\nexports.Building = Building;\n\n\n//# sourceURL=webpack:///./src/Building.ts?");

/***/ }),

/***/ "./src/BuildingFactory.ts":
/*!********************************!*\
  !*** ./src/BuildingFactory.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**\n * This script represents a factory class, for creating building objects, with specified configurations.\n * It creates building elements in the DOM and instantiates Building objects.\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.BuildingFactory = void 0;\nvar Building_1 = __webpack_require__(/*! ./Building */ \"./src/Building.ts\");\nvar BuildingFactory = /** @class */ (function () {\n    function BuildingFactory() {\n    }\n    BuildingFactory.prototype.createBuilding = function (numberOfFloors, numberOfElevators, buildingIndex) {\n        var _a;\n        var container = document.createElement('div');\n        container.classList.add('building');\n        container.style.width = \"\".concat(numberOfElevators * 50, \"px\");\n        container.style.marginLeft = \"\".concat(buildingIndex * (numberOfElevators * 50 + 285), \"px\");\n        (_a = document.getElementById('buildingsContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(container);\n        return new Building_1.Building(numberOfFloors, container, numberOfElevators);\n    };\n    return BuildingFactory;\n}());\nexports.BuildingFactory = BuildingFactory;\n\n\n//# sourceURL=webpack:///./src/BuildingFactory.ts?");

/***/ }),

/***/ "./src/Elevator.ts":
/*!*************************!*\
  !*** ./src/Elevator.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**\n * This script represents an elevator that can move between floors within a building.\n * It manages the elevator's movement, queue of floor requests, and updates its position visually.\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Elevator = void 0;\nvar Floor_1 = __webpack_require__(/*! ./Floor */ \"./src/Floor.ts\");\nvar Elevator = /** @class */ (function () {\n    function Elevator(element) {\n        this.currentFloor = new Floor_1.Floor(0);\n        this.isMoving = false;\n        this.queue = [];\n        this.isWaiting = false;\n        this.elevatorElement = element;\n        this.updateElevatorPosition();\n    }\n    Elevator.prototype.move = function (floor) {\n        var _this = this;\n        if (!this.isMoving) {\n            this.isMoving = true;\n            var currentY = parseInt(getComputedStyle(this.elevatorElement).getPropertyValue('transform').split(',')[5], 10);\n            var targetY = -57 * floor.level;\n            var distance = Math.abs(targetY - currentY);\n            var animationDuration = distance * 5;\n            var duration = Math.max(animationDuration, 0);\n            this.animateElevator(currentY, targetY, duration, function () {\n                _this.currentFloor = floor;\n                console.log(\"Elevator arrived at floor \".concat(_this.currentFloor.level));\n                _this.updateElevatorPosition();\n                _this.dispatchArrivalEvent();\n                _this.playSound();\n                setTimeout(function () {\n                    _this.isMoving = false;\n                    if (_this.queue.length > 0) {\n                        var nextFloor = _this.queue.shift();\n                        if (nextFloor) {\n                            _this.move(nextFloor);\n                        }\n                    }\n                    else {\n                        _this.isWaiting = false;\n                    }\n                }, 2000);\n            });\n        }\n        else {\n            this.queue.push(floor);\n            this.isWaiting = true;\n        }\n    };\n    Elevator.prototype.animateElevator = function (start, end, duration, callback) {\n        var _this = this;\n        var startTime = performance.now();\n        var animate = function (currentTime) {\n            var elapsedTime = currentTime - startTime;\n            var progress = Math.min(elapsedTime / duration, 1);\n            var newPosition = start + (end - start) * progress;\n            _this.elevatorElement.style.transform = \"translateY(\".concat(newPosition, \"px)\");\n            if (progress < 1) {\n                requestAnimationFrame(animate);\n            }\n            else {\n                callback();\n            }\n        };\n        requestAnimationFrame(animate);\n    };\n    Elevator.prototype.requestFloor = function (floor) {\n        if (!this.isWaiting) {\n            this.move(floor);\n        }\n        else {\n            this.queue.push(floor);\n        }\n    };\n    Elevator.prototype.playSound = function () {\n        var audio = new Audio('../assets/ding.mp3'); //path is for the bundle.js which is in the dis folder\n        audio.play();\n        console.log('Ding!');\n    };\n    Elevator.prototype.updateElevatorPosition = function () {\n        var translateY = \"calc(\".concat(this.currentFloor.level, \" * -57px)\");\n        this.elevatorElement.style.transform = \"translateY(\".concat(translateY, \")\");\n    };\n    Elevator.prototype.dispatchArrivalEvent = function () {\n        var arrivalEvent = new CustomEvent('elevatorArrival', {\n            detail: {\n                floorLevel: this.currentFloor.level\n            }\n        });\n        document.dispatchEvent(arrivalEvent);\n    };\n    return Elevator;\n}());\nexports.Elevator = Elevator;\n\n\n//# sourceURL=webpack:///./src/Elevator.ts?");

/***/ }),

/***/ "./src/ElevatorSystem.ts":
/*!*******************************!*\
  !*** ./src/ElevatorSystem.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**\n * This script represents an elevator system that manages multiple elevators.\n * It creates and handles the behavior of multiple elevators within a specified container.\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ElevatorSystem = void 0;\nvar Elevator_1 = __webpack_require__(/*! ./Elevator */ \"./src/Elevator.ts\");\nvar Floor_1 = __webpack_require__(/*! ./Floor */ \"./src/Floor.ts\");\nvar ElevatorSystem = /** @class */ (function () {\n    function ElevatorSystem(container, numberOfElevators) {\n        this.container = container;\n        this.numberOfElevators = numberOfElevators;\n        this.elevators = [];\n        this.createElevators();\n    }\n    ElevatorSystem.prototype.createElevators = function () {\n        for (var i = 0; i < this.numberOfElevators; i++) {\n            var elevator = new Elevator_1.Elevator(document.createElement('div'));\n            elevator.currentFloor = new Floor_1.Floor(0);\n            this.container.appendChild(elevator.elevatorElement);\n            var elevatorImage = document.createElement('img');\n            elevatorImage.src = '../assets/elv.png'; //path is for the bundle.js which is in the dis folder\n            elevatorImage.alt = 'elevator';\n            elevator.elevatorElement.appendChild(elevatorImage);\n            this.elevators.push(elevator);\n        }\n    };\n    ElevatorSystem.prototype.requestElevator = function (floor) {\n        var availableElevators = this.elevators.filter(function (elevator) { return !elevator.isWaiting; });\n        if (availableElevators.length > 0) {\n            var selectedElevator_1 = null;\n            var minETA_1 = Infinity;\n            availableElevators.forEach(function (elevator) {\n                var distanceToRequestedFloor = Math.abs(elevator.currentFloor.level - floor.level);\n                var ETA = distanceToRequestedFloor * 0.5 + elevator.queue.length;\n                if (ETA < minETA_1) {\n                    minETA_1 = ETA;\n                    selectedElevator_1 = elevator;\n                }\n            });\n            if (selectedElevator_1) {\n                selectedElevator_1.requestFloor(floor);\n                return;\n            }\n        }\n        // If all elevators are busy or there are no elevators, request from the ground floor\n        var shortestETA = Infinity;\n        var selectedElevator = null;\n        this.elevators.forEach(function (elevator) {\n            var distance = Math.abs(elevator.currentFloor.level - floor.level);\n            var ETA = distance * 0.5 + elevator.queue.length;\n            if (ETA < shortestETA) {\n                shortestETA = ETA;\n                selectedElevator = elevator;\n            }\n        });\n        if (selectedElevator) {\n            selectedElevator.requestFloor(floor);\n        }\n    };\n    return ElevatorSystem;\n}());\nexports.ElevatorSystem = ElevatorSystem;\n\n\n//# sourceURL=webpack:///./src/ElevatorSystem.ts?");

/***/ }),

/***/ "./src/Floor.ts":
/*!**********************!*\
  !*** ./src/Floor.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n/**\n * This script represents a floor in a building.\n * Each floor has a specific level number.\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Floor = void 0;\nvar Floor = /** @class */ (function () {\n    function Floor(level) {\n        this.level = level;\n    }\n    return Floor;\n}());\nexports.Floor = Floor;\n\n\n//# sourceURL=webpack:///./src/Floor.ts?");

/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/**\n * This script initializes building objects using the BuildingFactory class.\n * It creates multiple buildings with a specified number of floors and elevators.\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar BuildingFactory_1 = __webpack_require__(/*! ./BuildingFactory */ \"./src/BuildingFactory.ts\");\nvar buildingFactory = new BuildingFactory_1.BuildingFactory();\nvar numberOfFloors = 15;\nvar numberOfElevators = 3;\nvar numberOfBuildings = 3;\nfor (var i = 0; i < numberOfBuildings; i++) {\n    buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);\n}\n\n\n//# sourceURL=webpack:///./src/app.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.ts");
/******/ 	
/******/ })()
;