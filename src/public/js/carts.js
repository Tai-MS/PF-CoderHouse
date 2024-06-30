const socket = io();
console.log('cart', user);
socket.emit('getCartByIdResponse', user); // Envía el email del usuario

socket.on('cartResponse', (response) => {
    console.log(response);
    updateTable(response);
});

function updateTable(response) {
    console.log('Datos del carrito recibidos:', response);
    console.log('--------------------------');
    console.log(response);
    console.log('--------------------------');
    if (response && response.cartProducts && Array.isArray(response.cartProducts)) {
        const products = response.cartProducts;
        const total = response.total; // Asume que el total está presente en la respuesta

        const tableContainer = document.getElementById('products-container');
        tableContainer.innerHTML = ''; 
        const productsContainer = document.querySelector('#products-container');

        if (products.length === 0) {
            const row = document.createElement('div');
            row.innerHTML = `
                <h2>Empty cart</h2>
            `;
            tableContainer.appendChild(row); 
        } else {
            productsContainer.innerHTML = `
                <table>
                    <tr>
                        <th>Product ID</th>
                        <th>Quantity</th>
                    </tr>
                </table>
            `;
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.productId}</td>
                    <td>${product.quantity}</td>
                `;
                productsContainer.querySelector('table').appendChild(row);
            });

            // Mostrar el total
            const totalContainer = document.getElementById('total-container');
            totalContainer.innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
        }
    } 
}
