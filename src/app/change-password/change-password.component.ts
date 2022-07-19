import { Component, OnInit,AfterViewInit } from '@angular/core';
import { UsersService } from 'src/app/_services/users.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user';
import * as CryptoJS from 'crypto-js';

var otpcoden = null;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit,AfterViewInit {
  auths : AuthService;
  user: User;
  opinput : HTMLInputElement;
  npinput : HTMLInputElement;
  npinput2 : HTMLInputElement;
  otpinput : HTMLInputElement;

  constructor(private userService: UsersService,
  private authService: AuthService,
  private router: Router,
  private alertify: AlertifyService) {

  }
  ngAfterViewInit(){
    this.opinput = document.getElementById("cpinput") as HTMLInputElement;
    this.npinput = document.getElementById("npinput") as HTMLInputElement;
    this.npinput2 = document.getElementById("npinput2") as HTMLInputElement;
    this.otpinput = document.getElementById("otpinput") as HTMLInputElement;

  }
  changePasswordNow(){
    if(otpcoden != null){
      if(this.otpinput.value == otpcoden){
        this.user.password = this.opinput.value;
        this.user.newPassword = this.npinput.value;
        if(this.npinput.value == this.npinput2.value){
          this.userService.changepassword(this.user)
            .subscribe(next => {
              this.alertify.success('Password updated successfully.');
              otpcoden = null;
            }, error => {
              this.alertify.error(error.error);
            });
        }else{
          this.alertify.error("Password does not match");
        }
      }else{

        this.alertify.error("Wrong OTP code");
      }
    }else{
      this.alertify.error("Click send to send OTP to your Email Address");
    }

  }
  sendOTP(){
    var email = this.user.email;
    otpcoden = this.generate(6);
    var key = CryptoJS.enc.Utf8.parse('b75524255a7f54d2726a951bb39204df');
    var iv  = CryptoJS.enc.Utf8.parse('1583288699248111');
    var encryptedCP = CryptoJS.AES.encrypt(otpcoden, key, { iv: iv });
    var encryptedotp = encodeURI(encryptedCP.toString());
    window.open('http://127.0.0.1/datingapp/verif.php?email=' + email +  '&subject=verification%20code&message=' + encryptedotp, '_blank').focus();
    this.alertify.success('OTP sent');

  }
  ngOnInit(){
      this.user = this.authService.currentUser;
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
  encryptData(data) {

      try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), "falalalala").toString();
      } catch (e) {
        console.log(e);
      }
    }

}
