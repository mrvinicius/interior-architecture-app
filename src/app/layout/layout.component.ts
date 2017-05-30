import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../core/auth.service';
import { ProfessionalService } from './../core/professional.service';

@Component({
  selector: 'mb-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userName;

  constructor(
    private authService: AuthService,
    private profService: ProfessionalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userName = this.authService.getCurrentUser().name;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/entrar']);

  }
}
