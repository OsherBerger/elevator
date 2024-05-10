/** 
 * App.ts
 * Initializes building objects using the BuildingFactory class.
 * Creates multiple buildings with a specified number of floors and elevators.
 * Gives an option for feature that adds background image dynamically
 */

import { BuildingFactory } from "./BuildingFactory";

const buildingFactory = new BuildingFactory();

const numberOfFloors = 7;
const numberOfElevators = 3;
const numberOfBuildings = 2;

for (let i = 0; i < numberOfBuildings; i++) {
  buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);
}

// // Optional feature: 
// // Dynamically create elevator background elements
// const createElevatorBackgrounds = (numberOfFloors: number) => {
//   for (let i = 0; i < (0.4*numberOfFloors); i++) {
//     const elevatorBg = document.createElement('div');
//     elevatorBg.classList.add('elevatorBg');
//     elevatorBg.style.bottom = `${i * 300}px`; 
//     document.body.appendChild(elevatorBg);
//   }
// };
// createElevatorBackgrounds(numberOfFloors);
