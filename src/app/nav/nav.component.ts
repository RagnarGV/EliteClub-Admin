import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../services.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private router: Router, private authService: ServicesService) {}
  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated(); // Check login status
  }
  logout() {
    localStorage.removeItem('token'); // Remove JWT
    this.isLoggedIn = false; // Update navbar visibility
    this.router.navigate(['/login']);
  }
}
