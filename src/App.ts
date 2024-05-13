/** 
 * App.ts
 * Initializes building objects using the BuildingFactory class.
 * Creates multiple buildings with a specified number of floors and elevators.
 * Gives an option for feature that adds background image dynamically
 */

import { BuildingFactory } from "./BuildingFactory";

//Please insert the number of Floors you want  
const numberOfFloors = 7;

//Please insert the number of Elevators you want 
const numberOfElevators = 3;

//Please insert the number of Buildings you want 
const numberOfBuildings = 3;

startBuildingFactory(numberOfFloors, numberOfElevators, numberOfBuildings)

/**
 * Starts the building factory to create buildings.
 * 
 * @param numberOfFloors The number of floors for each building.
 * @param numberOfElevators The number of elevators for each building.
 * @param numberOfBuildings The number of buildings to create.
*/
function startBuildingFactory(numberOfFloors: number,numberOfElevators: number,numberOfBuildings:number ){
  const buildingFactory = new BuildingFactory();
  const errorContainer = document.getElementById('errorContainer')!;
  if (numberOfFloors <= 0 || numberOfElevators <= 0 || numberOfBuildings <= 0) {
    displayErrorMessage("Number of floors,elevators & buildings must be a positive integers.");
  } else {
    errorContainer.textContent = '';
    for (let i = 0; i < numberOfBuildings; i++) {
      buildingFactory.createBuilding(numberOfFloors, numberOfElevators, i);
    }
  }
}

/**
 * Displays an error message using an alert dialog.
 * @param message The error message to display.
*/
function displayErrorMessage(message: string) {
  const errorContainer = document.getElementById('errorContainer')!;
  errorContainer.textContent = message;
}

// Dynamically create elevator background elements
const createElevatorBackgrounds = (numberOfFloors: number) => {
  for (let i = 0; i < (0.4*numberOfFloors); i++) {
    const elevatorBg = document.createElement('div');
    elevatorBg.classList.add('elevatorBg');
    elevatorBg.style.bottom = `${i * 300}px`; 
    document.body.appendChild(elevatorBg);
  }
};

// Optional feature: 
// createElevatorBackgrounds(numberOfFloors);

