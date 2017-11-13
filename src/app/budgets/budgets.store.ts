import { Observer, Observable, Subject } from 'rxjs';

export type Reducer<S, A> =
    (store: Store<S, A>, state: S, action: A) => S|Observable<S>;

export class Store<S, A> {
    private actions =
    new Subject<{ action: A, result: Observer<boolean> }>();


    constructor(parameters) {

    }
}