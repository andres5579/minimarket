// =======================================================
// PRUEBAS AUTOMATIZADAS DEL SERVIDOR
// Proyecto: Sistema Web de Gestión para Minimarket
//
// Herramientas utilizadas:
// - Jest: Framework para ejecutar pruebas.
// - Supertest: Permite simular peticiones HTTP a la
//   aplicación Express sin necesidad de iniciar el servidor.
// =======================================================

// Importa la librería Supertest para realizar peticiones HTTP.
const request = require("supertest");

// Importa la aplicación Express desde server.js.
// Gracias a "module.exports = app", Supertest puede utilizarla
// directamente sin ejecutar app.listen().
const app = require("../server");

// =======================================================
// GRUPO DE PRUEBAS
// describe() permite agrupar pruebas relacionadas.
// =======================================================
describe("Pruebas iniciales del servidor", () => {

    // ===================================================
    // PRUEBA 1
    // Verificar que la página principal (Login)
    // responda correctamente.
    // ===================================================
    test("La página principal debe responder con código 200", async () => {

        // Se realiza una petición GET a la ruta principal.
        const respuesta = await request(app).get("/");

        // Se verifica que el código HTTP sea 200 (OK).
        expect(respuesta.statusCode).toBe(200);

    });

    // ===================================================
    // PRUEBA 2
    // Verificar el comportamiento cuando se solicita
    // una ruta que no existe.
    // ===================================================
    test("Una ruta inexistente debe responder con código 404", async () => {

        // Se realiza una petición a una ruta inexistente.
        const respuesta = await request(app)
            .get("/estaRutaNoExiste");

        // Se espera que Express responda con 404 (Not Found).
        expect(respuesta.statusCode).toBe(404);

    });

});