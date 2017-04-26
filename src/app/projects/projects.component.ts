import { Component, OnInit } from '@angular/core';

import { ProfessionalService } from './../core/professional.service';

@Component({
  selector: 'mbp-projects',
  template: `
    <mb-layout>
      <router-outlet id="projectsRouter"></router-outlet>
    </mb-layout>
  `
})
export class ProjectsComponent implements OnInit {

  constructor(
    // private clientsService: ClientService
    private profService: ProfessionalService
  ) { }

  ngOnInit() {
    // let user = this.userService.getCurrentUser();
    // if (user && user.clients === undefined || user.clients === null) {
    //   this.clientsService.getAllByProfessional(user.Id).subscribe(
    //     result => {
    //       user.clients = result;
    //       this.userService.setCurrentUser(user);
    //     })
    // }

  }

}
