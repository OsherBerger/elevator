/**BuildingFactory.ts
 * Represents a factory class for creating building objects with specified configurations.
 * Creates building elements in the DOM and instantiates Building objects.
 */

import { Building } from "./Building";

export class BuildingFactory {
  /**
   * Creates a building with the specified number of floors and elevators.
   * @param numberOfFloors The number of floors in the building.
   * @param numberOfElevators The number of elevators in the building.
   * @param buildingIndex The index of the building.
   * @returns The created Building object.
   */
  createBuilding(numberOfFloors: number, numberOfElevators: number, buildingIndex: number) {
    const container = document.createElement('div');
    container.classList.add('building');
    container.style.width = `${numberOfElevators * 100}px`; 
    container.style.marginLeft = `${buildingIndex * (numberOfElevators * 100 + 250)}px`; 
    document.getElementById('buildingsContainer')?.appendChild(container);

    return new Building(numberOfFloors, container, numberOfElevators);
  }
}
