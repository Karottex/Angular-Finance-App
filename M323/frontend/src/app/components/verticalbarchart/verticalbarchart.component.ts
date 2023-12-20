import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-verticalbarchart',
  templateUrl: './verticalbarchart.component.html',
  styleUrls: ['./verticalbarchart.component.scss']
})
export class VerticalbarchartComponent {
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Balance';
  colorScheme = {
    domain: ['#5AA454', '#E44D25'],
  };

  constructor() {}

  ngOnInit() {

  }

}
