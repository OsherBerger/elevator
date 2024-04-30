
import { BuildingFactory } from "./BuildingFactory/BuildingFactory";

// Create buildings
const buildingFactory = new BuildingFactory();
const numberOfFloors = 19;
const numberOfElevators = 3;
const numberOfBuildings = 3;

for (let i = 0; i < numberOfBuildings; i++) {
  buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);
}

