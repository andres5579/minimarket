const formulario = document.getElementById("formCliente");
const tabla = document.getElementById("tablaClientes");

cargarClientes();

formulario.addEventListener("submit", guardarCliente);

// ===============================
// GUARDAR O ACTUALIZAR
// ===============================

async function guardarCliente(e) {

    e.preventDefault();

    const id = document.getElementById("idCliente").value;

    const cliente = {

        nombre: document.getElementById("nombre").value,

        telefono: document.getElementById("telefono").value,

        puntosAcumulados: 0
    };

    let url = "/api/clientes";
    let metodo = "POST";

    if (id !== "") {

        url = "/api/clientes/" + id;
        metodo = "PUT";

    }

    try {

        const respuesta = await fetch(url, {

            method: metodo,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(cliente)

        });

        const resultado = await respuesta.json();

        alert(resultado.mensaje);

        formulario.reset();

        document.getElementById("idCliente").value = "";


        cargarClientes();

    } catch (error) {

        console.error(error);

        alert("Error al guardar el cliente.");

    }

}

// ===============================
// LISTAR
// ===============================

async function cargarClientes() {

    const respuesta = await fetch("/api/clientes");

    const clientes = await respuesta.json();

    tabla.innerHTML = "";

    clientes.forEach(cliente => {

        tabla.innerHTML += `

        <tr>

            <td>${cliente.idCliente}</td>

            <td>${cliente.nombre}</td>

            <td>${cliente.telefono}</td>

            <td>${cliente.puntosAcumulados}</td>

            <td>

                <div class="acciones">

                    <button
                        class="btn-editar"
                        onclick="editarCliente(${cliente.idCliente})">

                        Editar

                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarCliente(${cliente.idCliente})">

                        Eliminar

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

// ===============================
// EDITAR
// ===============================

async function editarCliente(id) {

    const respuesta = await fetch("/api/clientes/" + id);

    const datos = await respuesta.json();

    const cliente = datos[0];

    document.getElementById("idCliente").value = cliente.idCliente;

    document.getElementById("nombre").value = cliente.nombre;

    document.getElementById("telefono").value = cliente.telefono;

    document.getElementById("puntosAcumulados").value = cliente.puntosAcumulados;

}

// ===============================
// ELIMINAR
// ===============================

async function eliminarCliente(id) {

    if (!confirm("¿Desea eliminar este cliente?")) {

        return;

    }

    await fetch("/api/clientes/" + id, {

        method: "DELETE"

    });

    cargarClientes();

}

// ===============================
// BUSCAR
// ===============================

function filtrarClientes() {

    const texto = document
        .getElementById("buscar")
        .value
        .toLowerCase();

    const filas = document.querySelectorAll("#tablaClientes tr");

    filas.forEach(fila => {

        const nombre = fila.children[1].textContent.toLowerCase();

        fila.style.display = nombre.includes(texto)
            ? ""
            : "none";

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