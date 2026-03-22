// ============================================================
// products.js — Lógica que conecta el HTML con api.js
// ============================================================
// Este archivo NUNCA hace fetch directamente.
// Solo llama funciones de api.js y funciones de utils.js.
//
// El flujo siempre es:
//   HTML (onclick) → products.js → api.js → utils.js → HTML
// ============================================================


// ------------------------------------------------------------
// ACCIÓN: Traer todos los productos
// ------------------------------------------------------------
// La llama el botón "Consultar todos" del index.html
// ------------------------------------------------------------
async function getAllProductsAction() {
  const products = await getAllProducts();

  if (products) {
    renderProducts(products);
  } else {
    renderError("No se pudieron cargar los productos.");
  }
}


// ------------------------------------------------------------
// ACCIÓN: Buscar un producto por ID
// ------------------------------------------------------------
// La llama el onchange del input de búsqueda en index.html.
// Lee el valor del input y se lo pasa a getProductById().
// ------------------------------------------------------------
async function getProductByIdAction() {
  const id = document.getElementById("idFilter").value;

  // Si el input está vacío no hacemos nada
  if (!id) return;

  const product = await getProductById(id);

  if (product) {
    renderProducts(product);
  } else {
    renderError(`No se encontró ningún producto con id: ${id}`);
  }
}


// ------------------------------------------------------------
// ACCIÓN: Crear un producto nuevo
// ------------------------------------------------------------
// La llama el botón "Guardar" del formulario en create.html.
// Lee los inputs del formulario, arma el objeto y lo manda
// a createProduct() de api.js.
// ------------------------------------------------------------
async function createProductAction() {

  // Leemos cada input del formulario de create.html por su id
  const title    = document.getElementById("title").value;
  const price    = parseFloat(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const stock    = parseInt(document.getElementById("stock").value);

  // Validación básica: si falta algún campo, avisamos y paramos
  if (!title || !price || !category || !stock) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Armamos el objeto con los datos que la API necesita recibir
  const nuevoProducto = {
    title:    title,
    price:    price,
    category: category,
    stock:    stock
  };

  // Le mandamos el objeto a api.js para que haga el POST
  const resultado = await createProduct(nuevoProducto);

  if (resultado) {
    // El producto se creó correctamente
    alert(`Producto "${resultado.title}" creado con éxito. ID: ${resultado.id}`);
    // Redirigimos al index para ver la lista de productos
    window.location.href = "index.html";
  } else {
    renderError("No se pudo crear el producto. Intenta de nuevo.");
  }
}


// ------------------------------------------------------------
// ACCIÓN: Ir a la página de edición
// ------------------------------------------------------------
// La llaman los botones "Editar" de cada fila de la tabla.
// Recibe el id del producto que se quiere editar.
//
// Como no podemos pasar el id directamente entre páginas HTML,
// lo guardamos en localStorage. Es como una memoria temporal
// del navegador que persiste aunque cambies de página.
// ------------------------------------------------------------
function goToEdit(id) {
  // Guardamos el id en localStorage con la clave "editProductId"
  localStorage.setItem("editProductId", id);
  // Navegamos a edit.html
  window.location.href = "edit.html";
}


// ------------------------------------------------------------
// ACCIÓN: Cargar datos del producto en el formulario de edición
// ------------------------------------------------------------
// Esta función se ejecuta automáticamente cuando edit.html carga.
// Recupera el id guardado en localStorage, busca el producto
// en la API y rellena los inputs con sus datos actuales.
// ------------------------------------------------------------
async function loadProductForEdit() {
  // Recuperamos el id que guardamos antes de venir a esta página
  const id = localStorage.getItem("editProductId");

  // Si no hay id guardado, algo salió mal, regresamos al index
  if (!id) {
    window.location.href = "index.html";
    return;
  }

  // Buscamos el producto en la API
  const productos = await getProductById(id);

  // getProductById devuelve un array de un elemento, tomamos el [0]
  const product = productos[0];

  if (product) {
    // Rellenamos cada input del formulario con los datos actuales
    document.getElementById("title").value    = product.title;
    document.getElementById("price").value    = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("stock").value    = product.stock;
  } else {
    alert("No se encontró el producto a editar.");
    window.location.href = "index.html";
  }
}


// ------------------------------------------------------------
// ACCIÓN: Actualizar un producto
// ------------------------------------------------------------
// La llama el botón "Guardar cambios" del formulario en edit.html.
// Lee los inputs actualizados, recupera el id del localStorage
// y se los manda a updateProduct() de api.js.
// ------------------------------------------------------------
async function updateProductAction() {
  const id = localStorage.getItem("editProductId");

  if (!id) {
    alert("No se encontró el producto a actualizar.");
    return;
  }

  // Leemos los valores nuevos del formulario
  const title    = document.getElementById("title").value;
  const price    = parseFloat(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const stock    = parseInt(document.getElementById("stock").value);

  if (!title || !price || !category || !stock) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const datosActualizados = {
    title:    title,
    price:    price,
    category: category,
    stock:    stock
  };

  const resultado = await updateProduct(id, datosActualizados);

  if (resultado) {
    alert(`Producto "${resultado.title}" actualizado con éxito.`);
    // Limpiamos el localStorage porque ya no necesitamos el id guardado
    localStorage.removeItem("editProductId");
    window.location.href = "index.html";
  } else {
    alert("No se pudo actualizar el producto. Intenta de nuevo.");
  }
}


// ------------------------------------------------------------
// ACCIÓN: Eliminar un producto
// ------------------------------------------------------------
// La llaman los botones "Eliminar" de cada fila de la tabla.
// Recibe el id del producto a eliminar.
// No cambia de página, elimina y refresca la tabla en el mismo index.
// ------------------------------------------------------------
async function deleteProductAction(id) {
  // Pedimos confirmación antes de eliminar para no borrar por accidente
  const confirmar = confirm(`¿Estás seguro de que quieres eliminar el producto con id: ${id}?`);

  // Si el usuario canceló, no hacemos nada
  if (!confirmar) return;

  const resultado = await deleteProduct(id);

  if (resultado) {
    alert(`Producto "${resultado.title}" eliminado correctamente.`);
    // Recargamos la tabla para que ya no aparezca el producto eliminado
    getAllProductsAction();
  } else {
    alert("No se pudo eliminar el producto. Intenta de nuevo.");
  }
}