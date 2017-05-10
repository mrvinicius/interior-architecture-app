import { Injectable } from '@angular/core';

import { IBreadcrumb } from './breadcrumb';

@Injectable()
export class BreadcrumbsService {
  public breadcrumbTrail: IBreadcrumb[];

  constructor() {
    this.breadcrumbTrail = [];
  }
  
  // TODO: Build our own trail, BUT withtout overriding custom build 
  buildBreadcrumbTrail(url: string): IBreadcrumb[] {
    if (url.indexOf('/') === 0) url = url.slice(1)
    
    let paths = url.split('/');
    
    this.breadcrumbTrail = [];
    
    paths.forEach((path, pos, pathsArray) => {
      let bcUrl = '/' + pathsArray[0];

      for (var i = 0; i < pos; i++)
        bcUrl += '/' + pathsArray[i+1];
      
      this.breadcrumbTrail.push({
        label: path,
        url: bcUrl
      });
    });

    return this.breadcrumbTrail;
  }
}
