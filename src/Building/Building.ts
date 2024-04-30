import { Elevator } from '../Elevator/Elevator';
import { ElevatorSystem } from '../ElevatorSystem/ElevatorSystem';
import { Floor } from '../Floor/Floor';

// Building class
export class Building {
  private elevatorSystem!: ElevatorSystem;

  constructor(private numberOfFloors: number, private container: HTMLElement, private numberOfElevators: number) {
    this.createFloorButtons();
    this.createElevatorSystem();
    this.setupElevatorArrivalListener();
  }

  private createFloorButtons() {
    const floorButtonsContainer = document.createElement('div');
    floorButtonsContainer.classList.add('floorButtonsContainer');
  
    // Loop from the ground floor (level 0) to the top floor
    for (let i = 0; i <= this.numberOfFloors; i++) {
      const button = document.createElement('button');
      button.classList.add('floor', 'metal', 'linear');
      button.innerText = i.toString();
  
      const timer = document.createElement('div');
      timer.classList.add('timer');
      button.appendChild(timer); // Append the timer element to the button
  
      button.addEventListener('click', () => {
        this.requestElevator(new Floor(i), button);
      });
  
      const div = document.createElement('div');
      div.classList.add('blackline');
  
      const floorDiv = document.createElement('div');
      floorDiv.classList.add('floor');
      floorDiv.appendChild(button);
  
      floorButtonsContainer.appendChild(floorDiv);
      floorButtonsContainer.appendChild(div);
    }
  
    // Wrap the floor buttons container in a scrollable container
    const scrollContainer = document.createElement('div');
    scrollContainer.classList.add('scrollContainer');
    scrollContainer.appendChild(floorButtonsContainer);
  
    this.container.appendChild(scrollContainer);
  }

  private createElevatorSystem() {
    const elevatorsContainer = document.createElement('div');
    elevatorsContainer.classList.add('elevatorsContainer', 'elevator');
    elevatorsContainer.style.width = `${this.numberOfElevators * 50}px`; // Adjust elevator container width

    this.container.appendChild(elevatorsContainer);

    this.elevatorSystem = new ElevatorSystem(elevatorsContainer, this.numberOfElevators);
  }

  private requestElevator(floor: Floor, button: HTMLButtonElement) {
    this.elevatorSystem.requestElevator(floor);

    // Change the color of the button text to green
    button.style.color = 'green';

      // Start the timer for this floor button
  this.updateTimer(floor, button);
  }
  // Method to setup the elevator arrival listener
  private setupElevatorArrivalListener() {
    document.addEventListener('elevatorArrival', (event) => {
      const floorLevel = (event as CustomEvent).detail.floorLevel;
      this.handleElevatorArrival(floorLevel);
    });
  }

// Method to handle the elevator arrival and reset button color
private handleElevatorArrival(floorLevel: number) {
  // Get all buttons within the floorButtonsContainer
  const buttons = document.querySelectorAll('.floorButtonsContainer .floor button');

  // Iterate over each button and find the one with the matching text content
  buttons.forEach((button) => {
    if ((button as HTMLButtonElement).innerText === floorLevel.toString()) {
      // Remove the timer element
      const timer = button.querySelector('.timer');
      if (timer) {
        timer.remove();
      }
    }
  });
}

private updateTimer(targetFloor: Floor, button: HTMLButtonElement) {
  const timer = button.querySelector('.timer') as HTMLDivElement;
  if (timer) {
    let closestElevator: Elevator | null = null;
    let minDistance = Infinity;

    // Find the closest elevator to the target floor
    this.elevatorSystem.elevators.forEach((elevator: Elevator) => {
      const distance = Math.abs(targetFloor.level - elevator.currentFloor.level);
      if (distance < minDistance) {
        minDistance = distance;
        closestElevator = elevator;
      }
    });

    if (closestElevator) {
      // Use type assertion to ensure TypeScript recognizes closestElevator as an Elevator instance
      const currentFloor = (closestElevator as Elevator).currentFloor;
      const distance = Math.abs(targetFloor.level - currentFloor.level);

      // Check if the elevator has a queue property before accessing its length
      const queueLength = (closestElevator as Elevator).queue ? (closestElevator as Elevator).queue.length : 0;

      const etaSeconds = distance * 0.5 + queueLength * 2; // Adjusting ETA based on queue length

      let seconds = etaSeconds;
      timer.innerText = `${seconds}`;

      const interval = setInterval(() => {
        seconds--;
        if (seconds >= 0) {
          timer.innerText = `${seconds}`;
        } else {
          clearInterval(interval);
          timer.remove();
          button.style.color = '';
        }
      }, 500);
     }
   }
 }
}


