import { Component, Input } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  // show base on number of items and quantity of those items in the cart
  itemsQuantity = 0;
  
  @Input()
  get cart(): Cart{
    return this._cart;
  }

  set cart(cart: Cart){
     this._cart = cart;
     // every time that cart changes we want update this.itemsQuantity 
     // we using cart.items array,instead of the objects we are transforming that only have the quantity,
     // then we can use this item.quantity to add up and get the final items quantity therefor use in reduce function 
     this.itemsQuantity = cart.items 
      .map((item) => item.quantity)
      .reduce((prev, current) => prev + current, 0 );
  }
  
  constructor(private cartService: CartService){}

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.ClearCart();
  }
}
