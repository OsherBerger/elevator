/** ElevatorSystem.ts
 * Represents an elevator system that manages multiple elevators.
 * Creates and handles the behavior of multiple elevators within a specified container.
 */

import { Elevator } from './Elevator';
import { Floor } from './Floor';

export class ElevatorSystem {
  elevators: Elevator[] = [];

  constructor(private container: HTMLElement, private numberOfElevators: number) {
    this.createElevators();
  }

  /**
   * Creates elevator instances based on the specified number of elevators.
   */  
  private createElevators() {
    for (let i = 0; i < this.numberOfElevators; i++) {
      const elevator = new Elevator(document.createElement('div')); 
      elevator.currentFloor = new Floor(0);
      this.container.appendChild(elevator.elevatorElement);
      const elevatorImage = document.createElement('img');
      elevatorImage.src = '../assets/elv.png'; //path is for the bundle.js which is in the dis folder
      elevatorImage.alt = 'elevator';
      elevator.elevatorElement.appendChild(elevatorImage); 
      this.elevators.push(elevator);
    }
  }
  
  /**
   * Requests an elevator to serve a floor.
   * @param floor The floor where the elevator is requested.
   */
  requestElevator(floor: Floor) {
    const availableElevators: Elevator[] = this.elevators.filter(elevator => !elevator.isWaiting);
    if (availableElevators.length > 0) {
      let selectedElevator: Elevator | null = null;
      let minETA = Infinity;  
      availableElevators.forEach(elevator => {
          const distanceToRequestedFloor = Math.abs(elevator.currentFloor.level - floor.level);
          const ETA = distanceToRequestedFloor * 0.5 + elevator.queue.length ; 
          if (ETA < minETA) {
              minETA = ETA;
              selectedElevator = elevator;
          }
      });
      if (selectedElevator) {
        (selectedElevator as Elevator).requestFloor(floor);
        return;
      }
    }
    let shortestETA = Infinity;
    let selectedElevator: Elevator | null = null;
    this.elevators.forEach(elevator => {
      const distance = Math.abs(elevator.currentFloor.level - floor.level);
      const ETA = distance * 0.5 + elevator.queue.length ; 
      if (ETA < shortestETA) {
          shortestETA = ETA;
          selectedElevator = elevator;
      }
    });
    if (selectedElevator) {
      (selectedElevator as Elevator).requestFloor(floor);
    }
  }
}
