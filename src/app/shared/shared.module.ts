import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeListService } from '../modules/characters/services/home-list.service';
import { CardCustomComponent } from './components/card-custom/card-custom.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SharedService } from './services/shared.service';

const COMPONENTS = [SideNavComponent, CardCustomComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [...COMPONENTS],
  providers: [HomeListService, SharedService],
})
export class SharedModule {}
