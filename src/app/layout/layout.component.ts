import { Component, OnInit, ElementRef } from '@angular/core';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'mb-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userName;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userName = this.authService.currentUser.name;
  }

  logout() {
    this.authService.logout();
  }
}
