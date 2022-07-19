import { NgModule, Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';

// import { Paginated, Pagination } from '../_models/pagination';
// import { Genders } from '../_shared/types/genders';
// import { UsersService } from '../_services/users.service';
// import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-authenticatelogin',
  templateUrl: './authenticatelogin.component.html',
  styleUrls: ['./authenticatelogin.component.css']
})

@NgModule({
  declarations: [
    AuthenticateloginComponent
  ],
})

export class AuthenticateloginComponent implements OnInit {

  user: User;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // get data before activating the route. It can be used to avoid using safe navigators "?" in html page
    this.route.data.subscribe(data => {

    });
    this.user = this.authService.currentUser;
  }

}
