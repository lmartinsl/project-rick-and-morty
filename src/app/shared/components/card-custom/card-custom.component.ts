import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-custom',
  templateUrl: './card-custom.component.html',
  styleUrls: ['./card-custom.component.scss']
})
export class CardCustomComponent implements OnInit {

  @Input() id!: number;
  @Input() imagePath!: string;
  @Input() cardTitle!: string;
  @Input() cardDescription!: string;
  @Input() hasFavorite = false;
  @Output() emitItem = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onCardEmit(): void {
    this.emitItem.emit({
      id: this.id,
      imagePath: this.imagePath,
      cardTitle: this.cardTitle,
      cardDescription: this.cardDescription,
      hasFavorite: this.hasFavorite,
    })
  }

}
