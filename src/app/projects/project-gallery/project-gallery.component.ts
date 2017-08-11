import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { GalleryService } from 'ng-gallery';

import { LayoutContentService } from './../../layout/shared/layout-content.service';
import { LayoutHeaderService } from './../../layout/shared/layout-header.service';
import { LayoutSidebarService } from './../../layout/shared/layout-sidebar.service';
import { Project } from './../shared/project';

@Component({
  selector: 'abx-project-gallery',
  templateUrl: './project-gallery.component.html',
  styleUrls: ['./project-gallery.component.scss']
})
export class ProjectGalleryComponent implements OnInit {
  project: Project;

  constructor(
    private activateRoute: ActivatedRoute,
    private gallery: GalleryService,
    private headerService: LayoutHeaderService,
    private layoutContentService: LayoutContentService,
    private sidebarService: LayoutSidebarService
  ) { }

  ngOnInit() {
    this.headerService.hideHeader();
    this.sidebarService.hideSidebar();
    this.layoutContentService.setOverflowY('hidden');

    this.activateRoute.data
      .subscribe((data: { project: Project }) => {
        if (data.project) {
          this.project = data.project;
          console.log(this.project);
          let images = this.project.images64.map(img64 => {
            return { src: img64, thumbnail: img64 }
          })

          this.gallery.load(images)

        } else {
          console.error('Não há imagens a serem exibidas.')
        }
      })


  }

}
