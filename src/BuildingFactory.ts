/**
 * This script represents a factory class, for creating building objects, with specified configurations.
 * It creates building elements in the DOM and instantiates Building objects.
 */

import { Building } from "./Building";

export class BuildingFactory {
  createBuilding(numberOfFloors: number, numberOfElevators: number, buildingIndex: number) {
    const container = document.createElement('div');
    container.classList.add('building');
    container.style.width = `${numberOfElevators * 100}px`; 
    container.style.marginLeft = `${buildingIndex * (numberOfElevators * 100 + 250)}px`; 
    document.getElementById('buildingsContainer')?.appendChild(container);

    return new Building(numberOfFloors, container, numberOfElevators);
  }
}
