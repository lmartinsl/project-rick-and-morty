import { Injectable } from '@angular/core';
import { Character } from 'src/app/interfaces/list-response.interface';
import { CardCustom } from '../interfaces/card-custom.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  convertToCardArray(
    characters: Character[],
    favoritesList: Character[],
    isFavoriteList: boolean
  ): CardCustom[] {
    const favoriteIds = new Set(favoritesList.map((favorite) => favorite.id));
    const listToConvert = isFavoriteList ? favoritesList : characters;

    return listToConvert.map((character) => ({
      id: character.id,
      imagePath: character.image,
      cardTitle: character.name,
      cardDescription: character.species,
      hasFavorite: favoriteIds.has(character.id),
    }));
  }
}
