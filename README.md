# AppLisS-GSheets — Panel Moderno (Auto claro/oscuro)

Control de **clientes, pedidos y abonos** usando **Google Sheets + SheetDB**, con panel lateral moderno y **pantalla de bienvenida de 3 s**.

## Despliegue rápido (GitHub Pages)
1. Sube este proyecto a un repositorio público.
2. Ve a **Settings → Pages → Source** y selecciona **main / root**.
3. Abre la URL que te da GitHub Pages.

## Conectar con tu base
En `assets/js/app.js`, busca esta línea y colócala con tu endpoint de SheetDB:

```js
const API_URL = "https://sheetdb.io/api/v1/avsi1ki6gcrlr";
```

## Estructura de columnas (Google Sheets)
Coloca estos encabezados en la primera fila de tu hoja:

```
id | tipo | nombre | telefono | email | notas | cliente_id | articulo | valor | porc | libra | total | estado | tracking | fecha | pedido_id | abono
```

- `tipo`: `cliente` | `pedido` | `pago`
- `cliente_id`: referencia del cliente (en pedidos y pagos)
- `pedido_id`: referencia del pedido (en pagos)
- `abono`: monto del pago
- `fecha`: se genera en formato local (es-DO)

## Temas
- **Automático**: claro/oscuro por `prefers-color-scheme`.
- Paleta corporativa: azul petróleo `#0f172a` y azul cielo `#38bdf8`.

## Créditos
Hecho con ❤️ por Liss Variedades.