// transacciones.js
function procesarTransaccion(tipo, fecha, cuenta, monto, porcentaje) {
    const ivaRate = 0.16; // IVA del 16%
    const asientos = [];
    let operationNumber;

    // Determinar el número de operación (incremental)
    if (!window.operationCounter) window.operationCounter = 0;
    operationNumber = ++window.operationCounter;

    // Calcular IVA
    const iva = monto * ivaRate;
    const montoConIva = monto + iva;
    const porcentajeEfectivo = porcentaje / 100;
    const porcentajeCredito = 1 - porcentajeEfectivo;

    switch (tipo) {
        case "BGI": // Balance General Inicial
            asientos.push({ fecha, cuenta, debe: monto, haber: 0, operation: operationNumber, description: "Inicio de operaciones" });
            // Si es la última cuenta del BGI, agregar Capital
            if (cuenta.toLowerCase() !== "capital") {
                asientos.push({ fecha, cuenta: "Capital", debe: 0, haber: monto, operation: operationNumber, description: "Inicio de operaciones" });
            }
            break;
        case "BGCE": // Compra en Efectivo
            asientos.push({ fecha, cuenta, debe: monto, haber: 0, operation: operationNumber, description: "Compra de maquinaria" });
            asientos.push({ fecha, cuenta: "IVA Acreditado", debe: iva, haber: 0, operation: operationNumber, description: "Compra de maquinaria" });
            asientos.push({ fecha, cuenta: "Caja", debe: 0, haber: montoConIva, operation: operationNumber, description: "Compra de maquinaria" });
            break;
        case "BGCC": // Compra a Crédito
            asientos.push({ fecha, cuenta, debe: monto, haber: 0, operation: operationNumber, description: "Compra a crédito" });
            asientos.push({ fecha, cuenta: "IVA por Acreditar", debe: iva, haber: 0, operation: operationNumber, description: "Compra a crédito" });
            asientos.push({ fecha, cuenta: "Proveedores", debe: 0, haber: montoConIva, operation: operationNumber, description: "Compra a crédito" });
            break;
        case "BGEC": // Compra Efectivo-Crédito
            const montoEfectivo = monto * porcentajeEfectivo;
            const montoCredito = monto * porcentajeCredito;
            const ivaEfectivo = iva * porcentajeEfectivo;
            const ivaCredito = iva * porcentajeCredito;

            asientos.push({ fecha, cuenta, debe: monto, haber: 0, operation: operationNumber, description: "Compra muebles" });
            asientos.push({ fecha, cuenta: "IVA por Acreditar", debe: ivaCredito, haber: 0, operation: operationNumber, description: "Compra muebles" });
            asientos.push({ fecha, cuenta: "IVA Acreditado", debe: ivaEfectivo, haber: 0, operation: operationNumber, description: "Compra muebles" });
            asientos.push({ fecha, cuenta: "Acreedores", debe: 0, haber: montoCredito + ivaCredito, operation: operationNumber, description: "Compra muebles" });
            asientos.push({ fecha, cuenta: "Caja", debe: 0, haber: montoEfectivo + ivaEfectivo, operation: operationNumber, description: "Compra muebles" });
            break;
        case "BGRPA": // Renta Pagada Anticipada
            asientos.push({ fecha, cuenta: "Rentas Pagadas por Anticipado", debe: monto, haber: 0, operation: operationNumber, description: "Pagar renta" });
            asientos.push({ fecha, cuenta: "IVA Acreditado", debe: iva, haber: 0, operation: operationNumber, description: "Pagar renta" });
            asientos.push({ fecha, cuenta: "Caja", debe: 0, haber: montoConIva, operation: operationNumber, description: "Pagar renta" });
            break;
        case "BGAC": // Anticipo de Clientes
            const montoAnticipo = monto * porcentajeEfectivo;
            const ivaAnticipo = iva * porcentajeEfectivo;
            const montoCreditoCliente = monto * porcentajeCredito;

            asientos.push({ fecha, cuenta: "Caja", debe: montoAnticipo + ivaAnticipo, haber: 0, operation: operationNumber, description: `Anticipo recibido ${monto}-50%` });
            asientos.push({ fecha, cuenta: "Anticipo Clientes", debe: 0, haber: montoAnticipo, operation: operationNumber, description: `Anticipo recibido ${monto}-50%` });
            asientos.push({ fecha, cuenta: "IVA Trasladado", debe: 0, haber: ivaAnticipo, operation: operationNumber, description: `Anticipo recibido ${monto}-50%` });
            break;
        case "BGPU": // Compra de Papelería
            asientos.push({ fecha, cuenta: "Papelería y Útiles", debe: monto, haber: 0, operation: operationNumber, description: "Compra papelería" });
            asientos.push({ fecha, cuenta: "IVA Acreditado", debe: iva, haber: 0, operation: operationNumber, description: "Compra papelería" });
            asientos.push({ fecha, cuenta: "Caja", debe: 0, haber: montoConIva, operation: operationNumber, description: "Compra papelería" });
            break;
    }

    return asientos;
}