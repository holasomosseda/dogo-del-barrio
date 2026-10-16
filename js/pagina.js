/* =========================================================
   EL DOGO DEL BARRIO — armado de la página
   ---------------------------------------------------------
   Dibuja el menú de abajo leyendo de menu.js (la misma fuente
   que usa el bot) y maneja el cambio de idioma ES/EN.

   Nada de precios escritos a mano en el HTML: todo sale de
   menu.js, para que no se puedan desincronizar.
   ========================================================= */

(function () {
  'use strict';

  function t() { return DOGO.textos[DOGO.idioma ? DOGO.idioma() : 'es']; }
  function idioma() { return DOGO.idioma ? DOGO.idioma() : 'es'; }
  function dinero(n) { return '$' + n; }

  function limpiar(nodo) {
    while (nodo.firstChild) { nodo.removeChild(nodo.firstChild); }
  }

  /* ---------- textos estáticos marcados con data-txt ---------- */

  function pintarTextos() {
    var textos = t();
    var nodos = document.querySelectorAll('[data-txt]');
    Array.prototype.forEach.call(nodos, function (nodo) {
      var clave = nodo.getAttribute('data-txt');
      if (textos[clave] === undefined) { return; }
      limpiar(nodo);
      nodo.appendChild(document.createTextNode(textos[clave]));
    });
  }

  /* ---------- una fila del menú ---------- */

  function platillo(item) {
    var li = document.createElement('li');
    li.className = 'platillo';

    var cabeza = document.createElement('div');
    cabeza.className = 'platillo__cabeza';

    var nombre = document.createElement('h3');
    nombre.className = 'platillo__nombre';
    nombre.appendChild(document.createTextNode(item.nombre));

    var precio = document.createElement('span');
    precio.className = 'platillo__precio';
    precio.appendChild(document.createTextNode(dinero(item.precio)));

    cabeza.appendChild(nombre);
    cabeza.appendChild(precio);

    var desc = document.createElement('p');
    desc.className = 'platillo__desc';
    desc.appendChild(document.createTextNode(item.desc[idioma()]));

    li.appendChild(cabeza);
    li.appendChild(desc);
    return li;
  }

  function pintarLista(id, datos) {
    var ul = document.getElementById(id);
    if (!ul) { return; }
    limpiar(ul);
    datos.forEach(function (item) { ul.appendChild(platillo(item)); });
  }

  function pintarCombo() {
    var precio = document.getElementById('combo-precio');
    var desc = document.getElementById('combo-desc');
    if (precio) { limpiar(precio); precio.appendChild(document.createTextNode('+' + dinero(DOGO.combo.precio))); }
    if (desc) { limpiar(desc); desc.appendChild(document.createTextNode(DOGO.combo.desc[idioma()])); }
  }

  function pintarMenu() {
    pintarLista('lista-perros', DOGO.perros);
    pintarLista('lista-papas', DOGO.papas);
    pintarLista('lista-bebidas', DOGO.bebidas);
    pintarCombo();
  }

  function pintarTodo() {
    pintarTextos();
    pintarMenu();
  }

  /* ---------- arranque ---------- */

  function iniciar() {
    pintarTodo();

    var boton = document.getElementById('idioma');
    if (boton) {
      boton.addEventListener('click', function () {
        DOGO.cambiarIdioma(idioma() === 'es' ? 'en' : 'es');
      });
    }

    document.addEventListener('dogo:idioma', pintarTodo);
  }

  /* bot.js define DOGO.idioma al arrancar, así que vamos después */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
