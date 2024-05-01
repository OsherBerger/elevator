/**
 * This script represents a building with floors and an elevator system.
 * It creates floor buttons, manages elevator requests, and updates floor buttons' timers.
 */

import { Elevator } from './Elevator';
import { ElevatorSystem } from './ElevatorSystem';
import { Floor } from './Floor';

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
  
    for (let i = 0; i <= this.numberOfFloors; i++) {
      const button = document.createElement('button');
      button.classList.add('floor', 'metal', 'linear');
      button.innerText = i.toString();
  
      const timer = document.createElement('div');
      timer.classList.add('timer');
      button.appendChild(timer); 
  
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
  
    const scrollContainer = document.createElement('div');
    scrollContainer.classList.add('scrollContainer');
    scrollContainer.appendChild(floorButtonsContainer);
  
    this.container.appendChild(scrollContainer);
  }

  private createElevatorSystem() {
    const elevatorsContainer = document.createElement('div');
    elevatorsContainer.classList.add('elevatorsContainer', 'elevator');
    elevatorsContainer.style.width = `${this.numberOfElevators * 50}px`; 

    this.container.appendChild(elevatorsContainer);

    this.elevatorSystem = new ElevatorSystem(elevatorsContainer, this.numberOfElevators);
  }

  private requestElevator(floor: Floor, button: HTMLButtonElement) {
    this.elevatorSystem.requestElevator(floor);

    button.style.color = 'green';

    this.updateTimer(floor, button);
  }

  private setupElevatorArrivalListener() {
    document.addEventListener('elevatorArrival', (event) => {
      const floorLevel = (event as CustomEvent).detail.floorLevel;
      this.handleElevatorArrival(floorLevel);
    });
  }

private handleElevatorArrival(floorLevel: number) {
  const buttons = document.querySelectorAll('.floorButtonsContainer .floor button');

  buttons.forEach((button) => {
    if ((button as HTMLButtonElement).innerText === floorLevel.toString()) {
      const timer = button.querySelector('.timer');
      if (timer) {
        timer.remove();
      }
    }
  });
}


  private updateTimer(targetFloor: Floor, button: HTMLButtonElement) {
    let timer = button.querySelector('.timer') as HTMLDivElement;

    if (!timer) {
      timer = document.createElement('div');
      timer.classList.add('timer');
      button.appendChild(timer);
    }

    let closestElevator: Elevator | null = null;
    let minDistance = Infinity;

    this.elevatorSystem.elevators.forEach((elevator: Elevator) => {
      const distance = Math.abs(targetFloor.level - elevator.currentFloor.level);
      if (distance < minDistance) {
        minDistance = distance;
        closestElevator = elevator;
      }
    });

    if (closestElevator) {
      const currentFloor = (closestElevator as Elevator).currentFloor;
      const distance = Math.abs(targetFloor.level - currentFloor.level);

      const queueLength = (closestElevator as Elevator).queue ? (closestElevator as Elevator).queue.length : 0;

      let etaSeconds = distance * 0.5 + queueLength;

      let seconds = etaSeconds;
      timer.innerText = `${seconds}`;
      timer.style.color = 'green'; 

      const interval = setInterval(() => {
        seconds--;
        if (seconds >= 0) {
          timer.innerText = `${seconds}`;
        } else {
          button.style.color = '';
          timer.style.color = 'red';
          timer.innerText = `2`;

          seconds = 2; 
          const delayInterval = setInterval(() => {
            seconds--;
            if (seconds >= 0) {
              timer.innerText = `${seconds}`;
            } else {
              clearInterval(delayInterval);
              timer.remove();
            }
          }, 1000);
          clearInterval(interval);
        }
      }, 1000);
    }
  }
}