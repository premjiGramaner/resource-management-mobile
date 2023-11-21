import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardHelperService {

  constructor() { }

  getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.5)`;
  }

}
