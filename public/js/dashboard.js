async function cargarDashboard() {

    const respuesta = await fetch("/api/dashboard");

    const datos = await respuesta.json();

    document.getElementById("totalProductos").innerHTML = datos.productos;

    document.getElementById("totalClientes").innerHTML = datos.clientes;

    document.getElementById("totalEmpleados").innerHTML = datos.empleados;
    document.getElementById("totalInventario").innerHTML = datos.inventario;

}

function actualizarFechaHora(){

    const ahora = new Date();

    document.getElementById("fechaHora").innerHTML =
        ahora.toLocaleDateString("es-CO") +
        " " +
        ahora.toLocaleTimeString("es-CO");

}

setInterval(actualizarFechaHora,1000);

actualizarFechaHora();

cargarDashboard();