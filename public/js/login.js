const formulario = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    mensaje.innerHTML = "";

    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    try {

        const respuesta = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                usuario,
                contraseña
            })

        });

        const datos = await respuesta.json();

        if (datos.exito) {

            window.location.href = datos.redirect || "/dashboard";

        } else {

            mensaje.innerHTML = datos.mensaje;

        }

    } catch (error) {

        console.error(error);

        mensaje.innerHTML = "No fue posible conectar con el servidor.";

    }

});