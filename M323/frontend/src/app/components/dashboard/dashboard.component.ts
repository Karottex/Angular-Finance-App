import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, AccountBalance, AccountInfo } from 'src/app/services/account.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Transaction, TransactionConfirmation, TransactionQuery, TransactionService } from 'src/app/services/transaction.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { ScaleType } from '@swimlane/ngx-charts';

interface VerticalBarChartData  {
  name: string,
  series: { name:string, value: number }[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit{
  selectedTab: string = 'movements'; // Standardtab
  balanceHistoryData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  amount!: number
  currentBalance!: AccountBalance;
  to!: number
  data!: any[];
  pieChartData!: any[]
  targetUsername: string | null = null;
  confirmationDisplay: boolean = false;
  confirmationMessage: string | null = null;
  dataSource!: MatTableDataSource<TransactionConfirmation>;
  displayedColumns: string[] = ['Source', 'Target', 'Amount', 'Balance'];
  view: [number, number] = [700, 400];
  colorScheme = {
    domain: ['#5AA454', '#E44D25'],
  } as any;
  gradient = false;
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Datum';
  yAxisLabel = 'Saldo';
  autoScale = true;
  transaction = new Subject<TransactionQuery>
  transactions!: TransactionConfirmation[]
  verticalBarChartData: VerticalBarChartData[] = [];
  scaleType: ScaleType = ScaleType.Linear;
  selectedYear: number | null = null;
  selectedMonth: number | null = null;


  constructor(private router: Router, private accountService: AccountService, private lsService: LocalstorageService, private transactionService: TransactionService){}

  ngOnInit() {
    this.loadCurrentBalance();
    this.loadTransactions();
    this.loadLineChart();
    this.getCategoryData();
    this.getVerticalBarChartData();
  }

  loadCurrentBalance() {
    const jwtToken: string = this.lsService.load();

    this.accountService.getCurrentBalance(jwtToken).subscribe(
      (balance: AccountBalance) => {
        this.currentBalance = balance;
      },
      (error) => {
        console.error('Fehler beim Abrufen des Kontostands', error);
      }
    );
  }

  loadTransactions() {
    const jwtToken: string = this.lsService.load();
    
    this.transactionService.getTransactions(jwtToken, undefined, undefined, 100, 0).subscribe(
      (transactions: TransactionQuery) => {
        console.log("Transactions API Response:", transactions);
        const filteredData = this.filterDataByDate(transactions, this.selectedYear, this.selectedMonth);
        this.dataSource = new MatTableDataSource<TransactionConfirmation>(transactions.result);
        this.dataSource.paginator = this.paginator; // Verbinden des Paginators mit der Datenquelle
      },
      (error) => {
        console.error('Fehler beim Abrufen der Transaktionen', error);
      }
    );
  }


  onToChange() {
    const jwtToken: string = this.lsService.load();

    if (this.to !== null) {
      this.accountService.getAccountInfo(jwtToken, this.to.toString()).subscribe(
        (accountInfo: AccountInfo) => {
          this.targetUsername = accountInfo.owner.firstname + ' ' + accountInfo.owner.lastname;
        },
        //Error-Handling
        (error) => {
          console.error('Fehler beim Abrufen des Benutzernamens des Zielkontos', error);
          this.targetUsername = null;
        }
      );
    }else {
      // Wenn das "To"-Feld leer ist
      this.targetUsername = null;
    }
  }

  onTransfer(){
    const jwtToken: string = this.lsService.load();

    const transaction: Transaction = {
      target: this.to.toString(),
      amount: this.amount
    };
  
    this.transactionService.transfer(jwtToken, transaction).subscribe({
      next: (transaction) => {
        this.loadTransactions();
        this.loadLineChart();
        this.loadCurrentBalance();  
        this.onToChange();
        this.getVerticalBarChartData();
        this.confirmationDisplay = true;
        const confirmationMessage = `Überweisung zu ${this.targetUsername} abgeschlossen.\nNeuer Kontostand: ${transaction.total} CHF`;
        this.confirmationMessage = confirmationMessage;
      },
      error: (error: any) => {
        console.error('Fehler bei der Überweisung:', error);
      }
    });
  }

  newTransfer() {
    this.confirmationDisplay = false;
  }

  navigateToLogin(){
    this.router.navigate(["/login"])
  }

  loadLineChart() {
    const jwtToken: string = this.lsService.load();
  
    this.transactionService.getTransactions(jwtToken).subscribe({
      next: (response: TransactionQuery) => {
        const transactions = response.result;
        //const filteredData = this.filterDataByDate(transactions, this.selectedYear, this.selectedMonth);
        //Filter funktioniert nicht
        const incomingData = transactions.filter((transaction) => transaction.amount > 0);
        const outgoingData = transactions.filter((transaction) => transaction.amount < 0);
  
        this.data = [
          {
            name: 'Plus',
            series: incomingData.map((transaction) => ({
              name: this.formatDate(transaction.date),
              value: transaction.amount,
            })),
          },
          {
            name: 'Minus',
            series: outgoingData.map((transaction) => ({
              name: this.formatDate(transaction.date),
              value: transaction.amount * (-1),
            })),
          },
        ];
      },
      error: (error: any) => {
        console.error('Fehler beim Laden der Transaktionen für das Line-Chart:', error);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  getCategoryData(): void {
    const jwtToken: string = this.lsService.load();
    this.pieChartData = [];

    this.transactionService.getTransactions(jwtToken).subscribe({
      next: transaction => {
        const categoryCount: { [key: string]: number} = {};
        transaction.result.forEach(transaction => {
          const category = transaction.category || 'Keine Kategorie';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        Object.keys(categoryCount).forEach(category => {
          this.pieChartData.push({
            name: category,
            value: categoryCount[category]
          });
        });
      }
    })
  }

  private sortData(data: TransactionConfirmation[], column: string, direction: string): TransactionConfirmation[] {
    return data.sort((a, b) => {
      const valueA = this.getSortingValue(a, column);
      const valueB = this.getSortingValue(b, column);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * (direction === 'asc' ? 1 : -1);
      } else {
        return valueA.localeCompare(valueB) * (direction === 'asc' ? 1 : -1);
      }
    });
  }

  private getSortingValue(item: TransactionConfirmation, column: string): any {
    switch (column) {
      case 'Source':
        return item.from;
      case 'Target':
        return item.target;
      case 'Amount':
        return item.amount;
      case 'Balance':
        return item.total;
      default:
        return (item as any)[column];
    }
  } 
  applySort(event: Sort): void {
    const data = this.dataSource.data.slice(); //copy array

    if (event.active && event.direction) {
      this.dataSource.data = this.sortData(data, event.active, event.direction);
    }
  }

  getVerticalBarChartData(): void {
    const jwtToken: string = this.lsService.load();
    this.transactionService.getTransactions(jwtToken).subscribe({
      next: (response: TransactionQuery) => {
        const transactions = response.result;

        const incomingData = transactions.filter((transaction) => transaction.amount > 0);
        const outgoingData = transactions.filter((transaction) => transaction.amount < 0);

        const formattedIncomingData: VerticalBarChartData[] = incomingData.map((transaction) => ({
          name: this.formatDate(transaction.date),
          series: [ {
            name: 'Einnahmen',
            value: transaction.amount,
          }],
        }));
  
        const formattedOutgoingData: VerticalBarChartData[] = outgoingData.map((transaction) => ({
          name: this.formatDate(transaction.date),
          series: [ {
            name: 'Ausgaben',
            value: transaction.amount * (-1),
          }],
        }));

        this.verticalBarChartData = formattedIncomingData.concat(formattedOutgoingData);
      },
      error: (error: any) => {
        console.error('Fehler beim Laden der Daten für das vertikale Balkendiagramm:', error);
      },
    });
  }

  onDateFilterChange(): void {
    this.loadLineChart();
    this.loadTransactions();
    this.getCategoryData();
  }
  
  //Funktioniert noch nicht
  filterDataByDate(data: TransactionQuery, year: number | null, month: number | null): TransactionConfirmation[] {
    if (data && data.result) {
      const transactions = data.result;

      return transactions;
    }
  
    return [];
  }
}
