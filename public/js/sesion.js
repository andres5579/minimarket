document.addEventListener("DOMContentLoaded", () => {
    cargarUsuario();
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

function cargarUsuario() {

    fetch("/login/usuario")

    .then(res => {

        if (!res.ok) {
            window.location = "/";
            return;
        }

        return res.json();

    })

    .then(usuario => {

        if (!usuario) return;

        const nombre = document.getElementById("nombreUsuario");
        const rol = document.getElementById("rolUsuario");

        if (nombre) nombre.textContent = usuario.nombre;
        if (rol) rol.textContent = usuario.rol;

        mostrarMenu(usuario.rol);

        document.body.style.visibility = "visible";

    })

    .catch(() => {
        window.location = "/";
    });

}

function mostrarMenu(rol) {

    rol = rol.trim().toLowerCase();

    // Menú lateral
    const menuClientes = document.getElementById("menuClientes");
    const menuEmpleados = document.getElementById("menuEmpleados");
    const menuInventario = document.getElementById("menuInventario");
    const menuVentas = document.getElementById("menuVentas");
    const menuDetalleVenta = document.getElementById("menuDetalleVenta");

    // Tarjetas
    const cardClientes = document.getElementById("menuClientesCard");
    const cardEmpleados = document.getElementById("menuEmpleadosCard");
    const cardInventario = document.getElementById("menuInventarioCard");
    const cardVentas = document.getElementById("menuVentasCard");
    const cardDetalleVenta = document.getElementById("menuDetalleVentaCard");
    

    switch (rol) {

        case "administrador":
            break;

        case "cajero":

            if (menuEmpleados) menuEmpleados.style.display = "none";
            if (menuInventario) menuInventario.style.display = "none";
            if (menuDetalleVenta) menuDetalleVenta.style.display = "none";

            if (cardEmpleados) cardEmpleados.style.display = "none";
            if (cardInventario) cardInventario.style.display = "none";
            if (cardDetalleVenta) cardDetalleVenta.style.display = "none";

            document.querySelectorAll(".solo-admin").forEach(card => {
                card.style.display = "none";
            });

            break;

        case "auxiliar de inventario":

            if (menuClientes) menuClientes.style.display = "none";
            if (menuEmpleados) menuEmpleados.style.display = "none";
            if (menuVentas) menuVentas.style.display = "none";
            if (menuDetalleVenta) menuDetalleVenta.style.display = "none";

            if (cardClientes) cardClientes.style.display = "none";
            if (cardEmpleados) cardEmpleados.style.display = "none";
            if (cardVentas) cardVentas.style.display = "none";
            if (cardDetalleVenta) cardDetalleVenta.style.display = "none";

            break;
    }

}

function actualizarFechaHora() {

    const ahora = new Date();

    const opciones = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    const fecha = document.getElementById("fechaHora");

    if (fecha) {
        fecha.innerHTML = ahora.toLocaleDateString("es-CO", opciones);
    }

}