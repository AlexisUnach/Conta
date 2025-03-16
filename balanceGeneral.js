// balanceGeneral.js

// Función para actualizar el Balance General
function actualizarBalanceGeneral() {
    const balanceTable = document.getElementById("balance-table");
    balanceTable.innerHTML = "";

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
            saldo: saldoDebe > 0 ? saldoDebe : saldoHaber,
            esDebe: saldoDebe > 0
        };
    }

    // Definir la clasificación de las cuentas (CORREGIDO: IVA por Acreditar a AC)
    const clasificacion = {
        "Caja": "AC",
        "Inventarios": "AC",
        "Mercancías/Inventarios/Almacén": "AC",
        "Papelería y Útiles": "AC",
        "Terrenos": "ANC",
        "Edificios": "ANC",
        "Muebles": "ANC",
        "Maquinaria": "ANC",
        "Herramientas": "ANC",
        "Capital": "PCP",
        "Capital Social": "PCP",
        "Utilidad del Ejercicio": "PCP",
        "IVA Acreditado": "AC",
        "IVA por Acreditar": "AC", // Corregido de "PCP" a "AC"
        "Proveedores": "PCP",
        "Acreedores": "PCP",
        "Rentas Pagadas por Anticipado": "AC",
        "Anticipo Clientes": "PCP",
        "IVA Trasladado": "PCP"
    };

    // Agrupar cuentas por tipo
    const activoCirculante = [];
    const activoNoCirculante = [];
    const pasivo = [];
    const capitalContable = [];

    for (let cuenta in cuentasConSaldos) {
        const tipo = clasificacion[cuenta] || "PCP";
        const datos = { nombre: cuenta, ...cuentasConSaldos[cuenta] };
        if (tipo === "AC") {
            activoCirculante.push(datos);
        } else if (tipo === "ANC") {
            activoNoCirculante.push(datos);
        } else if (tipo === "PCP") {
            if (["Capital", "Capital Social", "Utilidad del Ejercicio"].includes(cuenta)) {
                capitalContable.push(datos);
            } else {
                pasivo.push(datos);
            }
        }
    }

    // Función para formatear montos
    function formatearMonto(monto) {
        return monto === 0 ? "" : `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    }

    // Tabla 1: Activo (Circulante y No Circulante)
    const tableActivo = document.createElement("table");
    const theadActivo = document.createElement("thead");
    theadActivo.innerHTML = `
        <tr>
            <th colspan="2">Activo</th>
        </tr>
    `;
    tableActivo.appendChild(theadActivo);

    const tbodyActivo = document.createElement("tbody");

    // Activo Circulante
    if (activoCirculante.length > 0) {
        const acHeader = tbodyActivo.insertRow();
        acHeader.innerHTML = `<td colspan="2" class="group-header">Activo Circulante</td>`;
        activoCirculante.forEach(cuenta => {
            if (cuenta.saldo > 0) {
                const row = tbodyActivo.insertRow();
                row.innerHTML = `
                    <td class="cuenta">${cuenta.nombre}</td>
                    <td class="monto">${formatearMonto(cuenta.saldo)}</td>
                `;
            }
        });
    }

    // Activo No Circulante
    if (activoNoCirculante.length > 0) {
        const ancHeader = tbodyActivo.insertRow();
        ancHeader.innerHTML = `<td colspan="2" class="group-header">Activo No Circulante</td>`;
        activoNoCirculante.forEach(cuenta => {
            if (cuenta.saldo > 0) {
                const row = tbodyActivo.insertRow();
                row.innerHTML = `
                    <td class="cuenta">${cuenta.nombre}</td>
                    <td class="monto">${formatearMonto(cuenta.saldo)}</td>
                `;
            }
        });
    }

    // Total Activo
    const totalActivo = [...activoCirculante, ...activoNoCirculante].reduce((sum, cuenta) => sum + (cuenta.saldo || 0), 0);
    const totalActivoRow = tbodyActivo.insertRow();
    totalActivoRow.className = "total-row";
    totalActivoRow.innerHTML = `
        <td>Total Activo</td>
        <td>${formatearMonto(totalActivo)}</td>
    `;

    tableActivo.appendChild(tbodyActivo);
    balanceTable.appendChild(tableActivo);

    // Tabla 2: Pasivo
    const tablePasivo = document.createElement("table");
    const theadPasivo = document.createElement("thead");
    theadPasivo.innerHTML = `
        <tr>
            <th colspan="2">Pasivo</th>
        </tr>
    `;
    tablePasivo.appendChild(theadPasivo);

    const tbodyPasivo = document.createElement("tbody");

    // Pasivo
    if (pasivo.length > 0) {
        const pasivoHeader = tbodyPasivo.insertRow();
        pasivoHeader.innerHTML = `<td colspan="2" class="group-header">Pasivo</td>`;
        pasivo.forEach(cuenta => {
            if (cuenta.saldo > 0) {
                const row = tbodyPasivo.insertRow();
                row.innerHTML = `
                    <td class="cuenta">${cuenta.nombre}</td>
                    <td class="monto">${formatearMonto(cuenta.saldo)}</td>
                `;
            }
        });
    } else {
        const noPasivoRow = tbodyPasivo.insertRow();
        noPasivoRow.innerHTML = `<td colspan="2" class="no-data">Sin cuentas de Pasivo</td>`;
    }

    // Total Pasivo
    const totalPasivo = pasivo.reduce((sum, cuenta) => sum + (cuenta.saldo || 0), 0);
    const totalPasivoRow = tbodyPasivo.insertRow();
    totalPasivoRow.className = "total-row";
    totalPasivoRow.innerHTML = `
        <td>Total Pasivo</td>
        <td>${formatearMonto(totalPasivo)}</td>
    `;

    tablePasivo.appendChild(tbodyPasivo);
    balanceTable.appendChild(tablePasivo);

    // Tabla 3: Capital Contable
    const tableCapital = document.createElement("table");
    const theadCapital = document.createElement("thead");
    theadCapital.innerHTML = `
        <tr>
            <th colspan="2">Capital Contable</th>
        </tr>
    `;
    tableCapital.appendChild(theadCapital);

    const tbodyCapital = document.createElement("tbody");

    // Capital Contable
    if (capitalContable.length > 0) {
        const capitalHeader = tbodyCapital.insertRow();
        capitalHeader.innerHTML = `<td colspan="2" class="group-header">Capital Contable</td>`;
        capitalContable.forEach(cuenta => {
            if (cuenta.saldo > 0) {
                const row = tbodyCapital.insertRow();
                row.innerHTML = `
                    <td class="cuenta">${cuenta.nombre}</td>
                    <td class="monto">${formatearMonto(cuenta.saldo)}</td>
                `;
            }
        });
    } else {
        const noCapitalRow = tbodyCapital.insertRow();
        noCapitalRow.innerHTML = `<td colspan="2" class="no-data">Sin cuentas de Capital Contable</td>`;
    }

    // Total Capital Contable
    const totalCapital = capitalContable.reduce((sum, cuenta) => sum + (cuenta.saldo || 0), 0);
    const totalCapitalRow = tbodyCapital.insertRow();
    totalCapitalRow.className = "total-row";
    totalCapitalRow.innerHTML = `
        <td>Total Capital</td>
        <td>${formatearMonto(totalCapital)}</td>
    `;

    tableCapital.appendChild(tbodyCapital);
    balanceTable.appendChild(tableCapital);

    // Cuadro final: Total Pasivo + Capital
    const totalPasivoCapital = totalPasivo + totalCapital;
    const totalPasivoCapitalDiv = document.createElement("div");
    totalPasivoCapitalDiv.className = "total-pasivo-capital";
    totalPasivoCapitalDiv.innerHTML = `Total Pasivo + Capital: ${formatearMonto(totalPasivoCapital)}`;
    balanceTable.appendChild(totalPasivoCapitalDiv);

    // Actualizar el título con el rango de fechas
    document.querySelector(".balance-title").textContent = `Balance General\nLa Taquería S.A. de C.V. del ${rangoFechas}`;
}

// Actualizar el Balance General al abrir la pestaña
document.addEventListener("DOMContentLoaded", function() {
    actualizarBalanceGeneral();
});