import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBreadcrumb } from './breadcrumb';

@Injectable()
export class BreadcrumbsService {
  public breadcrumbTrail: IBreadcrumb[];

  constructor() {
    this.breadcrumbTrail = [];
  }

  getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const routeDataLabel: string = 'breadcrumb';
    //get the child routes
    let children: ActivatedRoute[] = route.children;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      // console.log(child.snapshot.data);
      // console.log(child.snapshot.data.hasOwnProperty(routeDataLabel));

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(routeDataLabel)
        || !child.snapshot.data[routeDataLabel]) {
        // console.log('no bc data', child.snapshot);
        return this.getBreadcrumbs(child, url, breadcrumbs);

      }

      // get the route's URL segment
      let routeURL: string =
        child.snapshot.url.map(segment => segment.path).join("/");

      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[routeDataLabel],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    return;
  }
}
