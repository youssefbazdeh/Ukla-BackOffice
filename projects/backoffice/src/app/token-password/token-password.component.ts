import { Component } from '@angular/core';
import {User} from "../Models/User";
import {UserService} from "../Services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-token-password',
  templateUrl: './token-password.component.html',
  styleUrls: ['./token-password.component.css']
})
export class TokenPasswordComponent {

  token!: string;
  currentUser = new User();

  constructor(private userService: UserService,
              private dialog: MatDialog, private route: ActivatedRoute, private routeB: Router
  ) {
  }

  ngOnInit(): void {




  }

  verifiedToken() {
    if (!this.token) {
      Swal.fire('Fail', 'Please fill in all required fields !', 'warning');
    return;
    }

      this.userService.verifiedToken(this.token).subscribe((response: HttpResponse<any>) => {
          if (response.status == 200) {
            Swal.fire('Token Valid', 'Welcome Again !', 'success');
            this.routeB.navigate(["/ResetPassword/" + this.token]);

          } else Swal.fire('Fail', 'Invalid Token Or expired  !', 'error');


        },
        error => {
          if (error.status == 200) {
            Swal.fire('Token Valid', 'Welcome Again !', 'success');
            this.routeB.navigate(["/ResetPassword/" + this.token]);

          } else Swal.fire('Fail', 'Invalid Token Or expired  !', 'error');

        }
      );


    }

}
