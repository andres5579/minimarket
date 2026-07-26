// ===========================
// VARIABLES
// ===========================

const tablaDetalle = document.getElementById("tablaDetalle");

// ===========================
// INICIALIZACIÓN
// ===========================

listar();

actualizarFechaHora();

setInterval(actualizarFechaHora,1000);

// ===========================
// LISTAR DETALLE DE VENTAS
// ===========================

async function listar(){

    try{

        const respuesta = await fetch("/api/detalleventa");

        const datos = await respuesta.json();

        tablaDetalle.innerHTML = "";

        datos.forEach(detalle=>{

            tablaDetalle.innerHTML += `

            <tr>

                <td>${detalle.idDetalle}</td>

                <td>${detalle.idVenta}</td>

                <td>${new Date(detalle.fechaHora).toLocaleString("es-CO")}</td>

                <td>${detalle.cliente}</td>

                <td>${detalle.empleado}</td>

                <td>${detalle.producto}</td>

                <td>${detalle.cantidad}</td>

                <td>$${Number(detalle.precioUnitario).toLocaleString("es-CO")}</td>

                <td>$${Number(detalle.subtotal).toLocaleString("es-CO")}</td>

                <td>$${Number(detalle.totalPagar).toLocaleString("es-CO")}</td>

            </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

        alert("Error al cargar el detalle de ventas.");

    }

}

// ===========================
// FECHA Y HORA
// ===========================

function actualizarFechaHora(){

    document.getElementById("fechaHora").innerHTML =
        new Date().toLocaleString("es-CO");

}