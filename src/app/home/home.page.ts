import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, arrowForward, bagHandle, remove, search, star } from 'ionicons/icons';
import { CartService } from '../cart/cart.service';

type Category = 'Todo' | 'Favoritos' | 'Antojitos' | 'Platos fuertes' | 'Bebidas';
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
  readonly categories: Category[] = ['Todo', 'Favoritos', 'Antojitos', 'Platos fuertes', 'Bebidas'];
  selectedCategory: Category = 'Todo';
  searchTerm = '';
  readonly menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Pechuga a la plancha',
      description: 'Pechuga de pollo dorada a la plancha, servida con arroz, ensalada y guarnición casera.',
      price: 12.5,
      category: 'Platos fuertes',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/El_S%C3%BAper_Almuerzo_-2_%28Part_Deux%29.jpg?width=900',
      favorite: true,
      badge: 'Favorito',
    },
    {
      id: 2,
      name: 'Sopa de gallina',
      description: 'Caldo casero de gallina con verduras, elote y hierbas aromáticas al estilo salvadoreño.',
      price: 7.5,
      category: 'Platos fuertes',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sopa_de_pata.jpg?width=900',
      favorite: true,
    },
    {
      id: 3,
      name: 'Camarones de La Libertad',
      description: 'Camarones salteados al ajillo con mantequilla, limón y un toque de chile.',
      price: 13.5,
      category: 'Platos fuertes',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2010.05.05.151853_Mariscada_El_Sunzal_El_Salvador.jpg?width=900',
    },
    {
      id: 4,
      name: 'Yuca frita con chicharrón',
      description: 'Yuca dorada, chicharrón crujiente, curtido y salsa de tomate de la casa.',
      price: 9.5,
      category: 'Antojitos',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Empanada_y_yuca_frita_salvadore%C3%B1a.jpg?width=900',
    },
    {
      id: 5,
      name: 'Carne asada al carbón',
      description: 'Corte de res marinado con cítricos, arroz, frijoles y plátano frito.',
      price: 8,
      category: 'Platos fuertes',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Platanos%2C_arroz%2C_y_frijoles%2C_Lago_de_Coatepeque%2C_El_Salvador.jpg?width=900',
      badge: 'De la casa',
    },
    {
      id: 6,
      name: 'Tamales salvadoreños',
      description: 'Tamales de masa suave, envueltos en hoja y preparados con receta tradicional.',
      price: 6.5,
      category: 'Antojitos',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tamales_Salvadore%C3%B1os_1.jpg?width=900',
      badge: 'Tradicional',
    },
    {
      id: 7,
      name: 'Panes con pollo',
      description: 'Pan salvadoreño relleno de pollo, verduras y salsa casera.',
      price: 8.5,
      category: 'Platos fuertes',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Panesconpollo-1509816_10152125609288668_5472564942554370624_n.jpg?width=900',
    },
    {
      id: 8,
      name: 'Elote loco',
      description: 'Elote cubierto con mayonesa, queso, limón y chile al gusto.',
      price: 4.5,
      category: 'Antojitos',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Elote_loco.jpg?width=900',
    },
    {
      id: 9,
      name: 'Horchata salvadoreña',
      description: 'Bebida fría de morro con canela, perfecta para acompañar tu pedido.',
      price: 3.5,
      category: 'Bebidas',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Horchata_SV.png?width=900',
      badge: 'Refrescante',
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
