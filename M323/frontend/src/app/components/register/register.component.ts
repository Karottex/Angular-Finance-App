import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  vorname: string = '';
  nachname: string = '';
  username: string = '';
  password: string = '';
  passwortWiederholen: string = '';

  constructor(private router: Router, private authService: AuthService, private lsService: LocalstorageService) {}

  onRegister(){
    if(this.password !== this.passwortWiederholen){
      //evt. Error message display
      return;
    }
  
    this.authService.register({ login: this.username, password: this.password, firstname: this.vorname, lastname: this.nachname}).subscribe({
      next: acc => {
        this.authService.login({ login: this.username, password: this.password }).subscribe({
          next: cred => {
            this.lsService.save(cred.token);
            this.router.navigate(["/dashboard"])
          }
        })
      }
    })
  }  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
