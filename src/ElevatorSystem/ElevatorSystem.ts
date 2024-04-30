/**
 * This script represents an elevator system that manages multiple elevators.
 * It creates and handles the behavior of multiple elevators within a specified container.
 */

import { Elevator } from '../Elevator/Elevator';
import { Floor } from '../Floor/Floor';

export class ElevatorSystem {
  elevators: Elevator[] = [];

  constructor(private container: HTMLElement, private numberOfElevators: number) {
    this.createElevators();
  }

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
  

  requestElevator(floor: Floor) {
    const availableElevators = this.elevators.filter(elevator => !elevator.isMoving);
  
    if (availableElevators.length > 0) {
      const distances = availableElevators.map(elevator => Math.abs(elevator.currentFloor.level - floor.level));
      const closestElevatorIndex = distances.indexOf(Math.min(...distances));
      availableElevators[closestElevatorIndex].requestFloor(floor);
    } else {
      let shortestETA = Infinity;
      let selectedElevator: Elevator | null = null;
      this.elevators.forEach(elevator => {
        const distance = Math.abs(elevator.currentFloor.level - floor.level);
        const ETA = distance * 0.5 + elevator.queue.length * 2; 
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
  
}
