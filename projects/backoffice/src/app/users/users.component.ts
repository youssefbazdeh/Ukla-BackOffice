import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {UserService} from './../Services/user.service';
import {Component, OnInit} from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {GlobalService} from "../Services/global.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users!:any[];
  searchTerm: string = '';
  filteredUsers: any[] = [];
  constructor(private userservice: UserService, private router: Router,private globalService:GlobalService) {


  }

  ngOnInit(): void {
    this.getAllUsers();
  }


  getAllUsers() {
    this.userservice.getUsers().subscribe((response: any) => {
        if (response) {
          console.log(response);
          this.users = response;
          this.filteredUsers=response;
        }

      }
    );
  }

  deleteUser(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userservice.deleteUser(id).subscribe(
          (response: HttpResponse<any>) => {
            if (response.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'User has been deleted.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.value) {
                  window.location.reload();
                }
              });
            } else Swal.fire('Error', 'Try again', 'error');
          },
          (error: any) => {
            if (error.status == 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'User has been deleted.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.value) {
                  window.location.reload();
                }
              });
            } else Swal.fire('Error', 'Try again', 'error');
          }
        );

      }
    })

  }
  onLogoutClick(): void {
    this.globalService.logout().subscribe();
  }
  setRole(role: string, idUser: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Set Role!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userservice.setRole(role, idUser).subscribe((response: any) => {
            if (response.status == 200) {

              Swal.fire('Nice', 'Role Saved !', 'success');
            } else Swal.fire('Error', 'Try again', 'error');

          },
          (error: any) => {
            if (error.status == 200) {
              Swal.fire({
                title: 'Nice',
                text: 'Role Saved !',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.value) {
                  window.location.reload();
                }
              });

            } else Swal.fire('Error', 'Try again', 'error');


          }
        );

      }
    })



  }
  search() {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      const nameLower = user.username.toLowerCase();

      return nameLower.includes(searchTermLower) ;
    });
  }



}
