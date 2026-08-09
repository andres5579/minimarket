// ============================================================
// PRUEBAS UNITARIAS DEL CONTROLADOR DE PRODUCTOS
// Proyecto: Sistema Web de Gestión MiniMarket
//
// Framework utilizado:
// - Jest
//
// Librería utilizada:
// - node-mocks-http
//
// Objetivo:
// Verificar el funcionamiento del controlador de productos
// sin utilizar Express ni conectarse a MySQL.
//
// Para ello se simula (Mock) el modelo Producto.
// ============================================================


// ============================================================
// MOCK DEL MODELO
//
// IMPORTANTE:
// El mock debe declararse ANTES de importar el controlador,
// de lo contrario Jest cargará el modelo real y abrirá la
// conexión con MySQL.
// ============================================================

jest.mock("../models/Producto", () => ({

    obtenerTodos: jest.fn(),

    obtenerPorId: jest.fn(),

    insertar: jest.fn(),

    actualizar: jest.fn(),

    eliminar: jest.fn()

}));


// ============================================================
// IMPORTACIONES
// ============================================================

const httpMocks = require("node-mocks-http");

const Producto = require("../models/Producto");

const productoController = require("../controllers/productoController");


// ============================================================
// GRUPO DE PRUEBAS
// ============================================================

describe("Pruebas Unitarias - productoController.listar()", () => {

    // ========================================================
    // Limpiar los mocks antes de cada prueba
    // ========================================================

    beforeEach(() => {

        jest.clearAllMocks();

    });


    // ========================================================
    // CASO 1
    //
    // Existen productos registrados.
    //
    // Se espera:
    // Código HTTP 200.
    // ========================================================

    test("Debe listar correctamente los productos", () => {

        Producto.obtenerTodos.mockImplementation((callback) => {

            callback(null, [

                {

                    idProducto: 1,

                    nombre: "Arroz Diana",

                    precioVenta: 4200

                }

            ]);

        });


        const req = httpMocks.createRequest();

        const res = httpMocks.createResponse();


        productoController.listar(req, res);


        expect(res.statusCode).toBe(200);

        expect(res._getJSONData()).toEqual([

            {

                idProducto: 1,

                nombre: "Arroz Diana",

                precioVenta: 4200

            }

        ]);

    });


    // ========================================================
    // CASO 2
    //
    // No existen productos registrados.
    //
    // Se espera:
    // Código HTTP 404.
    // ========================================================

    test("Debe responder 404 cuando no existan productos", () => {

        Producto.obtenerTodos.mockImplementation((callback) => {

            callback(null, []);

        });


        const req = httpMocks.createRequest();

        const res = httpMocks.createResponse();


        productoController.listar(req, res);


        expect(res.statusCode).toBe(404);

        expect(res._getJSONData()).toEqual({

            exito: false,

            mensaje: "No se encontraron productos."

        });

    });


    // ========================================================
    // CASO 3
    //
    // Ocurre un error interno.
    //
    // Se espera:
    // Código HTTP 500.
    // ========================================================

    test("Debe responder 500 cuando ocurra un error interno", () => {

        Producto.obtenerTodos.mockImplementation((callback) => {

            callback(new Error("Error de base de datos"));

        });


        const req = httpMocks.createRequest();

        const res = httpMocks.createResponse();


        productoController.listar(req, res);


        expect(res.statusCode).toBe(500);


        const respuesta = res._getJSONData();


        expect(respuesta.exito).toBe(false);

        expect(respuesta.mensaje).toBe("Error interno del servidor.");

    });

});