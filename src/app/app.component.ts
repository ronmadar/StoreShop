import { Component, OnInit } from '@angular/core';
import { Cart } from './models/cart.model';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  template: `<app-header [cart]="cart"></app-header>
             <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  // create new cart property, default values, use this cart to padd that to our header component
  cart: Cart = { items: []}

  constructor(private cartService: CartService){}
  // function run when comoponents are starts initialzation 
  ngOnInit() {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
  }
}
