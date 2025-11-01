# AppLisS-GSheets v3.8.8 — Liss Variedades 🛍️

Un panel de gestión de pedidos, clientes y finanzas desarrollado en JavaScript puro, HTML y CSS, utilizando **Google Sheets** como base de datos a través de la API de SheetDB.

## 🌟 Características Destacadas (v3.8.8)

* **Actualización de Estado (NUEVO):** Se agregó una opción de selección y un botón **"Actualizar Estado"** en el listado de pedidos para cambiar el estado (`pendiente`, `enviado`, `entregado`, etc.) de una fila específica.
* **Seguimiento Rápido:** El Tracking es un **enlace directo a 17TRACK en idioma español**.
* **Seguridad:** El Endpoint de la API fue **ocultado** de la interfaz de usuario.
* **Experiencia de Carga:** Nueva animación de carga temática con secuencia de mensajes y emojis.
* **Cálculos Financieros Precisos:**
    * **Capital del Mes:** Refleja el **Costo/Valor** de los artículos vendidos menos los retiros registrados.
    * **Ganancias Estimadas:** Refleja el **Beneficio puro** del mes (Suma del Porcentaje de Ganancia + Costo de la Libra).
* **Estabilidad de Datos:** La fecha de los nuevos registros se guarda en un formato robusto (DD/MM/AAAA HH:MI:SS) para asegurar la compatibilidad con el filtro mensual del Dashboard.

---

## 🛠️ Configuración Técnica

### 1. Endpoint de la API

La aplicación utiliza el siguiente Endpoint de SheetDB para todas las operaciones (lectura, inserción, **actualización**). Este Endpoint está codificado internamente en `assets/js/app.js` y **no es visible en el panel**.

**⚠️ Importante:** Para que la actualización funcione, la Hoja de Cálculo debe ser accesible para peticiones PUT/PATCH mediante SheetDB.

### 2. Estructura de Columnas (Google Sheets)

Es **crítico** que la primera fila de tu Hoja de Cálculo de Google (la cabecera) contenga los siguientes nombres de columna **exactamente** en cualquier orden, ya que la aplicación los utiliza para el filtrado, vinculación y cálculos:

| Columna | Tipo de Dato | Usado por | Detalle Funcional |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Todos | Identificador único de cada fila. **CRÍTICO para la función de Actualizar Estado (PUT/PATCH).** |
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

## 5. `CHANGELOG.md` (Historial de Cambios - v3.8.8)

*(Ubicación: Carpeta raíz)*

```markdown
# CHANGELOG

### v3.8.8
- **NUEVA FUNCIÓN:** Se implementó la opción **Actualizar Estado** en el listado de pedidos, permitiendo modificar el campo `estado` (`pendiente`, `enviado`, `entregado`, etc.) de cualquier fila de pedido vía PUT a la API.
- **Seguimiento Rápido:** Implementado enlace directo a **17TRACK en idioma español** en el modal de Vista Previa.

### v3.8.5
- **SEGURIDAD:** El Endpoint de la API (`API_URL`) fue **ocultado** de la interfaz de usuario.
- **Experiencia de Usuario:** Implementada animación de carga con secuencia de mensajes y emojis (Splash Temático).

### v3.8.4
- **Mejora de Cálculo Crítica:** Se actualizó la función de cálculo mensual (`computeMonthly`) para realizar una **resta directa** del Capital Vendido con los Retiros, manteniendo las Ganancias Estimadas intactas.
- **Corrección de Fecha:** Se implementó una función de formato de fecha personalizada (DD/MM/AAAA HH:MI:SS) en todos los registros para garantizar la compatibilidad con el filtro de mes actual.
- **Endpoint Final:** Se actualizó el Endpoint de la API a [https://sheetdb.io/api/v1/eqc6hhxxgfh00](https://sheetdb.io/api/v1/eqc6hhxxgfh00).
