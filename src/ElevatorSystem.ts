/** 
 * ElevatorSystem.ts
 * Represents an elevator system that manages multiple elevators.
 * Creates and handles the behavior of multiple elevators within a specified container.
 */

import { Elevator } from './Elevator';
import { Floor } from './Floor';

export class ElevatorSystem {
  elevators: Elevator[] = [];

  /**
   * Initializes the ElevatorSystem with a specified container and number of elevators.
   * @param container The container element where the elevators will be displayed.
   * @param numberOfElevators The number of elevators to be created in the system.
   */
  constructor(private container: HTMLElement, private numberOfElevators: number) {
    this.createElevators();
  }

  //Creates elevator instances based on the specified number of elevators.
  private createElevators() {
    for (let i = 0; i < this.numberOfElevators; i++) {
      const elevator = new Elevator(this.createElevatorElement());
      this.container.appendChild(elevator.elevatorElement);
      this.elevators.push(elevator);
    }
  }

  /**
   * Creates an HTML element representing an elevator.
   * @returns The created elevator element.
   */
  private createElevatorElement(): HTMLElement {
    const elevatorElement = document.createElement('div');
    const elevatorImage = document.createElement('img');
    elevatorImage.src = '../assets/elv.png'; // Path relative to bundle.js in the dis folder
    elevatorImage.alt = 'elevator';
    elevatorElement.appendChild(elevatorImage);
    return elevatorElement;
  }

  /**
   * Requests an elevator to serve a floor.
   * @param floor The floor where the elevator is requested.
   */
  requestElevator(floor: Floor) {
    const availableElevators = this.getAvailableElevators();
    const selectedElevator = this.findClosestElevator(floor, availableElevators);
    if (selectedElevator) {
      selectedElevator.requestFloor(floor);
    }
  }

  /**
   * Retrieves the list of available elevators.
   * @returns An array containing elevators that are not currently serving any request.
   */
  private getAvailableElevators(): Elevator[] {
    return this.elevators.filter(elevator => !elevator.isWaiting);
  }

  /**
   * Finds the closest available elevator to the specified floor.
   * @param floor The floor where the elevator is requested.
   * @param elevators The list of available elevators.
   * @returns The closest available elevator, or null if none is available.
   */
  private findClosestElevator(floor: Floor, elevators: Elevator[]): Elevator | null {
    let closestElevator: Elevator | null = null;
    let shortestETA = Infinity;
    elevators.forEach(elevator => {
      const distance = Math.abs(elevator.currentFloor.level - floor.level);
      const ETA = distance * 0.5 + elevator.queue.length;
      if (ETA < shortestETA) {
        shortestETA = ETA;
        closestElevator = elevator;
      }
    });
    return closestElevator;
  }
}
