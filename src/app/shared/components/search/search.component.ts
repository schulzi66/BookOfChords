import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit {
  @Output('onSearch') onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output('onClear') onClear: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public searchService: SearchService) {}

  ngAfterViewInit(): void {
    if (this.searchService.searchString && this.searchService.searchString.length > 0) {
      setTimeout(() => {
        this.onSearch.emit(this.searchService.searchString);
      }, 500);
    }
  }

  public search(): void {
    if (this.searchService.searchString && this.searchService.searchString.length > 0) {
      this.onSearch.emit(this.searchService.searchString);
    } else {
      this.clearSearch();
    }
  }

  public clearSearch(): void {
    this.searchService.searchString = '';
    this.onClear.emit();
  }
}
