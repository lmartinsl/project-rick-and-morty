import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesListComponent } from './pages/favorites-list/favorites-list.component';
import { HomeListComponent } from './pages/home-list/home-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeListComponent
  },
  {
    path: 'characters',
    component: HomeListComponent
  },
  {
    path: 'characters-favorites',
    component: FavoritesListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharactersRoutingModule { }
