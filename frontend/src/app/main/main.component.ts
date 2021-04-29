import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  tips = [
    { id: 1, name: "Тестовая заметка 1", date: new Date(), message: "Съешь французских булок 28.04" },
    { id: 2, name: "Тестовая заметка 2", date: new Date(), message: "Выпей кофе 28.04" }
    /*{ date: new Date("2021-04-28T00:00:00.0003"), list: [
    ]},
    { date: new Date("2021-04-29T00:00:00.0003"), list: [
      { id: 1, name: "Тестовая заметка 1", date: new Date(), message: "Съешь французских булок 29.04" },
      { id: 2, name: "Тестовая заметка 2", date: new Date(), message: "Выпей кофе 29.04" }
    ]}*/
  ];
  selectedDate;

  ngOnInit(): void {
    this.selectedDate = new Date();
  }

  datePick(event) {
    this.selectedDate = event;
  }

}
