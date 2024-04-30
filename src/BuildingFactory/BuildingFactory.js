"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingFactory = void 0;
var Building_1 = require("../Building/Building");
// BuildingFactory class
var BuildingFactory = /** @class */ (function () {
    function BuildingFactory() {
    }
    BuildingFactory.prototype.createBuilding = function (numberOfFloors, numberOfElevators, buildingIndex) {
        var _a;
        var container = document.createElement('div');
        container.classList.add('building');
        container.style.width = "".concat(numberOfElevators * 50, "px"); // Adjust building width
        container.style.marginLeft = "".concat(buildingIndex * (numberOfElevators * 50 + 200), "px"); // Add margin to the building
        (_a = document.getElementById('buildingsContainer')) === null || _a === void 0 ? void 0 : _a.appendChild(container);
        return new Building_1.Building(numberOfFloors, container, numberOfElevators);
    };
    return BuildingFactory;
}());
exports.BuildingFactory = BuildingFactory;
