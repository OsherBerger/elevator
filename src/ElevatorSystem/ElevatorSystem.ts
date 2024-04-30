import { Elevator } from '../Elevator/Elevator';
import { Floor } from '../Floor/Floor';

// ElevatorSystem class
export class ElevatorSystem {
  elevators: Elevator[] = [];

  constructor(private container: HTMLElement, private numberOfElevators: number) {
    this.createElevators();
  }

  private createElevators() {
    for (let i = 0; i < this.numberOfElevators; i++) {
      const elevator = new Elevator(document.createElement('div')); // Create a new Elevator instance
      elevator.currentFloor = new Floor(0);
      this.container.appendChild(elevator.elevatorElement);
      const elevatorImage = document.createElement('img');
      elevatorImage.src = '../assets/elv.png'; // Set the source of the elevator image
      elevatorImage.alt = 'elevator';
      elevator.elevatorElement.appendChild(elevatorImage); // Append the image to the elevator container
      this.elevators.push(elevator);
    }
  }
  

  requestElevator(floor: Floor) {
    // Find all available elevators
    const availableElevators = this.elevators.filter(elevator => !elevator.isMoving);
  
    if (availableElevators.length > 0) {
      // Calculate the distance of each available elevator to the requested floor
      const distances = availableElevators.map(elevator => Math.abs(elevator.currentFloor.level - floor.level));
  
      // Find the index of the nearest available elevator
      const closestElevatorIndex = distances.indexOf(Math.min(...distances));
  
      // Request the floor for the nearest available elevator
      availableElevators[closestElevatorIndex].requestFloor(floor);
    } else {
      // Find the elevator with the shortest estimated time of arrival (ETA)
      let shortestETA = Infinity;
      let selectedElevator: Elevator | null = null;
  
      this.elevators.forEach(elevator => {
        const distance = Math.abs(elevator.currentFloor.level - floor.level);
        const ETA = distance * 0.5 + elevator.queue.length * 2; // Adjusting ETA based on queue length
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

