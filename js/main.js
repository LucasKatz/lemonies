//DECLARO ARRAYS

let productos = [];
const saboresTortitas = ["lemon pie", "coco", "valeria", "ricota", "manzana", "frutilla"];
let tortitasElegidas = [];
let carrito = [];
// let usuario = [];
let compraRealizada = [];


//TOMO ELEMENTOS DEL DOM
const cartas = document.getElementById("cartas");
const cargaCartas = document.createDocumentFragment();
const contenedorCarrito = document.getElementById("carritoContenedor");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const itemsCarrito = document.getElementById("cart-items");
const precioProducto = document.getElementsByClassName("precioProducto");
const precioFinal = document.getElementById("precioTotal");
const cantidad = document.getElementById("cantidad");
const botonComprar = document.getElementById("comprar-carrito");
const iconoCarrito = document.getElementsByClassName("nav-icon");

const openModal = document.querySelector('.abrirCarrito');
const modal = document.querySelector('.miModal');
const closeModal = document.querySelector('.cerrarCarrito');
const modalCarrito = document.querySelector('.modalContenedor');


// INVOCO FUNCIONES
carroVacio();


// TRAIGO EL LOCAL STORAGE DEL CARRITO
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("carroCompras")) {
        carrito = JSON.parse(localStorage.getItem("carroCompras"));
        console.log(carrito);
        enElCarrito();
    }
    obtenerStock();
})

// TRAIGO EL LOCAL STORAGE DEL USUARIO
// document.addEventListener('DOMContentLoaded', () => {
//     if (localStorage.getItem("usuario")) {
//         usuario = JSON.parse(localStorage.getItem("usuario"));
//         console.log(usuario);
//         cardsProductos();
//     }
// })

//CREO MI STOCK o TRAIGO MI SOTCK

const obtenerStock = async () => {
    const archivoJSON = "productos.json";
    const peticion = await fetch(archivoJSON);
    const respuesta = await peticion.json();
    productos = respuesta;
    cardsProductos();
}


const exhibirPrecios = productos.map((prod) => {
    let exhibicion = prod.nombre + " $" + prod.precio;
    return exhibicion;
})

// RENDERIZO LAS CARDS
function cardsProductos() {
    //inyecto las cards al DOM
    productos.forEach((producto) => {
        let carta = document.createElement("div");
        carta.classname = "card h-100";
        carta.innerHTML = `
        <img class="card-img-top" src=${producto.imagen} alt= 'imagen de ${producto.nombre}'>
        <div class="card-body">
            <h3 class="card-title tituloProductos">${producto.nombre}</h3>
            <p class="card-text descripcionProductos">${producto.descripcion}</p>
            <p class="precio">Precio: $ ${producto.precio}</p>
            <div class="d-grid gap-2 col-6 mx-auto">
                <button class="btn btn-success btn-large buttonPropiedades" id="agregar${producto.id}" type="button">Agregar al carrito</button>
            </div>
        `;

        cargaCartas.appendChild(carta);
        cartas.appendChild(cargaCartas);


        const botonAgregar = document.getElementById(`agregar${producto.id}`);

        botonAgregar.addEventListener("click", () => {
            if (producto.cantidad === 0) {
                Swal.fire({
                    title: 'Disulpas!!',
                    text: 'No contamos con stock',
                    imageUrl: './images/emojidecepcion.webp',
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: 'emoji de decepcion',
                })
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: `${producto.nombre} agregado al carrito`
                })
                agregarAlCarrito(producto.id)
            }

        })

    })
}


//FUNCIONALIDAD DEL CARRITO
const agregarAlCarrito = (prodId) => {
    const existe = carrito.some(prod => prod.id === prodId);
    if (existe) {
        const prod = carrito.map(prod => {
            prod.id === prodId && prod.cantidad++ //sintaxis simplificada
        })
    }
    else {
        const item = productos.find((prod) => prod.id === prodId);
        carrito.push(item);
    }
    enElCarrito();
    console.log(carrito);
}

function carroVacio() {
    carrito.length === 0 ? carritoContenedor.innerHTML += `<h2 class="parrCarroVacio">Tu carrito está vacio</h2>` : console.log("El carro no está vacio");
}

