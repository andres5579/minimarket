const formulario = document.getElementById("formEmpleado");

const tabla = document.getElementById("tablaEmpleados");

const buscar = document.getElementById("buscar");

const idEmpleado = document.getElementById("idEmpleado");
const nombre = document.getElementById("nombre");
const rol = document.getElementById("rol");
const usuario = document.getElementById("usuario");
const password = document.getElementById("password");

let empleados = [];

cargarEmpleados();

//======================
// Guardar
//======================

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = {

        nombre: nombre.value,

        rol: rol.value,

        usuario: usuario.value,

        password: password.value

    };

    if (idEmpleado.value == "") {

        await fetch("/api/empleados", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)

        });

    } else {

        await fetch(`/api/empleados/${idEmpleado.value}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)

        });

    }

    formulario.reset();

    idEmpleado.value = "";

    cargarEmpleados();

});


//======================
// Listar
//======================

async function cargarEmpleados() {

    const respuesta = await fetch("/api/empleados");

    empleados = await respuesta.json();

    mostrarTabla(empleados);

}


//======================
// Mostrar Tabla
//======================

function mostrarTabla(lista){

    tabla.innerHTML = "";

    lista.forEach(emp=>{

        tabla.innerHTML += `

        <tr>

            <td>${emp.idEmpleado}</td>

            <td>${emp.nombre}</td>

            <td>${emp.rol}</td>

            <td>${emp.usuario}</td>

            <td class="acciones">

                <button
                    class="btn-editar"
                    onclick="editar(${emp.idEmpleado})">

                    Editar

                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarEmpleado(${emp.idEmpleado})">

                    Eliminar

                </button>

            </td>

        </tr>

        `;

    });

}


//======================
// Editar
//======================

async function editar(id){

    const respuesta = await fetch(`/api/empleados/${id}`);

    const emp = await respuesta.json();

    idEmpleado.value = emp.idEmpleado;

    nombre.value = emp.nombre;

    rol.value = emp.rol;

    usuario.value = emp.usuario;

    password.value = emp.password;

}


//======================
// Eliminar
//======================

async function eliminarEmpleado(id){

    if(!confirm("¿Eliminar empleado?")) return;

    await fetch(`/api/empleados/${id}`,{

        method:"DELETE"

    });

    cargarEmpleados();

}


//======================
// Buscar
//======================

buscar.addEventListener("keyup",()=>{

    const texto = buscar.value.toLowerCase();

    const resultado = empleados.filter(emp=>

        emp.nombre.toLowerCase().includes(texto) ||

        emp.usuario.toLowerCase().includes(texto) ||

        emp.rol.toLowerCase().includes(texto)

    );

    mostrarTabla(resultado);

});


//======================
// Fecha y Hora
//======================

function actualizarFechaHora(){

    const ahora = new Date();

    document.getElementById("fechaHora").innerHTML =
        ahora.toLocaleDateString("es-CO") +
        " " +
        ahora.toLocaleTimeString("es-CO");

}

setInterval(actualizarFechaHora,1000);

actualizarFechaHora();