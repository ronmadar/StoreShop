
// use in card component
export interface Cart {
    //items array, basically array of card item that created underneath
    items: Array<CartItem>;
}
// Data we recive through the application 
export interface CartItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    id: number;
}