// CONSTRUCTOR DEL CARRITO
const enElCarrito = () => {
    contenedorCarrito.innerHTML = "";
    //inyecto los productos al modal del carrito
    carrito.forEach((prod) => {
        const div = document.createElement("div");
        div.className = ("productoEnCarrito");
        div.innerHTML = `
        <p class="pModal">${prod.nombre} </p>
        <p class="pModal">Precio: $ ${prod.precio}</p>
        <p class="pModal">Cantidad: <input id="cantidad-${prod.id}" type="number" value="${prod.cantidad}" min="1" max="1000" step="1" style="color: #000;"/></p>
        <button onclick="sacarCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i>Eliminar</button>
        `
        contenedorCarrito.appendChild(div);

        let cantidadProductos = document.getElementById(`cantidad-${prod.id}`);
        cantidadProductos.addEventListener("change", (e) => {
            let nuevaCantidad = e.target.value;
            prod.cantidad = nuevaCantidad;
            enElCarrito();
        });

        if (prod.nombre === "Caja de Tortitas") {
            console.log(carrito)
            const sabores = saboresTortitas.map(sabores => sabores.toUpperCase());
            const divSabores = document.createElement("div");
            divSabores.className = ("divSabores");
            divSabores.innerHTML += `
                <select name="sabores" class="form-select saboresUno">
                    <option value="${sabores}[0]}">${sabores[0]}</option>
                    <option value="${sabores}[1]}">${sabores[1]}</option>
                    <option value="${sabores}[2]}">${sabores[2]}</option>
                    <option value="${sabores}[3]}">${sabores[3]}</option>
                    <option value="${sabores}[4]}">${sabores[4]}</option>
                    <option value="${sabores}[5]} selected">${sabores[5]}</option>
                </select>
                <select name="sabores" class="form-select saboresDos">
                    <option value="${sabores}[0]}">${sabores[0]}</option>
                    <option value="${sabores}[1]}" selected>${sabores[1]}</option>
                    <option value="${sabores}[2]}">${sabores[2]}</option>
                    <option value="${sabores}[3]}">${sabores[3]}</option>
                    <option value="${sabores}[4]}">${sabores[4]}</option>
                    <option value="${sabores}[5]}">${sabores[5]}</option>
                </select>
                <select name="sabores" class="form-select saboresTres">
                    <option value="${sabores}[0]}">${sabores[0]}</option>
                    <option value="${sabores}[1]}">${sabores[1]}</option>
                    <option value="${sabores}[2]}" selected>${sabores[2]}</option>
                    <option value="${sabores}[3]}">${sabores[3]}</option>
                    <option value="${sabores}[4]}">${sabores[4]}</option>
                    <option value="${sabores}[5]}">${sabores[5]}</option>
                </select>
                <button id="seleccionar" class="btn btn-success btn-sm" type="button">Seleccionar</button>
            `;
            contenedorCarrito.appendChild(divSabores);

            const botonSeleccionar = document.getElementById("seleccionar");
            const saboresUno = document.querySelector(".saboresUno")
            const saboresDos = document.querySelector(".saboresDos")
            const saboresTres = document.querySelector(".saboresTres")
            botonSeleccionar.addEventListener("click", () => {
                tortitasElegidas.push = saboresUno.value, saboresDos.value, saboresTres


            console.log(tortitasElegidas)
                
            });
        }

        itemsCarrito.innerText = carrito.length;
        localStorage.setItem("carroCompras", JSON.stringify(carrito));
    })

    precioFinal.innerText = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
}

// FUNCIONALIDAD DE LAS PARTES (BUTTONS) DEL CARRITO
const sacarCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId);
    const i = carrito.indexOf(item);
    carrito.splice(i, 1);
    itemsCarrito.innerText = carrito.length;
    enElCarrito();
}

vaciarCarrito.addEventListener("click", () => {
    carrito.length = 0;
    Swal.fire('Has vaciado tu carrito');
    localStorage.removeItem("carroCompras");
    itemsCarrito.innerText = 0;
    enElCarrito();
    carroVacio();
})

botonComprar.addEventListener("click", () => {
    compraRealizada.push(carrito.filter(producto=>producto));
    localStorage.setItem("compraRealizada", JSON.stringify(compraRealizada));
    console.log(compraRealizada);
    carrito.length = 0;
    itemsCarrito.innerText = 0;
    Swal.fire('Gracias por tu compra!! Estamos procesando tu pedido');
    location.href = "./pages/compras.html";
    enElCarrito();
})



//EVENTO QUE DIRECCIONA A LOS PRODUCTOS
const botonBanner = document.querySelector(".banner-title");

botonBanner.addEventListener("mousedown", () => {
    location.href = "#productos";
})



//FORMULARIO DE CONTACTO
const formularioNombre = document.querySelector(".nombreForm");
const telefonoFormulario = document.querySelector(".telForm");
const mensajes = document.getElementById("mensajes");
const correoElectronico = document.getElementById("email");
const formulario = document.querySelector(".formulario");
const btn = document.getElementById('btnSubmit');


/* document.getElementById('form')
    .addEventListener('submit', function (event) {
        event.preventDefault();

        const serviceID = 'default_service';
        const templateID = 'template_7xbn0c3';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                Swal.fire('Mensaje enviado correctamente! Gracias por contactarse');;
            }, (err) => {
                alert(JSON.stringify(err));
            });
        form.reset();
    });
 */


// MODAL DEL CARRITO
openModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('modal--show');
});

closeModal.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('modal--show');
});
