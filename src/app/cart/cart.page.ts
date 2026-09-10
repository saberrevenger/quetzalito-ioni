import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, arrowBack, arrowForward, bagHandle, remove } from 'ionicons/icons';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
  imports: [FormsModule, IonContent, IonIcon, RouterLink],
})
export class CartPage {
  constructor(public readonly cart: CartService) {
    addIcons({ add, arrowBack, arrowForward, bagHandle, remove });
  }

  get cartCount(): number {
    return this.cart.cartCount;
  }

  get cartTotal(): number {
    return this.cart.cartTotal;
  }

  get cartProducts() {
    return this.cart.cartProducts;
  }

  getItemQuantity(item: typeof this.cart.menuItems[number]): number {
    return this.cart.getItemQuantity(item);
  }

  sendOrder(): void {
    this.cart.sendOrder();
  }

  formatPrice(price: number): string {
    return this.cart.formatPrice(price);
  }
}
