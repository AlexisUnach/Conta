// balanzaComprobacion.js

// Función para actualizar la Balanza de Comprobación
function actualizarBalanzaComprobacion() {
    const balanzaTable = document.getElementById("balanza-table");
    balanzaTable.innerHTML = "";

    // Determinar el rango de fechas
    let fechas = operaciones.map(op => new Date(op.fecha));
    let fechaInicio = fechas.length > 0 ? new Date(Math.min(...fechas)) : new Date();
    let fechaFin = fechas.length > 0 ? new Date(Math.max(...fechas)) : new Date();
    let rangoFechas = `${fechaInicio.toLocaleDateString('es-MX')} al ${fechaFin.toLocaleDateString('es-MX')}`;

    // Crear un objeto para almacenar los movimientos y saldos por cuenta
    const cuentas = {};

    // Recorrer todas las operaciones y acumular movimientos
    operaciones.forEach(op => {
        op.cuentas.forEach(cuenta => {
            if (!cuentas[cuenta.cuenta]) {
                cuentas[cuenta.cuenta] = { debe: 0, haber: 0 };
            }
            cuentas[cuenta.cuenta].debe += cuenta.debe;
            cuentas[cuenta.cuenta].haber += cuenta.haber;
        });
    });

    // Calcular saldos (SD o SA) para cada cuenta
    const cuentasConSaldos = {};
    for (let cuenta in cuentas) {
        const totalDebe = cuentas[cuenta].debe;
        const totalHaber = cuentas[cuenta].haber;
        let saldoDebe = 0;
        let saldoHaber = 0;

        if (totalDebe > totalHaber) {
            saldoDebe = totalDebe - totalHaber;
        } else {
            saldoHaber = totalHaber - totalDebe;
        }

        cuentasConSaldos[cuenta] = {
            debe: totalDebe,
            haber: totalHaber,
            saldoDebe: saldoDebe,
            saldoHaber: saldoHaber
        };
    }

    // Definir la clasificación de las cuentas
    const clasificacion = {
        "Caja": "AC",
        "Inventarios": "AC",
        "Papelería y Útiles": "AC",
        "Terrenos": "ANC",
        "Edificios": "ANC",
        "Muebles": "ANC",
        "Maquinaria": "ANC",
        "Capital": "PCP",
        "IVA Acreditado": "AC",
        "IVA por Acreditar": "PCP",
        "Proveedores": "PCP",
        "Acreedores": "PCP",
        "Rentas Pagadas por Anticipado": "AC",
        "Anticipo Clientes": "PCP",
        "IVA Trasladado": "PCP"
    };

    // Agrupar cuentas por tipo
    const activoCirculante = [];
    const activoNoCirculante = [];
    const pasivoCapital = [];

    for (let cuenta in cuentasConSaldos) {
        const tipo = clasificacion[cuenta] || "PCP";
        const datos = { nombre: cuenta, ...cuentasConSaldos[cuenta] };
        if (tipo === "AC") {
            activoCirculante.push(datos);
        } else if (tipo === "ANC") {
            activoNoCirculante.push(datos);
        } else {
            pasivoCapital.push(datos);
        }
    }

    // Combinar todas las cuentas en un solo arreglo ordenado
    const todasCuentas = [...activoCirculante, ...activoNoCirculante, ...pasivoCapital];

    // Crear la tabla de la Balanza de Comprobación
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th rowspan="2">Cuenta</th>
            <th colspan="2">Movimientos</th>
            <th colspan="2">Saldos</th>
        </tr>
        <tr>
            <th>Debe</th>
            <th>Haber</th>
            <th>Debe</th>
            <th>Haber</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    // Función para formatear montos: si es 0, dejar vacío
    function formatearMonto(monto) {
        return monto === 0 ? "" : `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    }

    // Agregar todas las cuentas sin separadores de grupo
    todasCuentas.forEach(cuenta => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cuenta.nombre}</td>
            <td>${formatearMonto(cuenta.debe)}</td>
            <td>${formatearMonto(cuenta.haber)}</td>
            <td>${formatearMonto(cuenta.saldoDebe)}</td>
            <td>${formatearMonto(cuenta.saldoHaber)}</td>
        `;
        tbody.appendChild(row);
    });

    // Calcular totales generales
    const totalMovDebe = Object.values(cuentasConSaldos).reduce((sum, cuenta) => sum + cuenta.debe, 0);
    const totalMovHaber = Object.values(cuentasConSaldos).reduce((sum, cuenta) => sum + cuenta.haber, 0);
    const totalSaldoDebe = Object.values(cuentasConSaldos).reduce((sum, cuenta) => sum + cuenta.saldoDebe, 0);
    const totalSaldoHaber = Object.values(cuentasConSaldos).reduce((sum, cuenta) => sum + cuenta.saldoHaber, 0);

    // Fila de totales
    const totalRow = document.createElement("tr");
    totalRow.className = "total-row";
    totalRow.innerHTML = `
        <td>Totales</td>
        <td>${formatearMonto(totalMovDebe)}</td>
        <td>${formatearMonto(totalMovHaber)}</td>
        <td>${formatearMonto(totalSaldoDebe)}</td>
        <td>${formatearMonto(totalSaldoHaber)}</td>
    `;
    tbody.appendChild(totalRow);

    table.appendChild(tbody);
    balanzaTable.appendChild(table);

    // Actualizar el título con el rango de fechas
    document.querySelector(".balanza-title").textContent = `La Taquería S.A. de C.V.\nBalanza de comprobación del ${rangoFechas}`;
}

// Actualizar la Balanza de Comprobación al abrir la pestaña
document.addEventListener("DOMContentLoaded", function() {
    actualizarBalanzaComprobacion();
});