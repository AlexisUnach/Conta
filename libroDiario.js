// libroDiario.js

// Estado de la operación actual
let currentOperation = {
    fecha: "",
    descripcion: "",
    cuentas: []
};

// Lista de todas las operaciones registradas
let operaciones = [];

// Función para agregar una cuenta a la operación actual
function agregarCuenta() {
    const cuentaSelect = document.getElementById("cuenta-select").value;
    const debe = parseFloat(document.getElementById("debe").value) || 0;
    const haber = parseFloat(document.getElementById("haber").value) || 0;

    // Validaciones
    if (debe < 0 || haber < 0) {
        alert("Los valores de Debe y Haber no pueden ser negativos.");
        return;
    }

    if (debe === 0 && haber === 0) {
        alert("Debe ingresar un monto en Debe o Haber.");
        return;
    }

    // Agregar la cuenta a la operación actual
    currentOperation.cuentas.push({ cuenta: cuentaSelect, debe, haber });
    actualizarCuentasTable();
    document.getElementById("debe").value = "0.00";
    document.getElementById("haber").value = "0.00";
}

// Función para actualizar la tabla de cuentas de la operación actual
function actualizarCuentasTable() {
    const cuentasBody = document.getElementById("cuentas-body");
    const totalDebeCuenta = document.getElementById("total-debe-cuenta");
    const totalHaberCuenta = document.getElementById("total-haber-cuenta");

    cuentasBody.innerHTML = "";
    let totalDebe = 0;
    let totalHaber = 0;

    currentOperation.cuentas.forEach((cuenta, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cuenta.cuenta}</td>
            <td>${cuenta.debe.toFixed(2)}</td>
            <td>${cuenta.haber.toFixed(2)}</td>
            <td><button onclick="eliminarCuenta(${index})">Eliminar</button></td>
        `;
        cuentasBody.appendChild(row);

        totalDebe += cuenta.debe;
        totalHaber += cuenta.haber;
    });

    totalDebeCuenta.textContent = totalDebe.toFixed(2);
    totalHaberCuenta.textContent = totalHaber.toFixed(2);
}

// Función para eliminar una cuenta de la operación actual
function eliminarCuenta(index) {
    currentOperation.cuentas.splice(index, 1);
    actualizarCuentasTable();
}

// Función para guardar la operación actual
function guardarOperacion() {
    const fecha = document.getElementById("fecha").value;
    const descripcion = document.getElementById("descripcion").value;

    // Validaciones
    if (!fecha || !descripcion) {
        alert("Por favor, complete la fecha y la descripción de la operación.");
        return;
    }

    if (currentOperation.cuentas.length === 0) {
        alert("Debe agregar al menos una cuenta a la operación.");
        return;
    }

    const totalDebe = currentOperation.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
    const totalHaber = currentOperation.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);

    if (Math.abs(totalDebe - totalHaber) > 0.01) {
        alert("¡Advertencia! El Debe y el Haber no están balanceados. Ajuste las cuentas antes de guardar.");
        return;
    }

    // Guardar la operación
    operaciones.push({
        fecha,
        descripcion,
        cuentas: [...currentOperation.cuentas],
        operationNumber: operaciones.length + 1
    });

    // Reiniciar la operación actual
    currentOperation = { fecha: "", descripcion: "", cuentas: [] };
    document.getElementById("fecha").value = "";
    document.getElementById("descripcion").value = "";
    actualizarCuentasTable();
    actualizarOperacionesRegistradas();
}

// Función para actualizar la tabla de operaciones registradas
function actualizarOperacionesRegistradas() {
    const operacionesDiv = document.getElementById("operaciones-registradas");
    operacionesDiv.innerHTML = "";

    operaciones.forEach(op => {
        // Crear una tabla para cada operación
        const table = document.createElement("table");
        table.className = "operation-table";

        // Fila de encabezado
        const headerRow = document.createElement("tr");
        headerRow.className = "operation-header";
        headerRow.innerHTML = `
            <td colspan="4">Operación ${op.operationNumber} - ${op.fecha} - ${op.descripcion}</td>
        `;
        table.appendChild(headerRow);

        // Encabezados de columnas
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Fecha</th>
                <th>Cuenta</th>
                <th>Debe</th>
                <th>Haber</th>
            </tr>
        `;
        table.appendChild(thead);

        // Filas de cuentas
        const tbody = document.createElement("tbody");
        op.cuentas.forEach(cuenta => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${op.fecha}</td>
                <td>${cuenta.cuenta}</td>
                <td>${cuenta.debe.toFixed(2)}</td>
                <td>${cuenta.haber.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        operacionesDiv.appendChild(table);
    });
}