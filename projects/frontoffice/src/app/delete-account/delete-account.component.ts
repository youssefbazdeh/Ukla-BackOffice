import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { UserService } from '../Service/user.service';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoaderService } from '../Service/loader.service';

@Component({
  selector: 'front-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit{
  username!: string;
  password!: string;
  userData: any;
  role = "USER";
  enabled = true;
  showPassword: boolean = false;
  user=new User();
  id: any;
  userId: any;

  
togglePassword() {
throw new Error('Method not implemented.');
}
onSubmit() {
throw new Error('Method not implemented.');
}
  constructor(
    private router: Router,
    private userService: UserService,
   private authService: AuthService,
   public loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    if (!window.location.hash) {
      window.location.hash = 'loaded';
      window.location.reload();
    }
  }
  

  
  delete() {
    const token = this.authService.getToken();
    this.loaderService.setLoading(true)
        this.userService.deleteAccountByUsername().subscribe({
          next: (data) => {
            this.loaderService.setLoading(false);
            Swal.fire('Success', 'User deleted successfully!', 'success');
            this.router.navigate(["/waitlist"]);
          },
          error: (error) => {
            this.loaderService.setLoading(false);
            Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
          }
        });
      
 
  }
    
  
 
}
