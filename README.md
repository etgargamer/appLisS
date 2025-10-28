# 📋 AppLisS-GSheets

Aplicación web para gestionar **clientes, pedidos y abonos** usando **Google Sheets** como base de datos en la nube (vía [SheetDB.io](https://sheetdb.io)) y desplegada en **GitHub Pages**.

---

## 🚀 Cómo desplegar (Español)

1. Crea un repositorio en GitHub con el nombre `AppLisS-GSheets`.
2. Sube todos los archivos de este proyecto.
3. Entra en `Settings → Pages → Source` y selecciona `main` y `/root`.
4. Espera unos segundos y tu app estará disponible en:
   `https://tuusuario.github.io/AppLisS-GSheets/`
5. Abre `index.html` y revisa el bloque de configuración:
   ```js
   const API_URL = "https://sheetdb.io/api/v1/TU_ENDPOINT";
   ```
   Sustituye `TU_ENDPOINT` por tu enlace real de SheetDB (ejemplo: `https://sheetdb.io/api/v1/avsi1ki6gcrlr`).

---

## 📊 Estructura de la hoja de Google Sheets

Tu hoja debe tener **estas columnas exactas** (en el mismo orden):

```
id | tipo | nombre | telefono | email | notas | cliente_id | articulo | valor | porc | libra | total | estado | tracking | fecha | pedido_id | abono
```

- `tipo`: `"cliente"`, `"pedido"`, o `"pago"`
- `cliente_id`: referencia al cliente (en pedidos o pagos)
- `pedido_id`: referencia al pedido (solo en pagos)
- `abono`: monto del pago o abono
- `fecha`: se genera automáticamente en formato local

---

## 🧩 Cómo funciona

- **Clientes:** Se guardan con `tipo=cliente`
- **Pedidos:** Se asocian a un cliente (`cliente_id`)
- **Pagos:** Se asocian a un pedido (`pedido_id`) e incluyen campo `abono`
- Todos los datos se sincronizan automáticamente desde y hacia Google Sheets.

---

## 💡 Consejos
- Si tu app será pública, evita publicar tu endpoint real. Usa variables o .env si expandes el proyecto.
- Puedes personalizar los colores y estilos en `assets/css/style.css`.
- Si agregas funciones nuevas, guárdalas en `assets/js/app.js`.

---

## 🌐 English Version

### Deploy Guide

1. Create a GitHub repository named `AppLisS-GSheets`.
2. Upload all files from this project.
3. Go to `Settings → Pages → Source → main branch → /root`.
4. Your app will be hosted at:
   `https://yourusername.github.io/AppLisS-GSheets/`
5. Edit the line in `index.html`:
   ```js
   const API_URL = "https://sheetdb.io/api/v1/YOUR_ENDPOINT";
   ```
   Replace it with your actual endpoint.

### Google Sheet Columns
```
id | tipo | nombre | telefono | email | notas | cliente_id | articulo | valor | porc | libra | total | estado | tracking | fecha | pedido_id | abono
```

- `tipo`: identifies row type (`cliente`, `pedido`, `pago`)
- `cliente_id`: links a pedido/pago to its client
- `pedido_id`: links a pago to its order
- `abono`: payment amount
- `fecha`: generated automatically

---

### Notes
- All users share the same database (SheetDB + Google Sheets).
- Perfect for small business use, collaborative sales tracking, or simple CRMs.
- You can modify styles in `assets/css/style.css`.
