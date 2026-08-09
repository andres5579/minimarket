const formulario = document.getElementById("formInventario");
const tabla = document.getElementById("tablaInventario");
const buscar = document.getElementById("buscar");

const selectProducto = document.getElementById("idProducto");
const idInventario = document.getElementById("idInventario");
const ubicacion = document.getElementById("ubicacion");
const stockActual = document.getElementById("stockActual");
const stockMinimo = document.getElementById("stockMinimo");

let inventario = [];

// ======================
// Inicialización
// ======================

cargarProductos();
cargarInventario();

// ======================
// Cargar Productos
// ======================

async function cargarProductos() {

    try {

        const respuesta = await fetch("/api/productos");
        const productos = await respuesta.json();

        selectProducto.innerHTML =
            '<option value="">Seleccione un producto</option>';

        productos.forEach(producto => {

            selectProducto.innerHTML += `
                <option value="${producto.idProducto}">
                    ${producto.nombre}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// ======================
// Guardar o Actualizar
// ======================

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = {

        idProducto: selectProducto.value,
        ubicacion: ubicacion.value,
        stockActual: stockActual.value,
        stockMinimo: stockMinimo.value

    };

    try {

        let respuesta;

        // Registrar
        if (idInventario.value === "") {

            respuesta = await fetch("/api/inventario", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos)

            });

        }
        // Actualizar
        else {

            respuesta = await fetch(`/api/inventario/${idInventario.value}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos)

            });

        }

        // Obtener la respuesta del servidor
        const resultado = await respuesta.json();

        // Mostrar el mensaje enviado por el controlador
        alert(resultado.mensaje);

        // Limpiar formulario
        formulario.reset();

        idInventario.value = "";

        // Recargar la tabla
        cargarInventario();

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al guardar el inventario.");

    }

});

// ======================
// Listar
// ======================

async function cargarInventario() {

    try {

        const respuesta = await fetch("/api/inventario");

        inventario = await respuesta.json();

        mostrarTabla(inventario);

    } catch (error) {

        console.error(error);

    }

}

// ======================
// Mostrar Tabla
// ======================

function mostrarTabla(lista) {

    tabla.innerHTML = "";

    lista.forEach(item => {

        let estado = "🟢 Disponible";

        if (Number(item.stockActual) === 0) {

            estado = "🔴 Agotado";

        } else if (Number(item.stockActual) <= Number(item.stockMinimo)) {

            estado = "🟡 Stock Bajo";

        }

        tabla.innerHTML += `

            <tr>

                <td>${item.nombre}</td>

                <td>${item.ubicacion}</td>

                <td>${item.stockActual}</td>

                <td>${item.stockMinimo}</td>

                <td>${estado}</td>

                <td class="acciones">

                    <button
                        class="btn-editar"
                        onclick="editar(${item.idInventario})">

                        Editar

                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarInventario(${item.idInventario})">

                        Eliminar

                    </button>

                </td>

            </tr>

        `;

    });

}

// ======================
// Editar
// ======================

async function editar(id) {

    try {

        const respuesta = await fetch(`/api/inventario/${id}`);

        const item = await respuesta.json();

        idInventario.value = item.idInventario;

        selectProducto.value = item.idProducto;

        ubicacion.value = item.ubicacion;

        stockActual.value = item.stockActual;

        stockMinimo.value = item.stockMinimo;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

    }

}

// ======================
// Eliminar
// ======================

async function eliminarInventario(id) {

    if (!confirm("¿Desea eliminar este registro del inventario?")) {

        return;

    }

    try {

        const respuesta = await fetch(`/api/inventario/${id}`, {

            method: "DELETE"

        });

        const resultado = await respuesta.json();

        alert(resultado.mensaje);

        cargarInventario();

    } catch (error) {

        console.error(error);

        alert("Error al eliminar el registro del inventario.");

    }

}

// ======================
// Buscar
// ======================

if (buscar) {

    buscar.addEventListener("keyup", () => {

        const texto = buscar.value.toLowerCase();

        const resultado = inventario.filter(item =>

            item.nombre.toLowerCase().includes(texto) ||

            item.ubicacion.toLowerCase().includes(texto)

        );

        mostrarTabla(resultado);

    });

}

// ======================
// Fecha y Hora
// ======================

function actualizarFechaHora() {

    const ahora = new Date();

    const fechaHora =
        ahora.toLocaleDateString("es-CO") +
        " " +
        ahora.toLocaleTimeString("es-CO");

    const elemento = document.getElementById("fechaHora");

    if (elemento) {

        elemento.innerHTML = fechaHora;

    }

}

setInterval(actualizarFechaHora, 1000);

actualizarFechaHora();