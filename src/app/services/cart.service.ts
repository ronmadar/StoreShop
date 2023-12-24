import { Injectable } from '@angular/core';
import { Cart ,CartItem} from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // how use cart? basically holds initial value and once we update,
  // for example: add new products to card it just adds new items array {items: []}
  // and every single component we want in our application: we can subsribe to BehaviorSubject , can recive the new values and update the UI
  cart = new BehaviorSubject<Cart>({items: []});

  // MatSnackBar: display the information to the user, once we add the product to the cart we want display information that we have successfully added this product
  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem): void {
    // created a new items array, wont be affect to default original cart object, destructure that object and create new array, accessing this.BehaviorSubject
    // now we can find the actual item, because when we adding items inside of this cart , we could be adding the same product multiple times
    const items = [...this.cart.value.items];
    // trying to find if there is item already added in cart items
    const itemInCart = items.find((_item) => _item.id === item.id);

    // if is already exists in cart, just want to increase the quantity 
    if(itemInCart){
      itemInCart.quantity += 1
    }else {
      items.push(item);
    }

    // emit this value , for every component that is subscribed to the cart can catch that value: emit the object items
    this.cart.next( {items} );
    // display the information to front
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
  }
  // use that method in two places : cart and header
  getTotal(items: Array<CartItem>): number {
    return items.map((item) => item.price * item.quantity)
    .reduce((prev, cuurent) => prev + cuurent, 0);
    // return this.cartService.getTotal(items);
  }

  
  ClearCart(): void {
    // we`re emitting the empty resetted value for our cart
    // then we call the next items array empty
    this.cart.next({ items: [] });
    // display info to user
    this._snackBar.open('Cart is cleared.', 'Ok', { duration: 3000 });
  }

  // update cart object and emit that
  removeFromCart(item:CartItem, update = true): Array<CartItem>{
    // loop through the cart element, want filter: remove the item from the array
   const filteredItems = this.cart.value.items.filter(
      // check if all elements on array , they dont have the id is pass. 
      (_item) => _item.id !== item.id
    );

    if(update){
      // now i want to update the items
      this.cart.next({ items: filteredItems });
      this._snackBar.open('One item remove from cart.', 'Ok', { duration: 3000 });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;
    // mapping this array items
    let filteredItems = this.cart.value.items.map((_item) => {
      if(_item.id === item.id){
        // when i get in the condition i find the one i want to reduce the quantity
        _item.quantity--;
        // if quantity == 0
        if(_item.quantity === 0){
            // this item has 0 in quantity, then mean need to remove from list in cart page
            itemForRemoval = _item;
        }
      }
      return _item;
    })
    // check if we mark any items for removal we call function 
    if(itemForRemoval){
      // pass the item for removal
      filteredItems = this.removeFromCart(itemForRemoval , false);
      
    }
    
    // update filteredItems
    this.cart.next({ items: filteredItems });
    this._snackBar.open('One item remove from cart.', 'Ok', { duration: 3000 });
  }
}
