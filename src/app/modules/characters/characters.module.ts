import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CharactersRoutingModule } from './characters-routing.module';
import { FavoritesListComponent } from './pages/favorites-list/favorites-list.component';
import { HomeListComponent } from './pages/home-list/home-list.component';
import { HomeListService } from './services/home-list.service';

@NgModule({
  declarations: [HomeListComponent, FavoritesListComponent],
  imports: [
    CommonModule,
    CharactersRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [HomeListService, SharedService],
})
export class CharactersModule {}
