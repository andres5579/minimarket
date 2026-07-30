document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/dashboard")
        .then(res => res.json())
        .then(datos => {

            const productos = document.getElementById("totalProductos");
            const clientes = document.getElementById("totalClientes");
            const empleados = document.getElementById("totalEmpleados");
            const inventario = document.getElementById("totalInventario");
            const ventas = document.getElementById("totalVentas");

            if (productos)
                productos.textContent = datos.totalProductos;

            if (clientes)
                clientes.textContent = datos.totalClientes;

            if (empleados)
                empleados.textContent = datos.totalEmpleados;

            if (inventario)
                inventario.textContent = datos.totalInventario;

            if (ventas)
                ventas.textContent = datos.totalVentas;

        })
        .catch(error => {

            console.error("Error cargando dashboard:", error);

        });

});