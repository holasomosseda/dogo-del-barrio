/* =========================================================
   EL DOGO DEL BARRIO — el perrito
   ---------------------------------------------------------
   El perrito no es un intro que arranca y se acaba: es el
   que atiende. Está vivo todo el rato que dura el pedido.

   Tres capas de movimiento, separadas para que no se peleen:
     .perrito           → parallax (lo mueve el JS)
     .perrito__reaccion → el brinco al agregar algo (CSS)
     .perrito__img      → la respiración (CSS, en bucle)

   Todo se apaga solo si el sistema pide menos movimiento.
   Sin GSAP ni librerías: no hacen falta y pesan.
   ========================================================= */

(function () {
  'use strict';

  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  function iniciar() {
    var caja = document.getElementById('perrito-caja');
    var reaccion = document.getElementById('perrito-reaccion');
    if (!caja || !reaccion) { return; }

    /* ---- entrada: una sola vez, cuando ya cargó el dibujo ---- */
    var img = document.getElementById('perrito-img');
    function entrar() { caja.classList.add('perrito--entro'); }

    if (img && !img.complete) {
      img.addEventListener('load', entrar);
      img.addEventListener('error', entrar);   // si falla, igual destapamos el layout
    } else {
      entrar();
    }

    /* ---- reacción: brinca cuando agregas algo al pedido ---- */
    document.addEventListener('dogo:agregado', function () {
      if (menosMovimiento.matches) { return; }
      reaccion.classList.remove('perrito--brinca');
      void reaccion.offsetWidth;            // reinicia la animación
      reaccion.classList.add('perrito--brinca');
    });

    reaccion.addEventListener('animationend', function (ev) {
      if (ev.animationName === 'brinco') { reaccion.classList.remove('perrito--brinca'); }
    });

    /* ---- parallax: solo con mouse, y muy sutil ---- */
    var puntero = window.matchMedia('(hover: hover) and (pointer: fine)');
    var destinoX = 0, destinoY = 0, actualX = 0, actualY = 0, corriendo = false;

    function seguir(ev) {
      var mitadX = window.innerWidth / 2;
      var mitadY = window.innerHeight / 2;
      destinoX = ((ev.clientX - mitadX) / mitadX) * 14;   // px, tope
      destinoY = ((ev.clientY - mitadY) / mitadY) * 8;
      if (!corriendo) { corriendo = true; window.requestAnimationFrame(suavizar); }
    }

    function suavizar() {
      actualX += (destinoX - actualX) * 0.06;
      actualY += (destinoY - actualY) * 0.06;
      caja.style.setProperty('--desvio-x', actualX.toFixed(2) + 'px');
      caja.style.setProperty('--desvio-y', actualY.toFixed(2) + 'px');

      if (Math.abs(destinoX - actualX) > 0.1 || Math.abs(destinoY - actualY) > 0.1) {
        window.requestAnimationFrame(suavizar);
      } else {
        corriendo = false;
      }
    }

    function prenderParallax() {
      if (puntero.matches && !menosMovimiento.matches) {
        window.addEventListener('mousemove', seguir, { passive: true });
      } else {
        window.removeEventListener('mousemove', seguir);
        caja.style.setProperty('--desvio-x', '0px');
        caja.style.setProperty('--desvio-y', '0px');
      }
    }

    prenderParallax();
    if (menosMovimiento.addEventListener) {
      menosMovimiento.addEventListener('change', prenderParallax);
      puntero.addEventListener('change', prenderParallax);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
