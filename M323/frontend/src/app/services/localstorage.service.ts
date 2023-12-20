import { Injectable } from '@angular/core';
const PREFIX = "finance-"

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService{
  private jwt!: string
  
  save(token: string){
    localStorage.setItem(PREFIX + "jwt", token);
  }

  load(): string {
    return <string> localStorage.getItem(PREFIX + "jwt");
  }
}

