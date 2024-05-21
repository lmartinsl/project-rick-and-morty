import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Character } from 'src/app/interfaces/list-response.interface';
import { CardCustom } from 'src/app/shared/interfaces/card-custom.interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomeListService } from '../../services/home-list.service';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss'],
})
export class FavoritesListComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  public favorites: CardCustom[] = [];

  constructor(
    private _favoritesListService: AppService,
    private _homeListService: HomeListService,
    public _sharedService: SharedService
  ) {
    this._favoritesListService.setAction(false);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this._favoritesListService
        .getFavoritesList()
        .subscribe((favoritesList) => {
          this.populateList(favoritesList);
        })
    );
  }

  private populateList(favoritesList: Character[]): void {
    this._homeListService.getAllList().subscribe((listCharacters) => {
      this.favorites = this._sharedService.convertToCardArray(
        listCharacters.results,
        favoritesList,
        true
      );
    });
  }

  setAction(): void {
    this._favoritesListService.setAction(true);
  }

  cardEmitter(event: CardCustom): void {
    this.subscriptions.add(
      this._homeListService.getById(event.id).subscribe((item: Character) => {
        this._favoritesListService.setFavoritesList(item);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
