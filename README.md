# AppLisS-GSheets v3.9

Front-end ligero para gestionar compras por encargo (TEMU u otros) conectado a **Google Sheets vía SheetDB**.

## ✨ Novedades de la v3.9
- Pestañas **Pendientes** y **Completados** (se actualiza a *COMPLETADO* automáticamente cuando `restante <= 0`).
- **Factura por WhatsApp** con formato limpio, emojis y saltos de línea; usa *Liss Variedades 🛍️* y abre wa.me con el número del cliente.
- **Vista previa** y botón **Copiar** de la factura.
- **Registrar pago**: suma al campo `pagado`. Si el pago completa el total, cambia `status` a `COMPLETADO`.
- **Búsqueda** rápida (cliente, artículo o tracking).
- **Nuevo/Editar** pedido con cálculo instantáneo de total (`valor + % + libra`).
- UI moderna, responsiva y con *toasts*.
- Solo favicon en cabecera, fondo blanco, estilo limpio.

## 🗂️ Estructura
```
AppLisS-GSheets-v3.9/
├─ index.html
├─ app.js
├─ styles.css
├─ config.json
└─ README.md
```

## 🧩 Configuración
Edita `config.json`:
```json
{
  "SHEETDB_URL": "https://sheetdb.io/api/v1/avsi1ki6gcrlr",
  "SHEET_NAME": "AppLisS",
  "BRAND_NAME": "Liss Variedades 🛍️",
  "WHATSAPP_DEFAULT_CC": "1",
  "CURRENCY": "RD$",
  "THEME": {"primary": "#0f172a", "accent": "#22c55e"}
}
```

> 🔐 Debes tener una hoja en Google Sheets sincronizada con SheetDB (mapeo 1:1).

### Campos recomendados (hoja “AppLisS”)
- `id` (texto) — generado por el front (timestamp)
- `fecha` (ISO)
- `cliente`
- `telefono`
- `articulo`
- `valor` (número)
- `porcentaje` (número)
- `libra` (número)
- `pagado` (número)
- `tracking`
- `status` (PENDIENTE | COMPLETADO)

## 🔌 Endpoints usados (SheetDB)
- Listar: `GET  https://sheetdb.io/api/v1/avsi1ki6gcrlr?sheet=AppLisS`
- Crear:  `POST https://sheetdb.io/api/v1/avsi1ki6gcrlr?sheet=AppLisS`  con `{ "data": [{...}] }`
- Actualizar por `id`: `PATCH https://sheetdb.io/api/v1/avsi1ki6gcrlr/search?sheet=AppLisS&id={ID}` con `{ "data":[ {patch} ] }`

> ⚠️ Asegúrate de que la columna `id` exista y coincida para permitir actualizaciones.

## ▶️ Uso
1. Sube la carpeta a un hosting estático (o abre `index.html` desde un navegador con CORS permitido para tu dominio de SheetDB).
2. Presiona **+ Nuevo** para crear un pedido.
3. En cada tarjeta:
   - **Vista previa**: abre modal con los datos.
   - **Registrar pago**: suma el monto; si completa, pasa a *Completados*.
   - **Editar**: vuelve a abrir el formulario.
   - **Factura WhatsApp**: abre wa.me con el mensaje listo.
4. Usa **Buscar** para filtrar por cliente, artículo o tracking.

## 🧪 Tips
- El front no borra registros; solo actualiza `status` y montos.
- Cambia el símbolo de moneda en `config.json` (`"CURRENCY": "RD$"`).
- Si tus números tienen coma como separador decimal en la hoja, normalízalos como número en SheetDB.

---

© 2025 AppLisS.
