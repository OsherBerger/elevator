/** app.ts
 * Initializes building objects using the BuildingFactory class.
 * Creates multiple buildings with a specified number of floors and elevators.
 */

import { BuildingFactory } from "./BuildingFactory";

// Instantiate a BuildingFactory object
const buildingFactory = new BuildingFactory();

// Define the number of floors and elevators for each building
const numberOfFloors = 7;
const numberOfElevators = 3;

// Define the number of buildings to create
const numberOfBuildings = 3;

// Create buildings using the BuildingFactory
for (let i = 0; i < numberOfBuildings; i++) {
  buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);
}
