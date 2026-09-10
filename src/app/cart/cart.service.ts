import { Injectable } from '@angular/core';

type OrderType = 'local' | 'recoger' | 'delivery';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Antojitos' | 'Platos fuertes';
  image: string;
  favorite?: boolean;
  badge?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
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