# AppLisS-GSheets v3.9.1 (look v3.7)

Interfaz *glassmorphism* con tema oscuro y splash animado, manteniendo las funciones nuevas de v3.9.

## Novedades
- 🎨 Estilo v3.7: fondo translúcido con blur, logo LV, botones redondeados, sombras suaves.
- 🌟 Splash de arranque ~2s con fade-out.
- 🗂️ Pestañas Pendientes / Completados (auto-mover cuando restante ≤ 0).
- 🧾 Factura WhatsApp con formato de marca *Liss Variedades 🛍️*.
- 🔎 Búsqueda en tiempo real; edición, vista previa y registro de pagos.
- 🔌 Backend: Google Sheets vía SheetDB.

## Configuración
Edita `config.json` con tu endpoint de SheetDB y símbolo de moneda.

## Campos recomendados (hoja “AppLisS”)
- id, fecha, cliente, telefono, articulo, valor, porcentaje, libra, pagado, tracking, status

## Endpoints
- GET  https://sheetdb.io/api/v1/avsi1ki6gcrlr?sheet=AppLisS
- POST https://sheetdb.io/api/v1/avsi1ki6gcrlr?sheet=AppLisS
- PATCH https://sheetdb.io/api/v1/avsi1ki6gcrlr/search?sheet=AppLisS&id={ID}

© 2025 AppLisS.
