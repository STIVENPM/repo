// ============================================================
// utils.js — Funciones para pintar cosas en el HTML
// ============================================================
// Este archivo NO sabe nada de la API ni de fetch.
// Solo recibe datos y los convierte en HTML visible.
// ============================================================


// ------------------------------------------------------------
// Pintar la tabla de productos
// ------------------------------------------------------------
// Recibe un array de productos y crea una fila por cada uno.
// Ahora cada fila tiene botones de Editar y Eliminar.
// ------------------------------------------------------------
function renderProducts(products) {
  const container = document.getElementById("container");

  // Limpiamos lo que había para no duplicar filas
  container.innerHTML = "";

  products.forEach(function(product) {
    // Cada fila tiene:
    // - Los datos del producto
    // - Botón Editar  → llama goToEdit(id) de products.js
    // - Botón Eliminar → llama deleteProductAction(id) de products.js
    container.innerHTML += `
      <tr>
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>$${product.price}</td>
        <td>
          <button 
            class="btn btn-warning btn-sm"
            onclick="goToEdit(${product.id})">
            Editar
          </button>
          <button 
            class="btn btn-danger btn-sm"
            onclick="deleteProductAction(${product.id})">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}


// ------------------------------------------------------------
// Mostrar un mensaje de error en la tabla
// ------------------------------------------------------------
// Se usa cuando la API falla o no encuentra resultados.
// colspan="4" porque ahora la tabla tiene 4 columnas
// (antes eran 3, ahora agregamos la de acciones).
// ------------------------------------------------------------
function renderError(mensaje) {
  const container = document.getElementById("container");
  container.innerHTML = `
    <tr>
      <td colspan="4" class="text-danger text-center">
        ${mensaje}
      </td>
    </tr>
  `;
}