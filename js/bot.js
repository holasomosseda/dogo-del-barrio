/* =========================================================
   EL DOGO DEL BARRIO — bot de pedidos
   ---------------------------------------------------------
   Arma el pedido con preguntas encadenadas y al final abre
   WhatsApp con el mensaje ya escrito.

   OJO: el mensaje de WhatsApp siempre va en español, aunque
   el cliente esté navegando en inglés. Quien lo lee es el
   que está parado en el truck.
   ========================================================= */

(function () {
  'use strict';

  var estado = {
    idioma: 'es',
    sucursal: null,
    carrito: [],
    nombre: '',
    paso: 'sucursal',
    pendiente: null   // el perro que acaba de escoger, esperando respuesta de combo
  };

  var el = {};

  function t() { return DOGO.textos[estado.idioma]; }
  function dinero(n) { return '$' + n; }

  /* ---------------- construcción de elementos ---------------- */

  function boton(texto, onClick, extra) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcion' + (extra ? ' ' + extra : '');
    b.appendChild(document.createTextNode(texto));
    b.addEventListener('click', onClick);
    return b;
  }

  function opcionProducto(item, onClick) {
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
    b.addEventListener('click', onClick);
    return b;
  }

  function limpiar(nodo) {
    while (nodo.firstChild) { nodo.removeChild(nodo.firstChild); }
  }

  /* ---------------- carrito ---------------- */

  function agregar(item, tipo, combo) {
    /* Fuera del menú, "Explosivas" no se entiende. En la comanda y en
       el WhatsApp las papas llevan su prefijo. */
    var nombre = (tipo === 'papas') ? 'Papas ' + item.nombre : item.nombre;

    estado.carrito.push({
      tipo: tipo,
      nombre: nombre,
      precio: item.precio,
      combo: !!combo
    });
    document.dispatchEvent(new CustomEvent('dogo:agregado'));
  }

  function quitar(indice) {
    estado.carrito.splice(indice, 1);
    if (estado.carrito.length === 0) {
      estado.paso = 'perro';
    }
    render();
  }

  function total() {
    return estado.carrito.reduce(function (suma, linea) {
      return suma + linea.precio + (linea.combo ? DOGO.combo.precio : 0);
    }, 0);
  }

  /* ---------------- pasos ---------------- */

  var pasos = {

    sucursal: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pSucursal));
      DOGO.sucursales.forEach(function (suc) {
        opciones.appendChild(boton(suc.nombre, function () {
          estado.sucursal = suc;
          estado.paso = 'perro';
          render();
        }, 'opcion--ancha'));
      });
    },

    perro: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pPerro));
      opciones.className = 'ventanilla__opciones ventanilla__opciones--rejilla';
      DOGO.perros.forEach(function (perro) {
        opciones.appendChild(opcionProducto(perro, function () {
          estado.pendiente = perro;
          estado.paso = 'combo';
          render();
        }));
      });
    },

    combo: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pCombo));

      var nota = document.createElement('p');
      nota.className = 'ventanilla__nota';
      nota.appendChild(document.createTextNode(
        DOGO.combo.desc[estado.idioma] + '  +' + dinero(DOGO.combo.precio)
      ));
      pregunta.parentNode.insertBefore(nota, opciones);

      opciones.appendChild(boton(t().comboSi, function () {
        agregar(estado.pendiente, 'perro', true);
        estado.pendiente = null;
        estado.paso = 'extra';
        render();
      }, 'opcion--ancha opcion--si'));

      opciones.appendChild(boton(t().comboNo, function () {
        agregar(estado.pendiente, 'perro', false);
        estado.pendiente = null;
        estado.paso = 'extra';
        render();
      }, 'opcion--ancha'));
    },

    extra: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pExtra));
      opciones.className = 'ventanilla__opciones ventanilla__opciones--duo';

      opciones.appendChild(boton(t().otroPerro, function () {
        estado.paso = 'perro'; render();
      }));
      opciones.appendChild(boton(t().masPapas, function () {
        estado.paso = 'papas'; render();
      }));
      opciones.appendChild(boton(t().masBebida, function () {
        estado.paso = 'bebida'; render();
      }));
      opciones.appendChild(boton(t().yaTermine, function () {
        estado.paso = 'nombre'; render();
      }, 'opcion--si'));
    },

    papas: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pPapas));
      opciones.className = 'ventanilla__opciones ventanilla__opciones--rejilla';
      DOGO.papas.forEach(function (p) {
        opciones.appendChild(opcionProducto(p, function () {
          agregar(p, 'papas', false);
          estado.paso = 'extra';
          render();
        }));
      });
    },

    bebida: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pBebida));
      opciones.className = 'ventanilla__opciones ventanilla__opciones--rejilla';
      DOGO.bebidas.forEach(function (b) {
        opciones.appendChild(opcionProducto(b, function () {
          agregar(b, 'bebida', false);
          estado.paso = 'extra';
          render();
        }));
      });
    },

    nombre: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pNombre));

      var form = document.createElement('form');
      form.className = 'campo';

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'campo__input';
      input.placeholder = t().nombrePlaceholder;
      input.setAttribute('aria-label', t().nombrePlaceholder);
      input.maxLength = 40;
      input.value = estado.nombre;

      var enviar = document.createElement('button');
      enviar.type = 'submit';
      enviar.className = 'opcion opcion--si';
      enviar.appendChild(document.createTextNode(t().nombreBoton));

      var error = document.createElement('p');
      error.className = 'campo__error';
      error.hidden = true;
      error.appendChild(document.createTextNode(t().nombreError));

      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var valor = input.value.trim();
        if (!valor) { error.hidden = false; input.focus(); return; }
        estado.nombre = valor;
        estado.paso = 'listo';
        render();
      });

      form.appendChild(input);
      form.appendChild(enviar);
      opciones.appendChild(form);
      opciones.appendChild(error);

      window.setTimeout(function () { input.focus(); }, 60);
    },

    listo: function (pregunta, opciones) {
      pregunta.appendChild(document.createTextNode(t().pListo));

      /* El link se construye hasta aquí, cuando ya existe de verdad.
         Nunca un botón con href="#" esperando a llenarse. */
      var url = 'https://wa.me/' + estado.sucursal.tel +
                '?text=' + encodeURIComponent(mensaje());

      var enlace = document.createElement('a');
      enlace.className = 'opcion opcion--whats';
      enlace.href = url;
      enlace.target = '_blank';
      enlace.rel = 'noopener';
      enlace.appendChild(document.createTextNode(t().enviar));

      var aviso = document.createElement('p');
      aviso.className = 'ventanilla__nota';
      aviso.appendChild(document.createTextNode(t().aviso));

      opciones.appendChild(enlace);
      opciones.appendChild(aviso);
      opciones.appendChild(boton(t().empezarDeNuevo, reiniciar, 'opcion--texto'));
    }
  };

  /* ---------------- mensaje de WhatsApp (siempre en español) ---------------- */

  function mensaje() {
    var lineas = [];
    lineas.push('*NUEVO PEDIDO — EL DOGO DEL BARRIO*');
    lineas.push('');
    lineas.push('Recoge en: ' + estado.sucursal.nombre);
    lineas.push('Nombre: ' + estado.nombre);
    lineas.push('');

    estado.carrito.forEach(function (linea) {
      lineas.push('• ' + linea.nombre + ' — ' + dinero(linea.precio));
      if (linea.combo) {
        lineas.push('   + Combo: ' + DOGO.combo.desc.es + ' — ' + dinero(DOGO.combo.precio));
      }
    });

    lineas.push('');
    lineas.push('*TOTAL: ' + dinero(total()) + '*');
    return lineas.join('\n');
  }

  /* ---------------- comanda ---------------- */

  function renderComanda() {
    limpiar(el.comanda);
    if (estado.carrito.length === 0 && !estado.sucursal) { el.comanda.hidden = true; return; }
    el.comanda.hidden = false;

    var titulo = document.createElement('h2');
    titulo.className = 'comanda__titulo';
    titulo.appendChild(document.createTextNode(t().comanda));
    el.comanda.appendChild(titulo);

    if (estado.sucursal) {
      var suc = document.createElement('p');
      suc.className = 'comanda__sucursal';
      suc.appendChild(document.createTextNode(t().recogeEn + ': ' + estado.sucursal.nombre));
      el.comanda.appendChild(suc);
    }

    if (estado.carrito.length === 0) {
      var vacio = document.createElement('p');
      vacio.className = 'comanda__vacio';
      vacio.appendChild(document.createTextNode(t().vacio));
      el.comanda.appendChild(vacio);
      return;
    }

    var lista = document.createElement('ul');
    lista.className = 'comanda__lista';

    estado.carrito.forEach(function (linea, i) {
      var li = document.createElement('li');
      li.className = 'comanda__linea';

      var texto = document.createElement('span');
      texto.className = 'comanda__texto';
      texto.appendChild(document.createTextNode(linea.nombre));
      if (linea.combo) {
        var tag = document.createElement('span');
        tag.className = 'comanda__combo';
        tag.appendChild(document.createTextNode(t().comboEtiqueta));
        texto.appendChild(tag);
      }

      var precio = document.createElement('span');
      precio.className = 'comanda__precio';
      precio.appendChild(document.createTextNode(
        dinero(linea.precio + (linea.combo ? DOGO.combo.precio : 0))
      ));

      var borrar = document.createElement('button');
      borrar.type = 'button';
      borrar.className = 'comanda__quitar';
      borrar.setAttribute('aria-label', t().quitar + ': ' + linea.nombre);
      borrar.appendChild(document.createTextNode('×'));
      borrar.addEventListener('click', function () { quitar(i); });

      li.appendChild(texto);
      li.appendChild(precio);
      li.appendChild(borrar);
      lista.appendChild(li);
    });

    el.comanda.appendChild(lista);

    var pie = document.createElement('p');
    pie.className = 'comanda__total';

    var etiqueta = document.createElement('span');
    etiqueta.appendChild(document.createTextNode(t().total));
    var cifra = document.createElement('strong');
    cifra.appendChild(document.createTextNode(dinero(total())));

    pie.appendChild(etiqueta);
    pie.appendChild(cifra);
    el.comanda.appendChild(pie);
  }

  /* ---------------- render ---------------- */

  function render() {
    limpiar(el.pregunta);
    limpiar(el.opciones);

    var nota = el.ventanilla.querySelector('.ventanilla__nota');
    while (nota) { nota.parentNode.removeChild(nota); nota = el.ventanilla.querySelector('.ventanilla__nota'); }

    el.opciones.className = 'ventanilla__opciones';
    pasos[estado.paso](el.pregunta, el.opciones);
    renderComanda();
  }

  function reiniciar() {
    estado.sucursal = null;
    estado.carrito = [];
    estado.nombre = '';
    estado.pendiente = null;
    estado.paso = 'sucursal';
    render();
  }

  /* ---------------- idioma ---------------- */

  function cambiarIdioma(nuevo) {
    estado.idioma = nuevo;
    document.documentElement.lang = nuevo;
    document.dispatchEvent(new CustomEvent('dogo:idioma', { detail: nuevo }));
    render();
  }

  /* ---------------- arranque ---------------- */

  function iniciar() {
    el.ventanilla = document.getElementById('ventanilla');
    el.pregunta = document.getElementById('bot-pregunta');
    el.opciones = document.getElementById('bot-opciones');
    el.comanda = document.getElementById('bot-comanda');
    if (!el.ventanilla) { return; }

    var navegador = (navigator.language || 'es').slice(0, 2).toLowerCase();
    estado.idioma = navegador === 'en' ? 'en' : 'es';
    document.documentElement.lang = estado.idioma;

    DOGO.idioma = function () { return estado.idioma; };
    DOGO.cambiarIdioma = cambiarIdioma;

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
