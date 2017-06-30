import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBreadcrumb } from './breadcrumb';

@Injectable()
export class BreadcrumbsService {
  public breadcrumbTrail: IBreadcrumb[];

  constructor() {
    this.breadcrumbTrail = [];
  }

  buildBreadcrumbTrail(url: string): IBreadcrumb[] {
    if (url.indexOf('/') === 0) url = url.slice(1)

    let paths = url.split('/');

    this.breadcrumbTrail = [];

    paths.forEach((path, pos, pathsArray) => {
      let bcUrl = '/' + pathsArray[0];

      for (var i = 0; i < pos; i++)
        bcUrl += '/' + pathsArray[i + 1];

      this.breadcrumbTrail.push({
        label: path.replace(/-/g, ' '),
        url: bcUrl
      });
    });

    return this.breadcrumbTrail;
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

  // private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
  //   const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

  //   //get the child routes
  //   let children: ActivatedRoute[] = route.children;

  //   //return if there are no more children
  //   if (children.length === 0) {
  //     return breadcrumbs;
  //   }

  //   //iterate over each children
  //   for (let child of children) {
  //     // //verify primary route
  //     // if (child.outlet !== PRIMARY_OUTLET) {
  //     //   continue;
  //     // }

  //     //verify the custom data property "breadcrumb" is specified on the route
  //     if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
  //       return this.getBreadcrumbs(child, url, breadcrumbs);
  //     }

  //     //get the route's URL segment
  //     let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

  //     //append route URL to URL
  //     url += `/${routeURL}`;

  //     //add breadcrumb
  //     let breadcrumb: IBreadcrumb = {
  //       label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
  //       params: child.snapshot.params,
  //       url: url
  //     };
  //     breadcrumbs.push(breadcrumb);

  //     //recursive
  //     return this.getBreadcrumbs(child, url, breadcrumbs);
  //   }

  //   //we should never get here, but just in case
  //   return breadcrumbs;
  // }
}
