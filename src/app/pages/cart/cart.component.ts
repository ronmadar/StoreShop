import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit{
  /* example: 
    cart: Cart = { items: [
    {
      product: 'https://via.placeholder.com/150',
      name: 'SNICKERS Chocolate Candy Bars Bulk Bag',
      price: 15.0,
      quantity: 1,
      id: 1,
    },
    {
      product: 'https://via.placeholder.com/150',
      name: 'Kinder, is a chocolate bar produced by Italian multinational confectionery company Ferrero.',
      price: 5.50,
      quantity: 3,
      id:2,
    }
  ]};
  
  */
  cart: Cart = { items: []};

  // add property to use inside of our table, assign it to empty arrayat the begining
  dataSource: Array<CartItem> = [];
  
  // these are the columns that we are going to show in the table
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];

  constructor(private cartService: CartService, private http: HttpClient){}

  ngOnInit(): void {
    //once we hook up the api we'll fetch the data and then we will feed this
    this.dataSource = this.cart.items; 
    // we want subcribe our new created item 
    this.cartService.cart.subscribe((_cart: Cart) => {
      // get back new _cart, all i want ti do is update our cart.
      this.cart = _cart;
      // set the dataSource to the cart items
      this.dataSource = this.cart.items; 
    })

  }

  getTotal(items: Array<CartItem>): number {
    // return items.map((item) => item.price * item.quantity)
    // .reduce((prev, cuurent) => prev + cuurent, 0);
    return this.cartService.getTotal(items);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onClearCart(): void {
    this.cartService.ClearCart();
  }

  onCheckout(): void { 
    // handle these items inside server and send to strip
    this.http.post('http://localhost:4242/checkout',{
      // pass items
      items: this.cart.items
    }).subscribe(async(res: any) => {
      // once we get the response back we recive someting from the server we can subsribe to it
      let stripe = await loadStripe('pk_test_51OPOORH9FOEzT9HisBrQz2gs7P9XpvGEL16X8v6TPM2G728C1Dhk8jt7RgOvI8UmIJxkDhnzRClQMCo0hFoWFReL00BjMYOLst');
      // once we load the stripe call to checkout
      stripe?.redirectToCheckout({
        // Do that from the session itself on server , we return session id and need to pass sassion id, then is will open the checkout
        sessionId: res.id
      })
    });
  }
}