/* =========================================================
   EL DOGO DEL BARRIO — el asistente
   ---------------------------------------------------------
   Todo pasa dentro de la pantalla: el asistente escribe, tú
   contestas, y el pedido se va armando en la barra de arriba.

   El mensaje de WhatsApp SIEMPRE sale en español, aunque la
   página esté en inglés. Quien lo lee es el que está parado
   en el truck.
   ========================================================= */

(function () {
  'use strict';

  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  var estado = {
    idioma: 'es',
    sucursal: null,
    carrito: [],
    nombre: '',
    paso: 'saludo',
    pendiente: null
  };

  var el = {};
  var saltar = null;      // si el asistente está escribiendo, esto lo adelanta

  function t() { return DOGO.textos[estado.idioma]; }
  function dinero(n) { return '$' + n; }

  function limpiar(nodo) { while (nodo.firstChild) { nodo.removeChild(nodo.firstChild); } }

  function abajo() {
    el.charla.scrollTop = el.charla.scrollHeight;
  }

  /* ================= burbujas ================= */

  function burbuja(texto, quien) {
    var div = document.createElement('div');
    div.className = 'msg msg--' + quien;
    div.appendChild(document.createTextNode(texto));
    return div;
  }

  function puntos() {
    var div = document.createElement('div');
    div.className = 'msg msg--dogo msg--puntos';
    div.setAttribute('aria-label', t().escribiendo);
    for (var i = 0; i < 3; i++) {
      var p = document.createElement('span');
      p.className = 'punto';
      div.appendChild(p);
    }
    return div;
  }

  /* Escribe un mensaje: primero los puntitos, luego la burbuja.
     Tocar la pantalla lo adelanta. */
  function escribir(texto, listo) {
    var señal = puntos();
    el.charla.appendChild(señal);
    abajo();

    var espera = menosMovimiento.matches
      ? 0
      : Math.min(1100, 380 + texto.length * 11);

    var reloj = window.setTimeout(terminar, espera);
    saltar = terminar;

    function terminar() {
      if (!saltar && !reloj) { return; }
      window.clearTimeout(reloj);
      reloj = null;
      saltar = null;
      if (señal.parentNode) { señal.parentNode.removeChild(señal); }
      el.charla.appendChild(burbuja(texto, 'dogo'));
      abajo();
      listo();
    }
  }

  function decir(lista, listo) {
    var i = 0;
    (function siguiente() {
      if (i >= lista.length) { if (listo) { listo(); } return; }
      escribir(lista[i++], siguiente);
    })();
  }

  function contesto(texto) {
    el.charla.appendChild(burbuja(texto, 'yo'));
    abajo();
  }

  /* ================= opciones dentro de la charla ================= */

  function bandeja(clase) {
    var div = document.createElement('div');
    div.className = 'opciones' + (clase ? ' ' + clase : '');
    el.charla.appendChild(div);
    return div;
  }

  function cerrar(caja) {
    if (caja && caja.parentNode) { caja.parentNode.removeChild(caja); }
  }

  function botonSimple(caja, texto, alElegir, extra) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcion' + (extra ? ' ' + extra : '');
    b.appendChild(document.createTextNode(texto));
    b.addEventListener('click', function () {
      cerrar(caja);
      contesto(texto);
      alElegir();
    });
    caja.appendChild(b);
    return b;
  }

  function botonProducto(caja, item, alElegir) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcion opcion--producto';

    var fila = document.createElement('span');
    fila.className = 'opcion__fila';

    var nombre = document.createElement('span');
    nombre.className = 'opcion__nombre';
    nombre.appendChild(document.createTextNode(item.nombre));

    var precio = document.createElement('span');
    precio.className = 'opcion__precio';
    precio.appendChild(document.createTextNode(dinero(item.precio)));

    fila.appendChild(nombre);
    fila.appendChild(precio);

    var desc = document.createElement('span');
    desc.className = 'opcion__desc';
    desc.appendChild(document.createTextNode(item.desc[estado.idioma]));

    b.appendChild(fila);
    b.appendChild(desc);

    b.addEventListener('click', function () {
      cerrar(caja);
      contesto(item.nombre);
      alElegir();
    });
    caja.appendChild(b);
  }

  /* ================= carrito ================= */

  function agregar(item, tipo, combo) {
    /* Fuera del menú, "Explosivas" no se entiende. En la comanda y
       en el WhatsApp las papas llevan su prefijo. */
    var nombre = (tipo === 'papas') ? 'Papas ' + item.nombre : item.nombre;

    estado.carrito.push({
      tipo: tipo, nombre: nombre, precio: item.precio, combo: !!combo
    });
    pintarBarra();
    document.dispatchEvent(new CustomEvent('dogo:agregado'));
  }

  function total() {
    return estado.carrito.reduce(function (s, l) {
      return s + l.precio + (l.combo ? DOGO.combo.precio : 0);
    }, 0);
  }

  function pintarBarra() {
    limpiar(el.cuenta);
    var n = estado.carrito.length;
    if (!n) { el.cuenta.appendChild(document.createTextNode('—')); return; }
    el.cuenta.appendChild(document.createTextNode(n + ' · ' + dinero(total())));
  }

  /* ================= pasos ================= */

  var pasos = {

    saludo: function () {
      decir([t().hola1, t().pSucursal], function () {
        var caja = bandeja('opciones--ancha');
        DOGO.sucursales.forEach(function (suc) {
          botonSimple(caja, suc.nombre, function () {
            estado.sucursal = suc;
            ir('perro');
          });
        });
      });
    },

    perro: function () {
      decir([t().pPerro], function () {
        var caja = bandeja('opciones--rejilla');
        DOGO.perros.forEach(function (p) {
          botonProducto(caja, p, function () {
            estado.pendiente = p;
            ir('combo');
          });
        });
      });
    },

    combo: function () {
      var pregunta = t().pCombo + ' ' + DOGO.combo.desc[estado.idioma] +
                     ' +' + dinero(DOGO.combo.precio);
      decir([pregunta], function () {
        var caja = bandeja('opciones--ancha');
        botonSimple(caja, t().comboSi, function () {
          agregar(estado.pendiente, 'perro', true);
          estado.pendiente = null;
          ir('extra');
        }, 'opcion--si');
        botonSimple(caja, t().comboNo, function () {
          agregar(estado.pendiente, 'perro', false);
          estado.pendiente = null;
          ir('extra');
        });
      });
    },

    extra: function () {
      decir([t().pExtra], function () {
        var caja = bandeja('opciones--duo');
        botonSimple(caja, t().otroPerro, function () { ir('perro'); });
        botonSimple(caja, t().masPapas,  function () { ir('papas'); });
        botonSimple(caja, t().masBebida, function () { ir('bebida'); });
        botonSimple(caja, t().yaTermine, function () { ir('nombre'); }, 'opcion--si');
      });
    },

    papas: function () {
      decir([t().pPapas], function () {
        var caja = bandeja('opciones--rejilla');
        DOGO.papas.forEach(function (p) {
          botonProducto(caja, p, function () { agregar(p, 'papas', false); ir('extra'); });
        });
      });
    },

    bebida: function () {
      decir([t().pBebida], function () {
        var caja = bandeja('opciones--rejilla');
        DOGO.bebidas.forEach(function (b) {
          botonProducto(caja, b, function () { agregar(b, 'bebida', false); ir('extra'); });
        });
      });
    },

    nombre: function () {
      decir([t().pNombre], function () {
        var caja = bandeja('opciones--ancha');

        var form = document.createElement('form');
        form.className = 'campo';

        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'campo__input';
        input.placeholder = t().nombrePlaceholder;
        input.setAttribute('aria-label', t().nombrePlaceholder);
        input.maxLength = 40;

        var ok = document.createElement('button');
        ok.type = 'submit';
        ok.className = 'opcion opcion--si';
        ok.appendChild(document.createTextNode(t().nombreBoton));

        var error = document.createElement('p');
        error.className = 'campo__error';
        error.hidden = true;
        error.appendChild(document.createTextNode(t().nombreError));

        form.addEventListener('submit', function (ev) {
          ev.preventDefault();
          var valor = input.value.trim();
          if (!valor) { error.hidden = false; input.focus(); return; }
          estado.nombre = valor;
          cerrar(caja);
          contesto(valor);
          ir('listo');
        });

        form.appendChild(input);
        form.appendChild(ok);
        caja.appendChild(form);
        caja.appendChild(error);
        if (!('ontouchstart' in window)) { input.focus(); }
      });
    },

    listo: function () {
      decir([t().pListo.replace('{nombre}', estado.nombre)], function () {
        el.charla.appendChild(comanda());

        var caja = bandeja('opciones--ancha');

        /* El link se arma hasta aquí, cuando ya existe de verdad.
           Nunca un botón con href="#" esperando a llenarse. */
        var a = document.createElement('a');
        a.className = 'opcion opcion--whats';
        a.href = 'https://wa.me/' + estado.sucursal.tel +
                 '?text=' + encodeURIComponent(mensaje());
        a.target = '_blank';
        a.rel = 'noopener';
        a.appendChild(document.createTextNode(t().enviar));
        caja.appendChild(a);

        var nota = document.createElement('p');
        nota.className = 'charla__nota';
        nota.appendChild(document.createTextNode(t().aviso));
        caja.appendChild(nota);

        botonSimple(caja, t().empezarDeNuevo, reiniciar, 'opcion--texto');
        abajo();
      });
    }
  };

  function ir(paso) {
    estado.paso = paso;
    pasos[paso]();
  }

  /* ================= comanda (el ticket) ================= */

  function comanda() {
    var caja = document.createElement('div');
    caja.className = 'ticket';

    var suc = document.createElement('p');
    suc.className = 'ticket__sucursal';
    suc.appendChild(document.createTextNode(t().recogeEn + ': ' + estado.sucursal.nombre));
    caja.appendChild(suc);

    var lista = document.createElement('ul');
    lista.className = 'ticket__lista';

    estado.carrito.forEach(function (linea) {
      var li = document.createElement('li');
      li.className = 'ticket__linea';

      var texto = document.createElement('span');
      texto.appendChild(document.createTextNode(linea.nombre));
      if (linea.combo) {
        var tag = document.createElement('span');
        tag.className = 'ticket__combo';
        tag.appendChild(document.createTextNode(t().comboEtiqueta));
        texto.appendChild(tag);
      }

      var precio = document.createElement('span');
      precio.className = 'ticket__precio';
      precio.appendChild(document.createTextNode(
        dinero(linea.precio + (linea.combo ? DOGO.combo.precio : 0))
      ));

      li.appendChild(texto);
      li.appendChild(precio);
      lista.appendChild(li);
    });

    caja.appendChild(lista);

    var pie = document.createElement('p');
    pie.className = 'ticket__total';
    var etq = document.createElement('span');
    etq.appendChild(document.createTextNode(t().total));
    var cifra = document.createElement('strong');
    cifra.appendChild(document.createTextNode(dinero(total())));
    pie.appendChild(etq);
    pie.appendChild(cifra);
    caja.appendChild(pie);

    return caja;
  }

  /* ================= mensaje de WhatsApp (siempre en español) ================= */

  function mensaje() {
    var l = [];
    l.push('*NUEVO PEDIDO — EL DOGO DEL BARRIO*');
    l.push('');
    l.push('Recoge en: ' + estado.sucursal.nombre);
    l.push('Nombre: ' + estado.nombre);
    l.push('');
    estado.carrito.forEach(function (linea) {
      l.push('• ' + linea.nombre + ' — ' + dinero(linea.precio));
      if (linea.combo) {
        l.push('   + Combo: ' + DOGO.combo.desc.es + ' — ' + dinero(DOGO.combo.precio));
      }
    });
    l.push('');
    l.push('*TOTAL: ' + dinero(total()) + '*');
    return l.join('\n');
  }

  /* ================= arranque y reinicio ================= */

  function reiniciar() {
    estado.sucursal = null;
    estado.carrito = [];
    estado.nombre = '';
    estado.pendiente = null;
    saltar = null;
    limpiar(el.charla);
    pintarBarra();
    ir('saludo');
  }

  function cambiarIdioma(nuevo) {
    estado.idioma = nuevo;
    document.documentElement.lang = nuevo;
    document.dispatchEvent(new CustomEvent('dogo:idioma', { detail: nuevo }));
    reiniciar();
  }

  function iniciar() {
    el.pantalla = document.getElementById('pantalla');
    el.charla = document.getElementById('charla');
    el.cuenta = document.getElementById('cuenta');
    if (!el.charla) { return; }

    /* El negocio está en Edo. de México: el español es el default.
       El botón EN queda para quien lo necesite. */
    estado.idioma = 'es';
    document.documentElement.lang = 'es';

    DOGO.idioma = function () { return estado.idioma; };
    DOGO.cambiarIdioma = cambiarIdioma;

    /* tocar la pantalla adelanta lo que el asistente está escribiendo */
    el.charla.addEventListener('click', function (ev) {
      if (saltar && ev.target.closest && !ev.target.closest('.opciones')) { saltar(); }
    });

    pintarBarra();

    /* arranca cuando la pantalla entra en cuadro, no antes: así el
       saludo no se escribe mientras nadie lo está viendo */
    if ('IntersectionObserver' in window) {
      var ojo = new IntersectionObserver(function (entradas) {
        if (entradas[0].isIntersecting) {
          ojo.disconnect();
          ir('saludo');
        }
      }, { threshold: 0.25 });
      ojo.observe(el.pantalla);
    } else {
      ir('saludo');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
