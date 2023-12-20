import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})

export class PieChartComponent implements OnInit {
  @Input() data: any[] = [];
  view: [number, number] = [700, 400];
  showLegend = true;
  showLabels = true;
  explodeSlices = false;

  constructor() {}

  ngOnInit() {

  }

  onSelect(event: any): void {
    // Implementieren Sie Ihre Logik für die Auswahl von Teilen des Pie Charts hier
    console.log(event);
  }
}
