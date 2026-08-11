document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONSULTAR LOS DATOS DEL DASHBOARD
    // ==========================================

    fetch("/api/dashboard")

        .then(res => res.json())

        .then(datos => {


            // ==========================================
            // OBTENER ELEMENTOS DEL HTML
            // ==========================================

            const productos =
                document.getElementById("totalProductos");

            const clientes =
                document.getElementById("totalClientes");

            const empleados =
                document.getElementById("totalEmpleados");

            const inventario =
                document.getElementById("totalInventario");

            const ventas =
                document.getElementById("totalVentas");

            const totalVendido =
                document.getElementById("totalVendido");

            const ventasHoy =
                document.getElementById("ventasHoy");

            const stockBajo =
                document.getElementById("productosStockBajo");


            // ==========================================
            // ESTADÍSTICAS GENERALES
            // ==========================================

            // Mostrar total de productos
            if (productos)
                productos.textContent = datos.totalProductos;


            // Mostrar total de clientes
            if (clientes)
                clientes.textContent = datos.totalClientes;


            // Mostrar total de empleados
            if (empleados)
                empleados.textContent = datos.totalEmpleados;


            // Mostrar total de registros de inventario
            if (inventario)
                inventario.textContent = datos.totalInventario;


            // Mostrar total de ventas
            if (ventas)
                ventas.textContent = datos.totalVentas;


            // ==========================================
            // TOTAL VENDIDO
            // ==========================================

            if (totalVendido)

                totalVendido.textContent =
                    "$" +
                    Number(datos.totalVendido)
                        .toLocaleString("es-CO");


            // ==========================================
            // VENTAS REALIZADAS HOY
            // ==========================================

            if (ventasHoy)

                ventasHoy.textContent =
                    datos.ventasHoy;


            // ==========================================
            // PRODUCTOS CON STOCK BAJO
            // ==========================================

            if (stockBajo) {

                // Comprobar si existen productos
                // con stock por debajo del mínimo

                if (
                    !datos.productosStockBajo ||
                    datos.productosStockBajo.length === 0
                ) {

                    // Si no existen productos con
                    // stock bajo, mostrar este mensaje

                    stockBajo.innerHTML =
                        "<p>No hay productos con stock bajo.</p>";

                } else {

                    // Crear el contenido HTML para
                    // cada producto con stock bajo

                    stockBajo.innerHTML =
                        datos.productosStockBajo
                            .map(producto => `

                                <div class="producto-stock-bajo">

                                    <!-- Nombre del producto -->

                                    <strong>
                                        ${producto.nombre}
                                    </strong>


                                    <!-- Stock disponible -->

                                    <span>
                                        Stock actual:
                                        ${producto.stockActual}
                                    </span>


                                    <!-- Stock mínimo permitido -->

                                    <span>
                                        Stock mínimo:
                                        ${producto.stockMinimo}
                                    </span>

                                </div>

                            `)
                            .join("");

                }

            }


            // ==========================================
            // PRODUCTOS MÁS VENDIDOS
            // ==========================================

            const masVendidos =
                document.getElementById(
                    "productosMasVendidos"
                );


            if (masVendidos) {

                // Comprobar si existen productos
                // registrados como más vendidos

                if (
                    !datos.productosMasVendidos ||
                    datos.productosMasVendidos.length === 0
                ) {

                    // Si no hay información,
                    // mostrar un mensaje

                    masVendidos.innerHTML =
                        "<p>No hay datos de productos vendidos.</p>";

                } else {

                    // Crear una lista con los productos
                    // ordenados por cantidad vendida

                    masVendidos.innerHTML =
                        datos.productosMasVendidos
                            .map((producto, indice) => `

                                <div class="producto-mas-vendido">

                                    <!-- Posición del producto -->

                                    <strong>
                                        ${indice + 1}.
                                        ${producto.nombre}
                                    </strong>


                                    <!-- Cantidad de unidades vendidas -->

                                    <span>
                                        ${producto.cantidadVendida}
                                        unidades
                                    </span>

                                </div>

                            `)
                            .join("");

                }

            }


            // ==========================================
            // ÚLTIMAS VENTAS
            // ==========================================

            const ultimasVentas =
                document.getElementById(
                    "ultimasVentas"
                );


            if (ultimasVentas) {

                // Comprobar si existen ventas registradas

                if (
                    !datos.ultimasVentas ||
                    datos.ultimasVentas.length === 0
                ) {

                    // Si no hay ventas,
                    // mostrar un mensaje

                    ultimasVentas.innerHTML =
                        "<p>No hay ventas registradas.</p>";

                } else {

                    // Crear el contenido HTML
                    // de las últimas ventas

                    ultimasVentas.innerHTML =
                        datos.ultimasVentas
                            .map(venta => `

                                <div class="ultima-venta">

                                    <!-- Número de venta -->

                                    <strong>
                                        Venta #${venta.idVenta}
                                    </strong>


                                    <!-- Cliente -->

                                    <span>
                                        ${venta.cliente}
                                    </span>


                                    <!-- Empleado -->

                                    <span>
                                        ${venta.empleado}
                                    </span>


                                    <!-- Método de pago -->

                                    <span>
                                        ${venta.metodoPago}
                                    </span>


                                    <!-- Total de la venta -->

                                    <strong>
                                        $${Number(venta.totalPagar)
                                            .toLocaleString("es-CO")}
                                    </strong>

                                </div>

                            `)
                            .join("");

                }

            }

            // ==========================================
            // GRÁFICA DE VENTAS DE LOS ÚLTIMOS 7 DÍAS
            // ==========================================

            const graficaVentas =
                document.getElementById("graficaVentas");

            if (graficaVentas) {

                // Verificar que existan datos de ventas
                if (
                    datos.ventasUltimosDias &&
                    datos.ventasUltimosDias.length > 0
                ) {

                    // Obtener las fechas para el eje horizontal
                    const fechas =
                        datos.ventasUltimosDias.map(venta => {

                            return new Date(venta.fecha)
                                .toLocaleDateString("es-CO", {
                                    day: "2-digit",
                                    month: "2-digit"
                                });

                        });


                    // Obtener los totales vendidos
                    const totales =
                        datos.ventasUltimosDias.map(venta => {

                            return Number(venta.total);

                        });


                    // Crear la gráfica
                    new Chart(graficaVentas, {

                        type: "bar",

                        data: {

                            labels: fechas,

                            datasets: [

                                {
                                    label: "Ventas",

                                    data: totales,

                                    borderWidth: 1
                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            scales: {

                                y: {

                                    beginAtZero: true,

                                    ticks: {

                                        callback: function(valor) {

                                            return "$" +
                                                Number(valor)
                                                    .toLocaleString("es-CO");

                                        }

                                    }

                                }

                            }

                        }

                    });

                }

            }

        })

        // ==========================================
        // MANEJO DE ERRORES
        // ==========================================

        .catch(error => {

            console.error(
                "Error cargando dashboard:",
                error
            );

        });

});