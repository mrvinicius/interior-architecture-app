import { LayoutContentService } from './shared/layout-content.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { AuthService } from '../core/auth.service';
import { LayoutHeaderService } from './shared/layout-header.service';
import { LayoutSidebarService } from './shared/layout-sidebar.service';
import { ProfessionalService } from '../core/professional.service';

@Component({
  selector: 'mb-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  showHeader: boolean = true;
  showSidebar: boolean = true;
  overflowY: string = 'auto';
  userName: string;


  constructor(
    private authService: AuthService,
    private profService: ProfessionalService,
    private layoutContentService: LayoutContentService,
    private headerService: LayoutHeaderService,
    private sidebarService: LayoutSidebarService,
    private router: Router
  ) {
    this.router.events.filter(event => event instanceof NavigationStart).subscribe(event => {
      this.showHeader = true;
      this.showSidebar = true;
      this.overflowY = 'auto';
    });

    this.headerService.headerHidden$
      .subscribe(() => this.showHeader = false);

    this.sidebarService.sidebarHidden$
      .subscribe(() => this.showSidebar = false);

    this.layoutContentService.overflowYDefined$
      .subscribe((val) => this.overflowY = val);
  }

  ngOnInit() {
    this.userName = this.authService.getCurrentUser().name;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/entrar']);
    window.location.reload();
  }
}
