// ============================================================
// api.js — Todas las peticiones HTTP a la API van aquí
// ============================================================
// Este archivo tiene UNA función por cada tipo de petición:
//   GET    → pedir datos
//   POST   → crear algo nuevo
//   PUT    → modificar algo existente
//   DELETE → eliminar algo
// ============================================================


// ------------------------------------------------------------
// GET — Traer TODOS los productos
// ------------------------------------------------------------
// No recibe parámetros porque trae todo.
// Devuelve un array con todos los productos.
// ------------------------------------------------------------
async function getAllProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();
    // DummyJSON responde así: { products: [...], total: 194 }
    // Nosotros solo necesitamos el array products
    return data.products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return null;
  }
}


// ------------------------------------------------------------
// GET — Traer UN producto por su ID
// ------------------------------------------------------------
// Recibe el id que el usuario escribió en el input.
// Devuelve un array de un solo elemento para que
// renderProducts() lo maneje igual que el GET de todos.
// ------------------------------------------------------------
async function getProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Producto no encontrado");
    const data = await response.json();
    // Aquí la API devuelve el objeto directamente, no dentro de { products: }
    // Lo metemos en [] para que renderProducts lo trate igual que siempre
    return [data];
  } catch (error) {
    console.error("Error al buscar producto:", error);
    return null;
  }
}


// ------------------------------------------------------------
// POST — Crear un producto nuevo
// ------------------------------------------------------------
// Recibe un objeto "productData" con los datos del formulario.
// Ejemplo de lo que recibe:
//   { title: "Zapato", price: 49.99, category: "footwear" }
//
// El método POST le dice a la API "quiero CREAR algo nuevo".
// Los datos viajan en el BODY de la petición, no en la URL.
// Content-Type: application/json le avisa a la API que
// le estamos mandando datos en formato JSON.
// ------------------------------------------------------------
async function createProduct(productData) {
  try {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // JSON.stringify convierte el objeto JS a texto JSON
      // porque HTTP solo puede enviar texto, no objetos JS
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error("Error al crear el producto");

    const data = await response.json();
    // La API responde con el producto recién creado (con su nuevo id)
    return data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    return null;
  }
}


// ------------------------------------------------------------
// PUT — Actualizar un producto existente
// ------------------------------------------------------------
// Recibe el id del producto a modificar y los datos nuevos.
// Ejemplo de lo que recibe:
//   id: 5
//   productData: { title: "Zapato editado", price: 59.99 }
//
// PUT le dice a la API "quiero MODIFICAR algo que ya existe".
// La URL incluye el id para que la API sepa cuál modificar.
// ------------------------------------------------------------
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error("Error al actualizar el producto");

    const data = await response.json();
    // La API responde con el producto ya actualizado
    return data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return null;
  }
}


// ------------------------------------------------------------
// DELETE — Eliminar un producto
// ------------------------------------------------------------
// Recibe solo el id del producto a eliminar.
// No necesita body porque no hay datos que enviar,
// solo le decimos a la API qué id queremos borrar.
// ------------------------------------------------------------
async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Error al eliminar el producto");

    const data = await response.json();
    // DummyJSON responde con el producto eliminado + isDeleted: true
    return data;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return null;
  }
}

