import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  public activeButton = 'home';
  public favorites$ = this._favoritesListService.getFavoritesList();
  public actionNav = false;

  constructor(private _favoritesListService: AppService) {}

  ngOnInit(): void {
    this._favoritesListService
      .getAction()
      .subscribe((res) => (this.actionNav = res));
  }

  setActive(button: string) {
    this.activeButton = button;
  }
}
