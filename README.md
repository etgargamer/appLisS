# AppLisS-GSheets v3.9.1 — Liss Variedades 🛍️

Un panel de gestión de pedidos, clientes y finanzas desarrollado en JavaScript puro, HTML y CSS, utilizando **Google Sheets** como base de datos a través de la API de SheetDB.

## 🌟 Características Destacadas (v3.9.1)

* **Historial de Capital (NUEVO):** Se agregó una sección en el Dashboard para visualizar el historial de todos los movimientos de **Retiro/Depósito** del mes actual.
* **PWA:** Aplicación Web Progresiva, instalable en dispositivos, con capacidad de funcionamiento offline.
* **Actualización de Estado:** Se implementó el **Botón de Actualizar Estado** en el listado de pedidos para cambiar el campo `estado` (vía PUT).
* **Seguimiento Rápido:** El Tracking es un **enlace directo a 17TRACK en idioma español**.
* **Seguridad:** El Endpoint de la API fue **ocultado** de la interfaz de usuario.
* **Cálculos Financieros Precisos:**
    * **Capital del Mes:** Refleja el **Costo/Valor** de los artículos vendidos menos los retiros registrados.
    * **Ganancias Estimadas:** Refleja el **Beneficio puro** del mes (Suma del Porcentaje de Ganancia + Costo de la Libra).

---

## 🛠️ Configuración Técnica

### 1. Endpoint de la API

La aplicación utiliza el siguiente Endpoint de SheetDB para todas las operaciones (lectura, inserción, actualización). Este Endpoint está codificado internamente en `assets/js/app.js` y **no es visible en el panel**.

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
| `estado`, `tracking` | Texto | `pedido` | Seguimiento y estado de la entrega. |
| **`fecha`** | Texto/Fecha | Todos | Fecha de creación. **CRÍTICO** para el filtro "del Mes". |
| `pedido_id`, `abono` | Texto, Número | `pago` | Enlaza a un pedido específico, monto del abono. |
| `factura` | Texto | `pedido`, `pago` | Código de factura generado automáticamente por el sistema. |
| **`monto`** | Número | `retiro` | **Monto del retiro/depósito.** Se guarda en **negativo** para retiros de capital. |

---

## 6. `CHANGELOG.md` (Historial de Cambios - v3.9.1)

```markdown
# CHANGELOG

### v3.9.1
- **NUEVA SECCIÓN:** Se agregó la sección **Historial de Retiros del Mes** al Dashboard, mostrando el monto (con indicador de Retiro/Depósito) y la nota de la transacción.
- **Integración PWA:** Se agregó el `manifest.json` y se actualizó el `service-worker.js` para la versión v3.9.1 de caché.

### v3.8.8
- **NUEVA FUNCIÓN:** Se implementó la opción **Actualizar Estado** en el listado de pedidos (vía PUT a la API).
- **Seguimiento Rápido:** Implementado enlace directo a **17TRACK en idioma español** en el modal de Vista Previa.
- **Seguridad:** El Endpoint de la API fue **ocultado** de la interfaz de usuario.
- **Experiencia de Usuario:** Implementada animación de carga con secuencia de mensajes y emojis (Splash Temático).
