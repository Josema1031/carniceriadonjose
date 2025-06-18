let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosCargados = [];

async function cargarProductos() {
  const res = await fetch("productos.json");
  const productos = await res.json();
  productosCargados = productos;
  mostrarProductos(productosCargados);
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" style="cursor: pointer;" onclick="abrirModal(${prod.id})">
  <h3>${prod.nombre}</h3>
  <p>$${prod.precio}</p>
  <button onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio})">Agregar</button>
    `;
    contenedor.appendChild(div);
  });
}

document.getElementById("buscador").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();
  const filtrados = productosCargados.filter(p => p.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
});

function agregarAlCarrito(id, nombre, precio) {
  const index = carrito.findIndex(p => p.id === id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
  mostrarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
}

function aumentarCantidad(index) {
  carrito[index].cantidad += 1;
  guardarCarrito();
  mostrarCarrito();
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }
  guardarCarrito();
  mostrarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  carrito.forEach((prod, index) => {
    const subtotal = prod.precio * prod.cantidad;
    const li = document.createElement("li");
    li.innerHTML = `
      ${prod.nombre} - $${prod.precio} x ${prod.cantidad} = <strong>$${subtotal}</strong><br>
      <button onclick="disminuirCantidad(${index})">➖</button>
      <button onclick="aumentarCantidad(${index})">➕</button>
      <button onclick="eliminarDelCarrito(${index})">❌</button>
    `;
    lista.appendChild(li);
  });

  const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  document.getElementById("total").textContent = `Total: $${total}`;
}

document.getElementById("btn-enviar").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const mensaje = carrito.map(p => `${p.nombre} - $${p.precio} x ${p.cantidad}`).join("\n");
  const url = `https://wa.me/5492644429649?text=Hola, quiero hacer un pedido:%0A${encodeURIComponent(mensaje)}`;

  // Abrir WhatsApp en nueva pestaña
  window.open(url, "_blank");

  // Vaciar carrito y redirigir a página de gracias
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  window.location.href = "gracias.html";
});


document.getElementById("btn-vaciar").addEventListener("click", () => {
  if (confirm("¿Estás seguro que querés vaciar el carrito?")) {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
  }
});

document.getElementById("toggle-carrito").addEventListener("click", () => {
  document.getElementById("carrito-contenido").classList.toggle("oculto");
});

cargarProductos();
mostrarCarrito();

function abrirModal(id) {
  const producto = productosCargados.find(p => p.id === id);
  if (!producto) return;

  document.getElementById("modal-imagen").src = producto.imagen;
  document.getElementById("modal-nombre").textContent = producto.nombre;
  document.getElementById("modal-precio").textContent = "$" + producto.precio;
  document.getElementById("modal-descripcion").textContent = producto.descripcion || "";
  document.getElementById("modal-producto").classList.remove("oculto");

  document.getElementById("modal-agregar").onclick = () => {
    agregarAlCarrito(producto.id, producto.nombre, producto.precio);
    cerrarModal();
  };
}

function cerrarModal() {
  document.getElementById("modal-producto").classList.add("oculto");
}

