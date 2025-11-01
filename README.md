# AppLisS-GSheets v3.9.0 — Liss Variedades 🛍️

Un panel de gestión de pedidos, clientes y finanzas desarrollado en JavaScript puro, HTML y CSS, utilizando **Google Sheets** como base de datos a través de la API de SheetDB.

## 🌟 Características Destacadas (v3.9.0)

* **PWA (NUEVO):** Aplicación Web Progresiva. Instalable en dispositivos móviles y de escritorio, con capacidad de **funcionar offline**.
* **Actualización de Estado:** Se implementó el **Botón de Actualizar Estado** en el listado de pedidos para cambiar el campo `estado` (vía PUT).
* **Seguimiento Rápido:** El Tracking es un **enlace directo a 17TRACK en idioma español**.
* **Seguridad:** El Endpoint de la API fue **ocultado** de la interfaz de usuario.
* **Experiencia de Carga:** Nueva animación de carga temática con secuencia de mensajes y emojis.

---

## 🛠️ Configuración Técnica

### 1. Endpoint de la API

La aplicación utiliza el siguiente Endpoint de SheetDB para todas las operaciones (lectura, inserción, actualización). Este Endpoint está codificado internamente en `assets/js/app.js` y **no es visible en el panel**.

**⚠️ Importante:** Para que la actualización funcione, la Hoja de Cálculo debe ser accesible para peticiones PUT/PATCH mediante SheetDB.

### 2. Estructura de Columnas (Google Sheets)

Es **crítico** que la primera fila de tu Hoja de Cálculo de Google (la cabecera) contenga los siguientes nombres de columna **exactamente** en cualquier orden, ya que la aplicación los utiliza para el filtrado, vinculación y cálculos:

| Columna | Tipo de Dato | Usado por | Detalle Funcional |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Todos | Identificador único de cada fila. **CRÍTICO para la función de Actualizar Estado.** |
| **`tipo`** | Texto | Todos | **CRÍTICO:** Determina el tipo de registro (`cliente`, `pedido`, `pago`, `retiro`). |
| `nombre`, `telefono`, `email`, `notas` | Texto | `cliente` | Datos personales y de contacto del cliente. |
| `cliente_id` | Texto | `pedido`, `pago` | Enlaza una transacción a un cliente específico. |
| **`articulo`** | Texto | `pedido` | Nombre del producto vendido. |
| **`valor`** | Número | `pedido` | **Costo del producto / Capital Invertido.** Usado para calcular el **Capital del Mes**. |
| **`porc`** | Número | `pedido` | Porcentaje de Ganancia. |
| **`libra`** | Número | `pedido` | Ganancia fija o costo de envío/libra. |
| `total` | Número | `pedido` | El valor total final pagado por el cliente. |
| `estado`, `tracking` | Texto | `pedido` | Seguimiento y estado de la entrega. (`tracking` es el número usado para 17TRACK) |
| **`fecha`** | Texto/Fecha | Todos | Fecha de creación. **CRÍTICO** para el filtro "del Mes". |
| `pedido_id`, `abono` | Texto, Número | `pago` | Enlaza a un pedido específico, monto del abono. |
| `factura` | Texto | `pedido`, `pago` | Código de factura generado automáticamente por el sistema. |
| **`monto`** | Número | `retiro` | **Monto del retiro/depósito.** Se guarda en **negativo** para retiros de capital. |

---

## 📦 Flujo de Datos y Despliegue

### Flujo de Despliegue
1.  Asegura que la nueva estructura de archivos (incluyendo `manifest.json` y `service-worker.js` en la raíz) esté completa.
2.  Sube todos los archivos a un servicio de hosting estático (como **GitHub Pages**).
3.  Configura **GitHub Pages** en `Settings` → `Pages` → `Source` → `main` / `root`.
4.  La aplicación se cargará y, si tu navegador es compatible, te ofrecerá la opción de **Instalar AppLisS** en tu dispositivo.
