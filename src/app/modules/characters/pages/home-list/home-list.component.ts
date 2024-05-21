import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Character } from 'src/app/interfaces/list-response.interface';
import { HomeListService } from 'src/app/modules/characters/services/home-list.service';
import { CardCustom } from 'src/app/shared/interfaces/card-custom.interface';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.scss'],
})
export class HomeListComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  public searchControl = new FormControl();
  public list: CardCustom[] = [];
  public showEmptyList = false;
  public nextPageUrl: string | null = null;

  constructor(
    private _homeListService: HomeListService,
    private _favoritesListService: AppService,
    public _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.buildLists();
    this.startValueChanges();
  }

  @HostListener('window:scroll', ['$event']) onScroll(event: any) {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    const marginFromBottom = 50;
    const isCloseToEnd =
      documentHeight - windowHeight - scrollPosition < marginFromBottom;

    const hasScroll = documentHeight > windowHeight;

    if (isCloseToEnd && hasScroll) {
      this.loadNextPage();
    }
  }

  private loadNextPage(): void {
    if (this.nextPageUrl) {
      this.subscriptions.add(
        this._homeListService
          .getByUrl(this.nextPageUrl)
          .pipe(catchError(() => of({ results: [], info: { next: null } })))
          .subscribe((response) => {
            const newList = this._sharedService.convertToCardArray(
              response.results,
              [],
              false
            );
            this.applyHasFavorite(newList);
            this.list = [...this.list, ...newList];
            this.nextPageUrl = response.info.next;
          })
      );
    }
  }

  private applyHasFavorite(newList: CardCustom[]): void {
    const favoritesList = this._favoritesListService.favoritesList$.getValue();
    newList.forEach((item) => {
      const isFavorite = favoritesList.some(
        (favorite) => favorite.id === item.id
      );
      item.hasFavorite = isFavorite;
    });
  }

  private populateListOnInit(favoritesList: Character[]): void {
    if (!this.searchControl.value) {
      this._homeListService.getAllList().subscribe((listCharacters) => {
        const newList = this._sharedService.convertToCardArray(
          listCharacters.results,
          favoritesList,
          false
        );
        this.applyHasFavorite(newList);
        this.list = newList;
        this.nextPageUrl = listCharacters.info.next;
      });
    }
  }

  private startValueChanges(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((term: string) =>
            term
              ? this._homeListService.getByName(term).pipe(
                  catchError((error) => {
                    if (error.status === 404) {
                      this.showEmptyList = true;
                      return of({ results: [] });
                    }
                    return of({ results: [] });
                  })
                )
              : this._homeListService
                  .getAllList()
                  .pipe(catchError(() => of({ results: [] })))
          )
        )
        .subscribe((response) => {
          if ('info' in response && response.info) {
            const favoritesList =
              this._favoritesListService.favoritesList$.getValue();
            this.list = this._sharedService.convertToCardArray(
              response.results,
              favoritesList,
              false
            );
            this.applyHasFavorite(this.list);
            this.showEmptyList = response.results.length === 0;
            this.nextPageUrl = response.info.next;
          }
        })
    );
  }

  private populateList(favoritesList: Character[]): void {
    const searchTerm = this.searchControl.value;
    if (!searchTerm) {
      this.populateListOnInit(favoritesList);
    } else {
      this._homeListService
        .getByName(searchTerm)
        .subscribe((listCharacters) => {
          const newList = this._sharedService.convertToCardArray(
            listCharacters.results,
            favoritesList,
            false
          );
          this.applyHasFavorite(newList);
          this.list = newList;
          this.nextPageUrl = listCharacters.info.next;
        });
    }
  }

  private buildLists(): void {
    this.subscriptions.add(
      this._favoritesListService
        .getFavoritesList()
        .subscribe((favoritesList) => {
          this.populateList(favoritesList);
        })
    );
  }

  private updateListItem(id: number): void {
    const updatedList = this.list.map((listItem) => {
      if (listItem.id === id) {
        return {
          ...listItem,
          hasFavorite: true,
        };
      }
      return listItem;
    });

    const itemIndex = updatedList.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      const newItem = {
        id: id,
        imagePath: '',
        cardTitle: '',
        cardDescription: '',
        hasFavorite: true,
      };
      updatedList.push(newItem);
    }

    this.list = updatedList;
  }

  cardEmitter(event: CardCustom): void {
    this.subscriptions.add(
      this._homeListService.getById(event.id).subscribe((item: Character) => {
        this._favoritesListService.setFavoritesList(item);
        this.updateListItem(event.id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
