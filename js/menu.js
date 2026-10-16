/* =========================================================
   EL DOGO DEL BARRIO — datos del menú
   ---------------------------------------------------------
   FUENTE ÚNICA DE VERDAD.
   El menú que se ve en la página y el bot de pedidos leen
   de este mismo archivo. Si cambias un precio aquí, cambia
   en los dos lados. No lo edites en ningún otro lugar.

   Para agregar un perro nuevo: copia un bloque y pégalo.
   Para cambiar un precio: edita el número de "precio".
   ========================================================= */

window.DOGO = window.DOGO || {};

/* ---------- SUCURSALES ----------
   tel = número de WhatsApp en formato internacional,
   sin +, sin espacios, sin guiones. México = 52 + 10 dígitos. */
DOGO.sucursales = [
  { id: 'suc1', nombre: 'Sucursal 1', tel: '525545883123' },
  { id: 'suc2', nombre: 'Sucursal 2', tel: '525653635020' }
];

/* ---------- LOS PERROS ----------
   Los nombres NO se traducen: son razas de perro y son la marca.
   Solo las descripciones tienen versión en inglés. */
DOGO.perros = [
  {
    id: 'dalmata', nombre: 'Dálmata Clásico', precio: 90,
    desc: {
      es: 'Salchicha con jitomate, cebolla, jalapeños y pepinillos.',
      en: 'Sausage with tomato, onion, jalapeños and pickles.'
    }
  },
  {
    id: 'pitbull', nombre: 'Pitbull Picante', precio: 100,
    desc: {
      es: 'Salchicha bañada en salsa extra hot con cebollas asadas.',
      en: 'Sausage drenched in extra-hot sauce with grilled onions.'
    }
  },
  {
    id: 'xolo', nombre: 'Xolo Chilorio', precio: 115,
    desc: {
      es: 'Salchicha con chilorio, queso derretido, cebolla y jalapeños.',
      en: 'Sausage with shredded chilorio pork, melted cheese, onion and jalapeños.'
    }
  },
  {
    id: 'chihuahuense', nombre: 'Chihuahuense', precio: 105,
    desc: {
      es: 'Salchicha con guacamole fresco, cebolla, jalapeño y jitomate.',
      en: 'Sausage with fresh guacamole, onion, jalapeño and tomato.'
    }
  },
  {
    id: 'pastor', nombre: 'Pastor Alemán', precio: 125,
    desc: {
      es: 'Salchicha con carne al pastor, piña y tocino crujiente.',
      en: 'Sausage with al pastor pork, pineapple and crispy bacon.'
    }
  },
  {
    id: 'doberman', nombre: 'Doberman Jalapeño', precio: 115,
    desc: {
      es: 'Salchicha dentro de un jalapeño, envuelta en tocino crujiente.',
      en: 'Sausage stuffed inside a jalapeño, wrapped in crispy bacon.'
    }
  },
  {
    id: 'bulldog', nombre: 'Bulldog Francés', precio: 105,
    desc: {
      es: 'Salchicha con papas a la francesa y cremosa salsa bechamel de queso.',
      en: 'Sausage with french fries and creamy cheese béchamel.'
    }
  },
  {
    id: 'sanbernardo', nombre: 'San Bernardo Quesudo', precio: 125,
    desc: {
      es: 'Salchicha con pierna dorada, huevo estrellado y mezcla de tres quesos.',
      en: 'Sausage with roast pork leg, fried egg and a three-cheese blend.'
    }
  },
  {
    id: 'golden', nombre: 'Golden Hawaiano', precio: 115,
    desc: {
      es: 'Salchicha con piña caramelizada, salsa hot y tocino crujiente.',
      en: 'Sausage with caramelized pineapple, hot sauce and crispy bacon.'
    }
  },
  {
    id: 'rottweiler', nombre: 'Rottweiler Ranchero', precio: 135,
    desc: {
      es: 'Salchicha con arrachera estilo ranchero, pimientos y cebolla asados.',
      en: 'Sausage with ranchero-style skirt steak, grilled peppers and onion.'
    }
  }
];

/* ---------- COMBO ---------- */
DOGO.combo = {
  precio: 65,
  desc: {
    es: 'Papas clásicas + refresco de lata o agua Ciel 600 ml.',
    en: 'Classic fries + canned soda or 600 ml Ciel water.'
  }
};

/* ---------- PAPAS ---------- */
DOGO.papas = [
  {
    id: 'papas-clasicas', nombre: 'Clásicas', precio: 45,
    desc: {
      es: 'Papas fritas, salchicha, queso derretido y aderezos.',
      en: 'Fries, sausage, melted cheese and dressings.'
    }
  },
  {
    id: 'papas-tocino', nombre: 'Con Tocino', precio: 55,
    desc: {
      es: 'Papas fritas, salchicha, queso derretido y tocino crujiente.',
      en: 'Fries, sausage, melted cheese and crispy bacon.'
    }
  },
  {
    id: 'papas-explosivas', nombre: 'Explosivas', precio: 60,
    desc: {
      es: 'Papas, salchicha, queso, jalapeños y salsa picante.',
      en: 'Fries, sausage, cheese, jalapeños and hot sauce.'
    }
  },
  {
    id: 'papas-especiales', nombre: 'Especiales', precio: 75,
    desc: {
      es: 'Papas, salchicha, tocino, queso, cebolla y jalapeños.',
      en: 'Fries, sausage, bacon, cheese, onion and jalapeños.'
    }
  }
];

