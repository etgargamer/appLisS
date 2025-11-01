# CHANGELOG

### v3.8.4
- **Nuevo Splash Temático:** Implementada una animación de carga con secuencia de mensajes y emojis para mejorar la experiencia de usuario (v3.8.5).
- **Mejora de Cálculo Crítica:** Se actualizó la función de cálculo mensual (`computeMonthly`) para ignorar la lógica de sobregiro y realizar una **resta directa** del Capital Vendido con los Retiros, manteniendo las Ganancias Estimadas intactas.
- **Corrección de Fecha:** Se implementó una función de formato de fecha personalizada (DD/MM/AAAA HH:MI:SS) en todos los registros para garantizar la compatibilidad con el filtro mensual de Google Sheets.
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
