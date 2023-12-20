import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Credential } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent{
  credentials!: Credential
  password!: string
  username!: string

  constructor(private authService: AuthService, private router: Router, private lsService: LocalstorageService){}
 
  onLogin(){
  this.authService.login({ login: this.username, password: this.password }).subscribe({
    next: cred => { 
       this.credentials = cred; 
       this.router.navigate(["/dashboard"])
       this.lsService.save(cred.token)
     },
    error: e => {console.log(e)} 
  });
 }
 navigateToRegistrieren(){
  this.router.navigate(["/register"])
 }
   
}
