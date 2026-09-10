import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, arrowForward, bagHandle, remove, search, star } from 'ionicons/icons';
import { CartService } from '../cart/cart.service';

type Category = 'Todo' | 'Favoritos' | 'Platos fuertes';
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'Todo' | 'Favoritos'>;
  image: string;
  favorite?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, IonContent, IonIcon],
})
export class HomePage {
  readonly categories: Category[] = ['Todo', 'Favoritos', 'Platos fuertes'];
  selectedCategory: Category = 'Todo';
  searchTerm = '';
  readonly menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Carne a la plancha',
      description: 'Corte de res a la plancha, acompañado de guarnición de la casa.',
      price: 12.5,
      category: 'Platos fuertes',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
      favorite: true,
      badge: 'Favorito',
    },
    {
      id: 2,
      name: 'Sopa de gallina',
      description: 'Caldo casero de gallina con verduras frescas y hierbas aromáticas.',
      price: 7.5,
      category: 'Platos fuertes',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
      favorite: true,
    },
    {
      id: 3,
      name: 'Camarones al ajillo',
      description: 'Camarones salteados al ajillo, con mantequilla y un toque de limón.',
      price: 13.5,
      category: 'Platos fuertes',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85',
    },
    {
      id: 4,
      name: 'Pechuga a la plancha',
      description: 'Pechuga de pollo dorada a la plancha con ensalada y papas caseras.',
      price: 9.5,
      category: 'Platos fuertes',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85',
    },
    {
      id: 5,
      name: 'Chicharrones',
      description: 'Chicharrones crujientes servidos con guarnición y salsa de la casa.',
      price: 8,
      category: 'Platos fuertes',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85',
      badge: 'Nuevo',
    },
  ];

  constructor(public readonly cart: CartService, private readonly router: Router) {
    addIcons({ add, arrowForward, bagHandle, remove, search, star });
  }

  get filteredItems(): MenuItem[] {
    const normalizedSearch = this.searchTerm.toLowerCase().trim();
    return this.menuItems.filter((item) => {
      const matchesCategory = this.selectedCategory === 'Todo'
        || (this.selectedCategory === 'Favoritos' ? item.favorite : item.category === this.selectedCategory);
      const matchesSearch = !normalizedSearch
        || `${item.name} ${item.description}`.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }

  get cartCount(): number {
    return this.cart.cartCount;
  }

  get cartTotal(): number {
    return this.cart.cartTotal;
  }

  get cartProducts(): MenuItem[] {
    return this.cart.cartProducts;
  }

  addToCart(item: MenuItem): void {
    this.cart.addToCart(item);
  }

  removeFromCart(item: MenuItem): void {
    this.cart.removeFromCart(item);
  }

  getItemQuantity(item: MenuItem): number {
    return this.cart.getItemQuantity(item);
  }

  openCart(): void {
    this.router.navigate(['/carrito']);
  }

  setCategory(category: Category): void {
    this.selectedCategory = category;
  }

  formatPrice(price: number): string {
    return this.cart.formatPrice(price);
  }
}
