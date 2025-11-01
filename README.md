# AppLisS-GSheets v3.8.5 — Liss Variedades 🛍️

Un panel de gestión de pedidos, clientes y finanzas desarrollado en JavaScript puro, HTML y CSS, utilizando **Google Sheets** como base de datos a través de la API de SheetDB.

## 🌟 Características Destacadas (v3.8.5)

* **Seguridad Mejorada:** El Endpoint de la API fue **ocultado** de la interfaz de usuario.
* **Experiencia de Carga:** Nueva animación de carga temática con secuencia de mensajes y emojis (ej: 📦 Desempacando la mercancía...).
* **Control de Capital:** Permite registrar **Retiros/Depósitos** (`tipo=retiro`) que afectan directamente el Capital disponible del mes.
* **Cálculos Financieros Precisos:**
    * **Capital del Mes:** Refleja el **Costo/Valor** de los artículos vendidos menos los retiros registrados.
    * **Ganancias Estimadas:** Refleja el **Beneficio puro** del mes (Suma del Porcentaje de Ganancia + Costo de la Libra).
* **Estabilidad de Datos:** La fecha de los nuevos registros se guarda en un formato robusto (DD/MM/AAAA HH:MI:SS) para asegurar la compatibilidad con el filtro mensual del Dashboard.
* **Funcionalidad Transaccional:** Facturación automática, registro rápido de abonos, y generación de mensajes de WhatsApp.

---

## 🛠️ Configuración y Despliegue

### 1. Endpoint de la API

La aplicación utiliza el siguiente Endpoint de SheetDB para todas las operaciones (lectura, inserción). Por razones de seguridad, este URL **no es visible en el panel**.

**⚠️ Importante:** Para mayor seguridad, configure restricciones de acceso (CORS) directamente en la configuración de su Endpoint en SheetDB.

### 2. Estructura de Columnas (Google Sheets)

Es **crítico** que la primera fila de tu Hoja de Cálculo de Google (la cabecera) contenga los siguientes nombres de columna **exactamente** en cualquier orden, ya que la aplicación los utiliza para el filtrado, vinculación y cálculos:

| Columna | Tipo de Dato | Usado por | Detalle Funcional |
| :--- | :--- | :--- | :--- |
| `id` | Texto | Todos | Identificador único de cada fila. |
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

## 📦 Flujo de Datos y Despliegue

### Flujo de Despliegue
1.  Asegura que tu estructura de archivos local (`index.html`, `assets/css/style.css`, `assets/js/app.js`) esté completa.
2.  Sube todos los archivos a un servicio de hosting estático (como **GitHub Pages**).
3.  Configura **GitHub Pages** en `Settings` → `Pages` → `Source` → `main` / `root`.
