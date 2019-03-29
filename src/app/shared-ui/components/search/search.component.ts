import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  public searchString: string;

  @Output('onSearch') onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output('onClear') onClear: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  public search(): void {
    if(this.searchString.length > 0) {
      this.onSearch.emit(this.searchString);
    } else {
      this.clearSearch();
    }
  }

  public clearSearch(): void {
    this.searchString = '';
    this.onClear.emit();
  }

}
