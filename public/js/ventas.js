// ===========================
// VARIABLES
// ===========================
const cliente = document.getElementById("cliente");
const empleado = document.getElementById("empleado");
const producto = document.getElementById("producto");

const cantidad = document.getElementById("cantidad");

const detalleVenta = document.getElementById("detalleVenta");

const totalVenta = document.getElementById("totalVenta");

const metodoPago = document.getElementById("metodoPago");

let productos = [];

let carrito = [];

// ===========================
// INICIALIZACIÓN
// ===========================

cargarClientes();
cargarEmpleados();
cargarProductos();

actualizarFechaHora();
setInterval(actualizarFechaHora,1000);

// ===========================
// CARGAR CLIENTES
// ===========================

async function cargarClientes(){

    const respuesta = await fetch("/api/ventas/clientes");

    const datos = await respuesta.json();

    datos.forEach(c=>{

        cliente.innerHTML +=
        `<option value="${c.idCliente}">${c.nombre}</option>`;

    });

}

// ===========================
// CARGAR EMPLEADOS
// ===========================

async function cargarEmpleados(){

    const respuesta = await fetch("/api/ventas/empleados");

    const datos = await respuesta.json();

    datos.forEach(e=>{

        empleado.innerHTML +=
        `<option value="${e.idEmpleado}">${e.nombre}</option>`;

    });

}

// ===========================
// CARGAR PRODUCTOS
// ===========================

async function cargarProductos(){

    const respuesta = await fetch("/api/ventas/productos");

    productos = await respuesta.json();

    productos.forEach(p=>{

        producto.innerHTML +=
        `<option value="${p.idProducto}">
            ${p.nombre}
        </option>`;

    });

}

// ===========================
// AGREGAR PRODUCTO
// ===========================

document
.getElementById("agregarProducto")
.addEventListener("click",agregarProducto);

function agregarProducto(){

    if(producto.value==""){

        alert("Seleccione un producto");

        return;

    }

    const prod = productos.find(

        p=>p.idProducto==producto.value

    );

    const item={

        idProducto:prod.idProducto,

        nombre:prod.nombre,

        precio:parseFloat(prod.precioVenta),

        cantidad:parseInt(cantidad.value),

        subtotal:

            parseFloat(prod.precioVenta) *

            parseInt(cantidad.value)

    };

    carrito.push(item);

    mostrarCarrito();

}

// ===========================
// MOSTRAR CARRITO
// ===========================

function mostrarCarrito(){

    detalleVenta.innerHTML="";

    let total=0;

    carrito.forEach((item,index)=>{

        total+=item.subtotal;

        detalleVenta.innerHTML +=`

        <tr>

            <td>${item.nombre}</td>

            <td>$ ${item.precio}</td>

            <td>${item.cantidad}</td>

            <td>$ ${item.subtotal}</td>

            <td>

                <button onclick="eliminar(${index})">

                    X

                </button>

            </td>

        </tr>

        `;

    });

    totalVenta.innerHTML=total.toFixed(2);

}

// ===========================
// ELIMINAR PRODUCTO
// ===========================

function eliminar(index){

    carrito.splice(index,1);

    mostrarCarrito();

}

// ===========================
// REGISTRAR VENTA
// ===========================

document
.getElementById("guardarVenta")
.addEventListener("click",guardarVenta);

async function guardarVenta(){

    if(carrito.length==0){

        alert("No hay productos");

        return;

    }

    const datos={

        idCliente:cliente.value,

        idEmpleado:empleado.value,

        metodoPago:metodoPago.value,

        estado:"PAGADA",

        totalPagar:parseFloat(totalVenta.innerHTML),

        detalles:carrito.map(item=>({

            idProducto:item.idProducto,

            cantidad:item.cantidad,

            precioUnitario:item.precio,

            subtotal:item.subtotal

        }))

    };

    const respuesta=await fetch(

        "/api/ventas",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(datos)

        }

    );

    const resultado=await respuesta.json();

    alert(resultado.mensaje);

    carrito = [];

    mostrarCarrito();

    cliente.selectedIndex = 0;

    empleado.selectedIndex = 0;

    producto.selectedIndex = 0;

    cantidad.value = 1;

    totalVenta.innerHTML = "0.00";

    }

// ===========================
// FECHA Y HORA
// ===========================

function actualizarFechaHora(){

    const ahora=new Date();

    document.getElementById("fechaHora").innerHTML=

        ahora.toLocaleDateString("es-CO")

        +" "+

        ahora.toLocaleTimeString("es-CO");

}