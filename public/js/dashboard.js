async function cargarDashboard() {

    try {

        // Verificar la sesión del usuario
        const respuestaUsuario = await fetch("/login/usuario");

        if (!respuestaUsuario.ok) {
            window.location = "/";
            return;
        }

        const usuario = await respuestaUsuario.json();

        document.getElementById("nombreUsuario").innerHTML = usuario.nombre;

        // Cargar estadísticas del dashboard
        const respuesta = await fetch("/api/dashboard");

        const datos = await respuesta.json();

        document.getElementById("totalProductos").innerHTML = datos.productos;

        document.getElementById("totalClientes").innerHTML = datos.clientes;

        document.getElementById("totalEmpleados").innerHTML = datos.empleados;

        document.getElementById("totalInventario").innerHTML = datos.inventario;

        if (document.getElementById("totalVentas")) {
            document.getElementById("totalVentas").innerHTML = datos.ventas ?? 0;
        }

    } catch (error) {

        console.error("Error al cargar el dashboard:", error);

        window.location = "/";

    }

}

function actualizarFechaHora() {

    const ahora = new Date();

    document.getElementById("fechaHora").innerHTML =
        ahora.toLocaleDateString("es-CO") +
        " " +
        ahora.toLocaleTimeString("es-CO");

}

setInterval(actualizarFechaHora, 1000);

actualizarFechaHora();

cargarDashboard();