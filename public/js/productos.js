const formulario = document.getElementById("formProducto");
const tabla = document.getElementById("tablaProductos");

// Cargar productos al iniciar
cargarProductos();

// Evento del formulario
formulario.addEventListener("submit", guardarProducto);

// =========================
// GUARDAR O ACTUALIZAR
// =========================
async function guardarProducto(e) {

    e.preventDefault();

    const id = document.getElementById("idProducto").value;

    const producto = {

        nombre: document.getElementById("nombre").value,
        codigoBarra: document.getElementById("codigoBarra").value,
        precioVenta: parseFloat(document.getElementById("precioVenta").value),
        precioCompra: parseFloat(document.getElementById("precioCompra").value),
        categoria: document.getElementById("categoria").value,
        unidadMedida: document.getElementById("unidadMedida").value,
        fechaVencimiento: document.getElementById("fechaVencimiento").value

    };

    let url = "/api/productos";
    let metodo = "POST";

    if (id !== "") {

        url = "/api/productos/" + id;
        metodo = "PUT";

    }

    try {

        const respuesta = await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(producto)

        });

        if (!respuesta.ok) {
            throw new Error("Error al guardar el producto");
        }

        const resultado = await respuesta.json();

        alert(resultado.mensaje);

        formulario.reset();

        document.getElementById("idProducto").value = "";

        cargarProductos();

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al guardar el producto.");

    }

}

// =========================
// LISTAR PRODUCTOS
// =========================
async function cargarProductos() {

    try {

        const respuesta = await fetch("/api/productos");

        const productos = await respuesta.json();

        tabla.innerHTML = "";

        productos.forEach(producto => {

            tabla.innerHTML += `

            <tr>

                <td>${producto.idProducto}</td>

                <td>${producto.nombre}</td>

                <td>${producto.codigoBarra}</td>

                <td>$ ${producto.precioVenta}</td>

                <td>${producto.categoria}</td>

                <td>

                    <div class="acciones">

                        <button
                            class="btn-editar"
                            onclick="editarProducto(${producto.idProducto})">

                            Editar

                        </button>

                        <button
                            class="btn-eliminar"
                            onclick="eliminarProducto(${producto.idProducto})">

                            Eliminar

                        </button>

                    </div>

                </td>

            </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// =========================
// EDITAR
// =========================
async function editarProducto(id) {

    try {

        const respuesta = await fetch("/api/productos/" + id);

        const datos = await respuesta.json();

        if (datos.length === 0) {

            alert("Producto no encontrado");

            return;

        }

        const producto = datos[0];

        document.getElementById("idProducto").value = producto.idProducto;
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("codigoBarra").value = producto.codigoBarra;
        document.getElementById("precioVenta").value = producto.precioVenta;
        document.getElementById("precioCompra").value = producto.precioCompra;
        document.getElementById("categoria").value = producto.categoria;
        document.getElementById("unidadMedida").value = producto.unidadMedida;
        document.getElementById("fechaVencimiento").value =
            producto.fechaVencimiento
                ? producto.fechaVencimiento.substring(0, 10)
                : "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

    }

}

// =========================
// ELIMINAR
// =========================
async function eliminarProducto(id) {

    const confirmar = confirm("¿Desea eliminar este producto?");

    if (!confirmar) {

        return;

    }

    try {

        const respuesta = await fetch("/api/productos/" + id, {

            method: "DELETE"

        });

        const resultado = await respuesta.json();

        alert(resultado.mensaje);

        cargarProductos();

    } catch (error) {

        console.error(error);

    }

}

// =========================
// BUSCAR
// =========================
function filtrarProductos() {

    const texto = document
        .getElementById("buscar")
        .value
        .toLowerCase();

    const filas = document.querySelectorAll("#tablaProductos tr");

    filas.forEach(fila => {

        const nombre = fila.children[1].textContent.toLowerCase();

        fila.style.display = nombre.includes(texto) ? "" : "none";

    });

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