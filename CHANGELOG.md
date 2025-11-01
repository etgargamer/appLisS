# CHANGELOG

### v3.8.7
- **Seguimiento Rápido:** Implementado enlace directo a **17TRACK en idioma español** en el modal de Vista Previa para verificar el Tracking del pedido.
- **Seguridad:** El Endpoint de la API (`API_URL`) fue **ocultado** de la interfaz de usuario.
- **Experiencia de Usuario:** Implementada animación de carga con secuencia de mensajes y emojis (Splash Temático).
- **Corrección de Código:** Lógica de filtro de fecha ajustada a V3.8.3 para máxima compatibilidad con el formato de fecha de Google Sheets.

### v3.8.4
- **Mejora de Cálculo Crítica:** Se actualizó la función de cálculo mensual (`computeMonthly`) para realizar una **resta directa** del Capital Vendido con los Retiros, manteniendo las Ganancias Estimadas intactas.
- **Endpoint Final:** Se actualizó el Endpoint de la API a https://sheetdb.io/api/v1/eqc6hhxxgfh00.

### v3.8.0
- **Ajuste de Cálculo de Ganancias:** Las Ganancias Estimadas ahora solo suman los componentes de beneficio (`Valor × % / 100 + Libra`).
- **Control de Capital:** Agregado un formulario en el Dashboard para registrar **Retiros** (`tipo=retiro`).
- El **Capital del Mes** ahora resta el total de los retiros registrados.
- Nueva columna `monto` para registrar el valor de los retiros (se guarda en negativo en la BD).
