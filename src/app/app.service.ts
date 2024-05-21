import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from 'src/app/interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  favoritesList$ = new BehaviorSubject<Character[]>([]);
  actionNav$ = new BehaviorSubject<boolean>(false);

  setFavoritesList(character: Character): void {
    const currentList = this.favoritesList$.getValue();
    const index = currentList.findIndex((item) => item.id === character.id);
    let updatedList: Character[];

    if (index !== -1) {
      updatedList = currentList.filter((item) => item.id !== character.id);
    } else {
      updatedList = [...currentList, character];
    }

    this.favoritesList$.next(updatedList);
  }

  getFavoritesList(): Observable<Character[]> {
    return this.favoritesList$.asObservable();
  }

  setAction(action: boolean): void {
    this.actionNav$.next(action);
  }

  getAction(): Observable<boolean> {
    return this.actionNav$.asObservable();
  }
}
