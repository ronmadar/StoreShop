import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html'
})
export class ProductBoxComponent implements OnInit{
  @Input() fullWidthMode = false;
  // undefined because once when we implement the api we will pass this through the input, and while its fetching the data this product can be undefined for a littel bit of time
  @Input() product: Product | undefined ;
  @Output() addToCart = new EventEmitter();

  constructor(){}

  ngOnInit(): void {
    
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product); 
  }
}
