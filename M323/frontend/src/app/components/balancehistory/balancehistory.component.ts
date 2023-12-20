import { Component, Input } from '@angular/core';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-balancehistory',
  templateUrl: './balancehistory.component.html',
  styleUrls: ['./balancehistory.component.scss']
})
export class BalancehistoryComponent {
  @Input() data: any[] = [];

  // Konfigurieren Sie hier weitere Eigenschaften des Diagramms nach Bedarf

  // Beispielkonfiguration
  view: [number, number] = [700, 400];
  colorScheme = { domain: ['#5AA454'] } as Color;
  gradient = false;
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Datum';
  yAxisLabel = 'Saldo';
  autoScale = true;
}