import { Component, OnInit, Output, EventEmitter,AfterViewInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
var email = null;
var verified = false;
var otpcoden = null;
var diffInYears = null;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,AfterViewInit  {
  otpsendbtn:HTMLButtonElement = null;
  otpinput:HTMLInputElement = null;
  emailinput:HTMLInputElement = null;
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsDatepickerConfig: Partial<BsDatepickerConfig>;
  encryptData(data) {

      try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), "falalalala").toString();
      } catch (e) {
        console.log(e);
      }
    }
  validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
  }
    sendOTP(){
      email = this.emailinput.value;
      if(this.validateEmail(email)){
        otpcoden = this.generate(6);
        var key = CryptoJS.enc.Utf8.parse('b75524255a7f54d2726a951bb39204df');
        var iv  = CryptoJS.enc.Utf8.parse('1583288699248111');
        var encryptedCP = CryptoJS.AES.encrypt(otpcoden, key, { iv: iv });
        var encryptedotp = encodeURI(encryptedCP.toString());
        window.open('http://127.0.0.1/datingapp/verif.php?email=' + email +  '&subject=verification%20code&message=' + encryptedotp, '_blank').focus();
        this.alertify.success('OTP sent');

      }else{
        this.alertify.error("Invalid email address");
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService,
    private fb: FormBuilder
  ) { }
  ngAfterViewInit(){
    this.otpsendbtn = document.getElementById("sendotpcodebtn") as HTMLButtonElement;
    this.otpinput = document.getElementById("otpcodeinput") as HTMLInputElement;
    this.emailinput = document.getElementById("emailinput") as HTMLInputElement;
  }
  ngOnInit() {
    this.bsDatepickerConfig = {
      containerClass: 'theme-red'
    },
      this.createRegisterForm();

  }

  private createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      email:['',Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator});

  }

  register() {
    if (this.registerForm.valid) {
      if(diffInYears >= 18){
        if(this.emailinput.value == email){
          if(otpcoden == this.otpinput.value){
            this.user = Object.assign({}, this.registerForm.value);
            this.authService.register(this.user).subscribe(() => {
              this.alertify.success('Registration Successful.');
            }, error => {
              this.alertify.error(error.error);
            }, () => {
              this.authService.login(this.user).subscribe(() => {
                this.router.navigate(['/members']);
              });
            });
          }else{
            this.alertify.error("Wrong OTP code");
          }
        }else{
          this.alertify.error("send new OTP");
        }
      }else{
        this.alertify.error("You have not reach the minimum age of 18");
      }
      
    }
  }
  private passwordMatchValidator(g: FormGroup) {
    let dateOfBirth = g.get('dateOfBirth').value;
    let dateToday = new Date();
    if(dateOfBirth != null){
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
       const utc1 = Date.UTC(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate());
       const utc2 = Date.UTC(dateOfBirth.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate());
       const diffInDays = Math.floor((utc1 - utc2) / _MS_PER_DAY);
      diffInYears = Math.floor(diffInDays / 365);
       console.log( diffInYears);
    }
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
  }


  cancel() {
    this.cancelRegister.emit(false);
  }

  hasControlError(controlName: string, errorName?: string) {
    if (errorName) {
      return this.registerForm.get(controlName).hasError(errorName)
        && this.registerForm.get(controlName).touched;
    } else {
      return this.registerForm.get(controlName).errors
        && this.registerForm.get(controlName).touched;
    }
  }

  hasFormError(customErrorKey: string, controlName?: string) {
    return this.registerForm.hasError(customErrorKey)
      && controlName ? this.registerForm.get(controlName).touched : false;
  }

}
