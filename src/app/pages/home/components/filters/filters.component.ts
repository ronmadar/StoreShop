import { 
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,} from '@angular/core';
  import { Subscription } from 'rxjs';
  import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
})

export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  categories: Array<string> | undefined;
  // unsubscribe when we leave the homepage
  categoriesSubscription: Subscription | undefined;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService
      .getAllCategories()
      .subscribe((response: Array<string>) => {
        this.categories = response;
      });
  }

  onNewShowCategory(category: string): void {
    console.log(category);
    this.showCategory.emit(category);
  }
  
  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
