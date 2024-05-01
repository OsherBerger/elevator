/**
 * This script initializes building objects using the BuildingFactory class.
 * It creates multiple buildings with a specified number of floors and elevators.
 */

import { BuildingFactory } from "./BuildingFactory";

const buildingFactory = new BuildingFactory();
const numberOfFloors = 7;
const numberOfElevators = 3;
const numberOfBuildings = 3;

for (let i = 0; i < numberOfBuildings; i++) {
  buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);
}
