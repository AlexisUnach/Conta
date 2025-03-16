// libroMayor.js

// Función para actualizar las cuentas T en el Libro Mayor
function actualizarCuentasT() {
    const cuentasTBody = document.getElementById("cuentas-t");
    cuentasTBody.innerHTML = "";

    // Crear un objeto para almacenar los movimientos por cuenta
    const cuentas = {};

    // Recorrer todas las operaciones y acumular movimientos
    operaciones.forEach(op => {
        op.cuentas.forEach(cuenta => {
            if (!cuentas[cuenta.cuenta]) {
                cuentas[cuenta.cuenta] = { debe: [], haber: [] };
            }
            if (cuenta.debe > 0) {
                cuentas[cuenta.cuenta].debe.push({ monto: cuenta.debe, operation: op.operationNumber });
            }
            if (cuenta.haber > 0) {
                cuentas[cuenta.cuenta].haber.push({ monto: cuenta.haber, operation: op.operationNumber });
            }
        });
    });

    // Mostrar cada cuenta en formato T
    for (let cuenta in cuentas) {
        const movimientosDebe = cuentas[cuenta].debe;
        const movimientosHaber = cuentas[cuenta].haber;

        // Calcular totales (MD y MA)
        const totalDebe = movimientosDebe.reduce((sum, mov) => sum + mov.monto, 0);
        const totalHaber = movimientosHaber.reduce((sum, mov) => sum + mov.monto, 0);

        // Calcular saldo (SD o SA)
        let saldo = 0;
        let saldoSide = "";
        if (totalDebe > totalHaber) {
            saldo = totalDebe - totalHaber;
            saldoSide = "SD";
        } else {
            saldo = totalHaber - totalDebe;
            saldoSide = "SA";
        }

        // Crear el contenedor de la cuenta T
        const cuentaDiv = document.createElement("div");
        cuentaDiv.className = "cuenta-t";

        // Título de la cuenta en la parte superior central
        const header = document.createElement("div");
        header.className = "cuenta-header";
        header.textContent = cuenta;
        cuentaDiv.appendChild(header);

        // Crear la tabla en formato T
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th colspan="2"></th>
                <th colspan="2"></th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        const maxRows = Math.max(movimientosDebe.length, movimientosHaber.length);
        for (let i = 0; i < maxRows; i++) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${movimientosDebe[i] ? movimientosDebe[i].operation : ""}</td>
                <td style="text-align: center;">${movimientosDebe[i] ? movimientosDebe[i].monto.toFixed(2) : ""}</td>
                <td style="text-align: center;">${movimientosHaber[i] ? movimientosHaber[i].monto.toFixed(2) : ""}</td>
                <td>${movimientosHaber[i] ? movimientosHaber[i].operation : ""}</td>
            `;
            tbody.appendChild(row);
        }
        table.appendChild(tbody);

        // Fila de totales (MD y MA)
        const totalRow = document.createElement("tr");
        totalRow.className = "total-row";
        totalRow.innerHTML = `
            <td>MD</td>
            <td style="text-align: center;">${totalDebe.toFixed(2)}</td>
            <td style="text-align: center;">${totalHaber.toFixed(2)}</td>
            <td>MA</td>
        `;
        tbody.appendChild(totalRow);

        // Fila de saldo (SD o SA)
        const saldoRow = document.createElement("tr");
        saldoRow.className = "saldo-row";
        saldoRow.innerHTML = `
            <td>${saldoSide === "SD" ? "SD" : ""}</td>
            <td style="text-align: center;">${saldoSide === "SD" ? saldo.toFixed(2) : ""}</td>
            <td style="text-align: center;">${saldoSide === "SA" ? saldo.toFixed(2) : ""}</td>
            <td>${saldoSide === "SA" ? "SA" : ""}</td>
        `;
        tbody.appendChild(saldoRow);

        cuentaDiv.appendChild(table);
        cuentasTBody.appendChild(cuentaDiv);
    }
}