/* ---------- BEBIDAS ---------- */
DOGO.bebidas = [
  {
    id: 'refresco', nombre: 'Refresco de lata', precio: 35,
    desc: {
      es: 'Coca-Cola, Coca-Cola Sin Azúcar, Sprite, Fanta o Fresca.',
      en: 'Coca-Cola, Coca-Cola Zero, Sprite, Fanta or Fresca.'
    }
  },
  {
    id: 'agua', nombre: 'Agua Ciel 600 ml', precio: 25,
    desc: { es: 'Agua natural, bien fría.', en: 'Still water, ice cold.' }
  }
];

/* =========================================================
   TEXTOS DE LA INTERFAZ (ES / EN)
   El pedido que se manda por WhatsApp SIEMPRE va en español:
   quien lo lee es el que está parado en el truck.
   ========================================================= */
DOGO.textos = {
  es: {
    htmlLang: 'es',
    saludo: '¿Qué va a querer, jefe?',
    bajada: 'Arma tu pedido aquí y te lo preparamos. Sin filas, sin esperar a que contesten.',
    pedir: 'Pedir aquí',
    verMenu: 'Ver el menú',

    pSucursal: '¿En qué sucursal lo recoges?',
    pPerro: 'Escoge tu perro',
    pCombo: '¿Lo haces combo?',
    pExtra: '¿Le agregas algo más?',
    pPapas: 'Escoge tus papas',
    pBebida: '¿Qué vas a tomar?',
    pNombre: '¿A nombre de quién?',
    pListo: 'Tu pedido',

    comboSi: 'Sí, hazlo combo',
    comboNo: 'Así está bien',
    otroPerro: 'Otro perro',
    masPapas: 'Papas',
    masBebida: 'Bebida',
    yaTermine: 'Ya, es todo',

    nombrePlaceholder: 'Tu nombre',
    nombreBoton: 'Continuar',
    nombreError: 'Escribe tu nombre para seguir.',

    total: 'Total',
    enviar: 'Enviar pedido por WhatsApp',
    aviso: 'Se abre WhatsApp con tu pedido escrito. Tú le das enviar.',
    empezarDeNuevo: 'Empezar de nuevo',
    quitar: 'Quitar',
    comboEtiqueta: 'Combo',
    recogeEn: 'Recoges en',
    vacio: 'Todavía no agregas nada.',
    comanda: 'Tu comanda',

    menuTitulo: 'El menú',
    menuPerros: 'Nuestros perros',
    menuCombo: 'Hazlo combo',
    menuPapas: 'Nuestras papas',
    menuBebidas: 'Bebidas',
    menuPedirCta: 'Pedir por WhatsApp',
    pie: 'Hecho para El Dogo del Barrio',
    idioma: 'English'
  },

  en: {
    htmlLang: 'en',
    saludo: 'What are you having?',
    bajada: 'Build your order here and we start making it. No line, no waiting for someone to answer.',
    pedir: 'Order here',
    verMenu: 'See the menu',

    pSucursal: 'Which truck are you picking up from?',
    pPerro: 'Pick your dog',
    pCombo: 'Make it a combo?',
    pExtra: 'Anything else?',
    pPapas: 'Pick your fries',
    pBebida: 'Something to drink?',
    pNombre: 'What name is it under?',
    pListo: 'Your order',

    comboSi: 'Yes, make it a combo',
    comboNo: 'No thanks',
    otroPerro: 'Another dog',
    masPapas: 'Fries',
    masBebida: 'Drink',
    yaTermine: "That's everything",

    nombrePlaceholder: 'Your name',
    nombreBoton: 'Continue',
    nombreError: 'Add your name to keep going.',

    total: 'Total',
    enviar: 'Send order on WhatsApp',
    aviso: 'WhatsApp opens with your order written out. You press send.',
    empezarDeNuevo: 'Start over',
    quitar: 'Remove',
    comboEtiqueta: 'Combo',
    recogeEn: 'Pick up at',
    vacio: 'Nothing added yet.',
    comanda: 'Your ticket',

    menuTitulo: 'The menu',
    menuPerros: 'Our dogs',
    menuCombo: 'Make it a combo',
    menuPapas: 'Our fries',
    menuBebidas: 'Drinks',
    menuPedirCta: 'Order on WhatsApp',
    pie: 'Made for El Dogo del Barrio',
    idioma: 'Español'
  }
};
