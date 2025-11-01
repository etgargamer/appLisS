# CHANGELOG

### v3.9.1
- **NUEVA SECCIÓN:** Se agregó la sección **Historial de Retiros del Mes** al Dashboard, mostrando el monto (con indicador de Retiro/Depósito) y la nota de la transacción.
- **Integración PWA:** Se actualizó la versión de caché del Service Worker a v3.9.1.

### v3.8.8
- **NUEVA FUNCIÓN CRÍTICA:** Se implementó la opción **Actualizar Estado** en el listado de pedidos, permitiendo modificar el campo `estado` (`pendiente`, `enviado`, `entregado`, etc.) de cualquier fila de pedido vía PUT a la API.
- **Seguimiento Rápido:** Implementado enlace directo a **17TRACK en idioma español** en el modal de Vista Previa.
- **Seguridad:** El Endpoint de la API fue **ocultado** de la interfaz de usuario.
- **Experiencia de Usuario:** Implementada animación de carga con secuencia de mensajes y emojis (Splash Temático).
- **Lógica de Cálculo:** Lógica de filtro de fecha ajustada a V3.8.3 para máxima compatibilidad con el formato de fecha de Google Sheets.

### v3.8.4
- **Mejora de Cálculo Crítica:** Se actualizó la función de cálculo mensual (`computeMonthly`) para realizar una **resta directa** del Capital Vendido con los Retiros, manteniendo las Ganancias Estimadas intactas.
- **Endpoint Final:** Se actualizó el Endpoint de la API a https://sheetdb.io/api/v1/eqc6hhxxgfh00.

### v3.8.0
- **Ajuste de Cálculo de Ganancias:** Las Ganancias Estimadas ahora solo suman los componentes de beneficio (`Valor × % / 100 + Libra`).
- **Control de Capital:** Agregado un formulario en el Dashboard para registrar **Retiros** (`tipo=retiro`).
- El **Capital del Mes** ahora resta el total de los retiros registrados.
- Nueva columna `monto` para registrar el valor de los retiros (se guarda en negativo en la BD).

### v3.7.1
- Nueva tarjeta **💼 Estado Financiero del Mes** (Dashboard).
- Capital = suma de `valor` del mes actual.
- Ganancias = suma de `valor × (libra/100)` del mes actual.
- Formato RD$ y animación de contador.
