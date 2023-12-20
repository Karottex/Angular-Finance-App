import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { getHeaders, getServerUrl } from './http-environment';

export interface Transaction {
  target: string,
  amount: number,
  category?: string,
}
export interface TransactionConfirmation {
  from: string,
  target: string,
  amount: number,
  category?: string,
  total: number,
  date: string
}
export interface TransactionQuery {
  query: {
    resultcount: number,
    count: number,
    skip: number,
    fromDate: string,
    toDate: string
  },
  result: TransactionConfirmation[]
}


/**
 * Mit dem Transaction Service können Transaktionen durchgeführt werden sowie Abfragen
 * über die getätigten Transaktionen gemacht werden.
 */
@Injectable({providedIn: 'root'})
export class TransactionService {
  constructor(private http: HttpClient) {
  }

  /**
   * Überweist den Betrag des Users, welcher durch das Bearer Token
   * authentifiziert ist, auf das spezifizierte Konto.
   * @param jwtToken Diese Methode benötigt das JWT Token des aktuell eingeloggten Benutzers (siehe Authentication Service).
   * @param model 
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "from": "1000001",
   *    "target": "1000002",
   *    "amount": -5,
   *    "total": 995,
   *    "date": "2017-02-01T08:48:55.842Z"
   * }
   * ```
   */
  public transfer(jwtToken: string, model: Transaction): Observable<TransactionConfirmation> {
    return this.http.post<TransactionConfirmation>(
      getServerUrl('/accounts/transactions'),
      JSON.stringify(model),
      getHeaders(jwtToken));
  }

  /**
   * Ruft sämtliche Transaktionen des Users, welcher durch das Bearer Token authentifiziert ist, ab und
   * filtert die Transaktionen gemäss der Parametrisierung.
   * Wichtig: Resultate werden nur zurückgeben, falls count oder fromDate und toDate angegeben wurden.
   * @param jwtToken Diese Methode benötigt das JWT Token des aktuell eingeloggten Benutzers (siehe Authentication Service).
   * @param fromDate Startdatum der Transaktionen, welche zurückgegeben werden sollen.
   * @param toDate Enddatum der Transaktionen, welche zurückgegeben werden sollen.
   * @param count Anzahl der zurückzugebenden Transaktionen.
   * @param skip Überspringt diese Anzahl an Transaktionen in der DB, d.h. diese werden nicht zurückgegeben.
   * @returns Gibt die Transaktions-Informationen für den aktuellen Account inklusiver der Query-Informationen zurück.
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "query":
   *    {
   *       "resultcount": 107, // Anzahl Results (ohne Filter)
   *       "count": 1,  // Anzahl Resulte welche zurückgegeben werden sollten
   *       "skip": 1, // Überspringt die ersten x Resultate
   *       "fromDate": "2016-05-11T02:00:00.000Z",  // Date-Filter
   *       "toDate": "2016-12-11T02:00:00.000Z" // Date-Filter
   *    },
   *    "result":
   *    [
   *       {
   *          "from": "1000001",
   *          "target": "1000002",
   *          "amount": -23,
   *          "total": 977,
   *          "date": "2016-12-10T14:00:00.000Z"
   *       }
   *    ]
   * }
   * ```
   */
  public getTransactions(jwtToken: string, fromDate?: Date, toDate?: Date, count?: number, skip?: number): Observable<TransactionQuery> {
    const requestUrl = getServerUrl('/accounts/transactions?'
      + (fromDate ? 'fromDate=' + encodeURIComponent(fromDate.toString()) + '&' : '')
      + (toDate ? 'toDate=' + encodeURIComponent(toDate.toString()) + '&' : '')
      + (count ? 'count=' + count + '&' : '')
      + (skip ? 'skip=' + skip : ''));

    return this.http.get<TransactionQuery>(
      requestUrl,
      getHeaders(jwtToken, false));
  }
}
