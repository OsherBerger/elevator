"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BuildingFactory_1 = require("./BuildingFactory/BuildingFactory");
// Create buildings
var buildingFactory = new BuildingFactory_1.BuildingFactory();
var numberOfFloors = 16;
var numberOfElevators = 3;
var numberOfBuildings = 3;
for (var i = 0; i < numberOfBuildings; i++) {
    buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);
}
