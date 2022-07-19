import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UsersService } from '../_services/users.service';
import { User } from '../_models/user';
import * as CryptoJS from 'crypto-js';
var username = null;
var usernameform =  null;
var otpcoden = null;
var authenticated = false;
var malenum = 0;
var femalenum = 0;
var othersnum = 0;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit,AfterViewInit {

  model: any = {};
  allusers: User[];
  usersParams: any = {};
  photoUrl: string;
  otpform : HTMLInputElement = null;
  usernameform : HTMLInputElement = null;
  malesnotif : HTMLSpanElement = null;
  femalesnotif : HTMLSpanElement = null;
  othersnotif : HTMLSpanElement = null;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private usersService: UsersService,
    private router: Router
  ) { }
  ngAfterViewInit(){
    this.malesnotif = document.getElementById("malesnotif") as HTMLSpanElement;
    this.femalesnotif = document.getElementById("femalesnotif") as HTMLSpanElement;
    this.othersnotif = document.getElementById("othersnotif") as HTMLSpanElement;
    this.usersParams.gender = "all";
    this.usersParams.minAge = 18;
    this.usersParams.maxAge = 99;
    this.usersParams.orderBy = 'lastActive';
    this.loadUsers();

  }
  encryptData(data) {

      try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), "falalalala").toString();
      } catch (e) {
        console.log(e);
      }
    }

    decryptData(data) {

      try {
        const bytes = CryptoJS.AES.decrypt(data, "falalalala");
        if (bytes.toString()) {
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return data;
      } catch (e) {
        console.log(e);
      }
    }
  ngOnInit() {
    var key = CryptoJS.enc.Utf8.parse('b75524255a7f54d2726a951bb39204df');
    var iv  = CryptoJS.enc.Utf8.parse('1583288699248111');
    var text = "My Name Is Nghĩa";
    var encryptedCP = CryptoJS.AES.encrypt(text, key, { iv: iv });
    //var decryptedWA = CryptoJS.AES.decrypt("1f9XuBzAqHUKhjv/LUtoHCAM8VM1mzCaEEI+RNWtlsQ=", key, { iv: iv});
    var cryptText = encryptedCP.toString();
    //alert(decryptedFromText.toString(CryptoJS.enc.Utf8));
    //alert(decryptedWA.toString(CryptoJS.enc.Utf8));
    //alert(encryptedCP);
    this.authService.currentUserObservable.subscribe(user => {
      if (user) {
        this.photoUrl = user.photoUrl;
      }
    });



  }
  authenticateotp(){
    this.router.navigate(['/authenticatelogin']);
  }
  login() {
    this.authService.login(this.model).subscribe(next => {
      //this.alertify.success('Logged in successfully.');
    }, error => {
      this.alertify.error("wrong log in credentials");
    }, () =>{
      this.alertify.success('Logged in successfully.');
      this.router.navigate(['/members']);
    });
  }
  generate(n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

        if ( n > max ) {
                return this.generate(max) + this.generate(n - max);
        }

        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;

        return ("" + number).substring(add);
}



  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    authenticated = false;
    otpcoden = null;
    this.alertify.message('Logged out.');
    this.router.navigate(['/home']);
  }
  loadUsers() {
    this.usersService
      .getUsers(1, 999, this.usersParams)
      .subscribe(response => {
        const { items, ...pagination } = response;
        this.allusers = items;
        this.allusers.forEach(function(value){
          if(value.gender == "male"){
            malenum++;
          }else if(value.gender == "female"){
            femalenum++;
          }else{
            othersnum++;
          }

        });
        this.malesnotif.innerHTML = malenum.toString();
        this.femalesnotif.innerHTML = femalenum.toString();
        this.othersnotif.innerHTML = othersnum.toString();
      }, error => {
        this.alertify.error(error.error);
      });
  }
}
