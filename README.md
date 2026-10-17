# El Dogo del Barrio — web con bot de pedidos

Sitio de una página: el perrito atiende, arma el pedido y lo manda al
WhatsApp de la sucursal. Menú completo abajo. Español e inglés.

HTML, CSS y JavaScript planos. **Sin build step**: Cloudflare Pages
publica los archivos tal cual.

---

## Cómo cambiar las cosas que se cambian seguido

Casi todo vive en **`js/menu.js`**. Es la fuente única: el menú que se ve
en la página y el bot leen del mismo archivo, así que un precio no se
puede desincronizar entre los dos.

### Cambiar un precio

Busca el platillo y edita el número de `precio`. Sin `$`, sin comas.

```js
{ id: 'pastor', nombre: 'Pastor Alemán', precio: 125, ... }
```

### Agregar un perro nuevo

Copia un bloque completo, pégalo al final de la lista `DOGO.perros` y
cámbiale `id` (único, sin espacios), `nombre`, `precio` y las dos
descripciones.

### Cambiar un número de WhatsApp

En `DOGO.sucursales`. El formato es internacional, **sin `+`, sin
espacios y sin guiones**. México es `52` + 10 dígitos.

```js
{ id: 'suc1', nombre: 'Sucursal 1', tel: '525545883123' }
```

### Agregar una sucursal

Agrega otro bloque a `DOGO.sucursales`. El bot genera los botones solo;
no hay que tocar nada más.

---

## Los archivos

```
index.html          estructura de la página
css/estilos.css     todo el diseño
js/menu.js          DATOS: platillos, precios, sucursales, textos ES/EN
js/bot.js           el asistente: la conversación y el mensaje de WhatsApp
js/pagina.js        dibuja el menú de abajo y el cambio de idioma
js/perrito.js       entrada y reacciones del perrito
video/dogo-loop.mp4 la animación (Kling), en boomerang para que cicle
video/poster.jpg    primer cuadro, se ve mientras carga el video
img/perrito.svg     el personaje en vector (respaldo, ya no se usa en el hero)
img/logo.png        el logo, con fondo transparente
fonts/              Anton y Barlow, alojadas aquí mismo
```

## Si algún día se cambia el video

El fondo de la página (`--fondo`, hoy `#EFECE6`) **no es un color de marca
elegido a ojo**: es el color exacto con el que el navegador pinta el fondo
del video del perrito, medido en pantalla. Están iguales a propósito, para
que el video no se vea como un recuadro pegado encima.

Si se cambia el video, hay que volver a medirlo y ajustar `--fondo`. Y no
sirve medir el archivo con ffmpeg: el navegador convierte el color del
video y lo corre un par de puntos. Hay que medirlo **en el navegador**,
sobre una captura de la página ya montada.

Por lo mismo la página no lleva textura de grano. Se veía bien, pero
oscurecía el fondo unos 6 puntos y el video no la lleva — ahí aparecía el
recuadro. Plano en los dos lados es lo único que empata sin pelearse.

---

## Decisiones que conviene no deshacer sin pensarlo

**El pedido a WhatsApp siempre va en español**, aunque el cliente esté
navegando en inglés. Quien lee ese mensaje es el que está parado en el
truck.

**Los nombres de los platillos no se traducen.** Son razas de perro y son
la marca; `Pastor Alemán` es un juego de palabras que en inglés se pierde.
Solo las descripciones tienen versión en inglés.

**Las fuentes están alojadas aquí**, no se piden a Google. Carga más
rápido en datos móviles y el sitio no depende de un tercero.

**El perrito no es un intro.** Es el que atiende: está presente y vivo
todo el rato que dura el pedido. Por eso se anima con CSS y no con video.

**`wa.me` no envía el mensaje**, solo abre WhatsApp con el pedido ya
escrito. El cliente le da enviar. Eso es a propósito: el pedido llega
como un mensaje normal de WhatsApp, no se queda atorado en la web.
