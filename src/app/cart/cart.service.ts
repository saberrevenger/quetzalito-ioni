import { Injectable } from '@angular/core';

type OrderType = 'local' | 'recoger' | 'delivery';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Antojitos' | 'Platos fuertes' | 'Bebidas';
  image: string;
  favorite?: boolean;
  badge?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
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

  cartItems: MenuItem[] = [];
  customerName = '';
  customerPhone = '';
  orderType: OrderType = 'local';
  deliveryLocation = '';
  orderError = '';

  get cartCount(): number {
    return this.cartItems.length;
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  get cartProducts(): MenuItem[] {
    return this.menuItems.filter((item) => this.cartItems.some((cartItem) => cartItem.id === item.id));
  }

  addToCart(item: MenuItem): void {
    this.cartItems = [...this.cartItems, item];
  }

  removeFromCart(item: MenuItem): void {
    const itemIndex = this.cartItems.findIndex((cartItem) => cartItem.id === item.id);
    if (itemIndex === -1) return;
    this.cartItems = this.cartItems.filter((_, index) => index !== itemIndex);
  }

  getItemQuantity(item: MenuItem): number {
    return this.cartItems.filter((cartItem) => cartItem.id === item.id).length;
  }

  sendOrder(): boolean {
    const customerName = this.customerName.trim();
    const customerPhone = this.customerPhone.trim();
    const deliveryLocation = this.deliveryLocation.trim();
    if (!customerName || !customerPhone) {
      this.orderError = 'Completa tu nombre y número de teléfono para continuar.';
      return false;
    }
    if (this.orderType === 'delivery' && !deliveryLocation) {
      this.orderError = 'Escribe la ubicación donde deseas recibir tu pedido.';
      return false;
    }

    const orderLines = this.cartProducts.map((item) => {
      const quantity = this.getItemQuantity(item);
      return `🍽️ *${quantity} x ${item.name}*\n   ${this.formatPrice(item.price * quantity)}`;
    });
    const orderTypeLabel = {
      local: 'Comer en el local',
      recoger: 'Pasar a recoger',
      delivery: 'Delivery',
    }[this.orderType];
    const message = [
      '✨ *NUEVO PEDIDO - QUETZALITO* ✨',
      '━━━━━━━━━━━━━━━━━━',
      `👤 *Cliente:* ${customerName}`,
      `📞 *Teléfono:* ${customerPhone}`,
      `📦 *Modalidad:* ${orderTypeLabel}`,
      ...(this.orderType === 'delivery' ? [`📍 *Ubicación:* ${deliveryLocation}`] : []),
      '',
      '¡Hola! Quiero disfrutar estos platillos:',
      '',
      ...orderLines,
      '',
      '━━━━━━━━━━━━━━━━━━',
      `🛍️ *${this.cartCount} producto(s)*`,
      `💰 *TOTAL: ${this.formatPrice(this.cartTotal)}*`,
      '',
      '📲 Por favor, confirmen mi pedido. ¡Gracias!',
    ].join('\n');
    const whatsappUrl = `https://wa.me/50379782618?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    return true;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US', { currency: 'USD', style: 'currency' });
  }
}