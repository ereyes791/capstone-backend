const { Client } = require('pg');

// Configure your PostgreSQL connection with SSL/TLS options
const client = new Client({
  user: 'capstone_db_adxh_user',
  host: 'cogt18ev3ddc73fcp1i0-a.oregon-postgres.render.com',
  database: 'capstone_db_adxh',
  password: '3xy9M3SrSvR8F5onChOljQeadwDxan7F',
  port: 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: true // Enable SSL/TLS and reject unauthorized connections
  }});

async function connect() {
    try {
      await client.connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }
  async function clearTables() {
    try {
      // Delete all rows from tables
      await client.query(`
        DROP TABLE OrderProducts;
        DROP TABLE Orders;
        DROP TABLE CartItems;
        DROP TABLE Carts;
        DROP TABLE Products;
        DROP TABLE Users;
      `);
  
      console.log('All data deleted from tables');
    } catch (error) {
      console.error('Error clearing tables:', error);
    }
  }
  

// Function to create tables if they don't exist
async function createTables() {
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS Users (
        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name TEXT,
        second_name VARCHAR(20)
      );
      
CREATE TABLE IF NOT EXISTS Products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_links TEXT[]
);


      CREATE TABLE IF NOT EXISTS Carts (
        cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE REFERENCES Users(user_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS CartItems (
        cart_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cart_id UUID REFERENCES Carts(cart_id) ON DELETE CASCADE,
        product_id UUID REFERENCES Products(product_id) ON DELETE CASCADE,
        quantity INT NOT NULL,
        in_cart BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS Orders (
        order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES Users(user_id) ON DELETE CASCADE,
        total_amount NUMERIC(10, 2) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS OrderProducts (
        order_product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID REFERENCES Orders(order_id) ON DELETE CASCADE,
        product_id UUID REFERENCES Products(product_id) ON DELETE CASCADE,
        quantity INT NOT NULL
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}
// Function to seed initial data
async function seedData() {
    try {
      // Insert dummy users
      await client.query(`
        INSERT INTO Users (user_id, username, email, password_hash, first_name, second_name)
        VALUES
          (uuid_generate_v4(), 'user1', 'user1@example.com', '123456', 'user1', 'last1'),
          (uuid_generate_v4(), 'user2', 'user2@example.com', '123456', 'user2', 'last2')
      `);
      // Insert dummy products
      await client.query(`
        INSERT INTO Products (product_id,name, description, price, image_links)
        VALUES
          (uuid_generate_v4(), 'Playstation 5', 'Play Like Never Before. The PS5 Digital Edition unleashes new gaming possibilities that you never anticipated. Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio*,and an all-new generation of incredible PlayStation® games.',
           499.99, '{"https://m.media-amazon.com/images/I/31JaiPXYI8L.jpg", "https://i5.walmartimages.com/asr/f7a0bacc-0eb7-4b2a-8d4c-d58bf8eb2be2.6c196dce5ab9ecf72dc3159782115bfe.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF"}'),
          (uuid_generate_v4(), 'Xbox Series S', 'Jump into the world of Xbox with the Xbox Series S – Starter Bundle. Includes everything you need to play with a next-gen console and 3 months of Game Pass Ultimate. Be the first to play next-generation games that come to life on your Xbox Series S like Starfield and Forza Motorsport on day one. ', 
          299.99, '{"https://m.media-amazon.com/images/I/61Xtx4mXvvL.jpg", "https://m.media-amazon.com/images/I/51VQXsQ9P6L._AC_UF894,1000_QL80_.jpg"}'),
          (uuid_generate_v4(), 'Iphone 15', 'The iPhone 15 has a 6.1 inch all screen Super Retina XDR display with the Dynamic Island. The back is color infused glass, and there is a contoured edge anodized aluminum band around the frame. The side button is on the right side of the device.', 
          999.99, '{"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=1693086369818", "https://www.apple.com/v/iphone/home/bu/images/meta/iphone__ky2k6x5u6vue_og.png"}'),
          (uuid_generate_v4(), 'Fire TV', 'From playoffs to premieres, experience it all like youre there with support for cinematic 4K Ultra HD.', 
          199.99, '{"https://m.media-amazon.com/images/I/31f3bj9o63L._AC_SY580_.jpg", "https://m.media-amazon.com/images/I/41ZC-8Qq+PL._AC_SY580_.jpg"}'),
          (uuid_generate_v4(), 'System design interview:', 'Get ready for your next job interview with this system design interview book. ', 
          19.99, '{"https://m.media-amazon.com/images/I/51vZ6t5W4gL._SY466_.jpg"}'),
          (uuid_generate_v4(),'Mens workout short','Whether youre working out or just playing sports, our mens shorts will provide you with a simple and fashion-forward way to stay comfortable and dry throughout the day to help you take your performance to the next level.', 
          49.99, '{"https://m.media-amazon.com/images/I/31+Zoxsq+oL._SY500__AC_SY200_.jpg"}'),
          (uuid_generate_v4(), 'CR7 Perfume', 'Cristiano Ronaldo creates fragrances to offer his fans an olfactive experience of his world. Conveying his values and lifestyle, Cristiano Ronaldos fragrances illustrate his passion, winning mindset and inspiration', 
          39.99, '{"https://m.media-amazon.com/images/I/61PnD9uR0VL._AC_SY240_.jpg"}'),
          (uuid_generate_v4(), 'USB Microphone Nitro', 'Easy Automatic Connection: This innovative wireless lav microphone is much easier to set. No Adapter, Bluetooth or Application needed. Just get the receiver into your devices, then turn on the portable mic, these two parts will pair automatically.', 
          85.00, '{"https://m.media-amazon.com/images/I/61sGA4VvMxL._AC_UL320_.jpg","https://m.media-amazon.com/images/I/71bw9LcdXtL._AC_SX679_.jpg"}'),
          (uuid_generate_v4(), 'Acer Nitro 23.8" Full HD 1920 x 1080 PC Gaming IPS Monitor | AMD FreeSync Premium | 180Hz Refresh | Up to 0.5ms | HDR10 Support | 99% sRGB | 1 x Display Port 1.2 & 2 x HDMI 2.0 | KG241Y M3biip',
           'In competitive gaming, every frame matters. Introducing Acers KG241Y gaming monitor - the Full HD (1920 x 1080) resolution monitor that can keep up with your game play.', 
          258.00, '{"https://m.media-amazon.com/images/I/71yo3bmyBnL._AC_SX679_.jpg","https://m.media-amazon.com/images/I/71cUVE7Gq5L._AC_SX679_.jpg"}')
          `);
  
      // Insert dummy carts
      await client.query(`
        INSERT INTO Carts (cart_id, user_id)
        VALUES
          (uuid_generate_v4(), (SELECT user_id FROM Users WHERE username = 'user1')),
          (uuid_generate_v4(), (SELECT user_id FROM Users WHERE username = 'user2'))
      `);
  
      // Insert dummy cart items
      await client.query(`
        INSERT INTO CartItems (cart_item_id, cart_id, product_id, quantity)
        VALUES
          (uuid_generate_v4(), (SELECT cart_id FROM Carts WHERE user_id = (SELECT user_id FROM Users WHERE username = 'user1')), (SELECT product_id FROM Products WHERE name = 'Playstation 5'), 2),
          (uuid_generate_v4(), (SELECT cart_id FROM Carts WHERE user_id = (SELECT user_id FROM Users WHERE username = 'user2')), (SELECT product_id FROM Products WHERE name = 'Xbox Series S'), 3)
      `);
  
      console.log('Data seeded successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  }

  //create a new user 
  async function createUser(username, email, password, first_name, second_name) {
    try {
      const result = await client.query(`
        INSERT INTO Users (user_id, username, email, password_hash, first_name, second_name)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)
        RETURNING *
      `, [username, email, password, first_name, second_name]);
  
      return result.rows[0];
      //create a cart for the user
      await client.query(`
        INSERT INTO Carts (cart_id, user_id)
        VALUES (uuid_generate_v4(), $1)
      `, [result.rows[0].user_id]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }
  // get user with email and password
async function getUserByEmailAndPassword(email, password) {
    try {
      const result = await client.query(`
        SELECT * FROM Users
        WHERE email = $1 AND password_hash = $2
      `, [email, password]);
  
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user by email and password:', error);
    }
  }
  //create a product
  async function createProduct(name, description, price) {
    try {
      const result = await client.query(`
        INSERT INTO Products (product_id, name, description, price)
        VALUES (uuid_generate_v4(), $1, $2, $3)
        RETURNING *
      `, [name, description, price]);
  
      return result.rows[0];
    } catch (error) {
      console.error('Error creating product:', error);
    }
  }

// get all products
async function getProducts() {
    try {
      const result = await client.query(`
        SELECT * FROM Products
      `);
  
      return result.rows;
    } catch (error) {
      console.error('Error getting products:', error);
    }
  }
  // get product by name with wildcard
async function getProductByID(id) {

    try {
      const result = await client.query(`
        SELECT * FROM Products
        WHERE product_id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting product by name:', error);
    }
  }
  //get product by name but using windcard
async function getProductByName(name) {
    try {
      const result = await client.query(`
        SELECT * FROM Products
        WHERE name ILIKE $1
      `, [`%${name}%`]);
  
      return result.rows;
    } catch (error) {
      console.error('Error getting product by name:', error);
    }
  }
  //get cart by user id
  async function getCartByUserId(userId) {
    try {
      const result = await client.query(`
        SELECT * FROM Carts
        WHERE user_id = $1
      `, [userId]);
  
      return result.rows.pop();
    } catch (error) {
      console.error('Error getting cart by user ID:', error);
    }
  }
  //add a product to the cart by user id and product id
  async function addProductToCart(userId, productId, quantity) {
    try {
      console.log('userId',userId);
      console.log('productId',productId);
      console.log('quantity',quantity);
      let cart = await client.query(`
        SELECT cart_id FROM Carts WHERE user_id = $1
      `, [userId]).then(result => {
        return result.rows[0];
      });
      if (!cart) {
        // Create a new cart if the user doesn't have one
        await client.query(`
          INSERT INTO Carts (cart_id, user_id)
          VALUES (uuid_generate_v4(), $1)
        `, [userId]);
      }
      // Add the product to the cart
      await client.query(`
        INSERT INTO CartItems (cart_item_id, cart_id, product_id, quantity)
        VALUES (
          uuid_generate_v4(),
          (SELECT cart_id FROM Carts WHERE user_id = $1),
          $2,
          $3
        )
      `, [userId, productId, quantity]);
  
      console.log('Product added to cart successfully');
      return getCartByUserId(userId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }
  //get cart items by user id
  async function getCartItemsByUserId(userId) {
    try {
      console.log(userId);
      const result = await client.query(`
        SELECT ci.cart_item_id, ci.quantity, p.*
        FROM CartItems ci
        JOIN Products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = (SELECT cart_id FROM Carts WHERE user_id = $1)
      `, [userId]);
  
      return result.rows;
    } catch (error) {
      console.error('Error getting cart items by user ID:', error);
    }
  }
  // delete product by id
async function deleteProductById(productId) {
    try {
      await client.query(`
        DELETE FROM Products
        WHERE product_id = $1
      `, [productId]);
  
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
  // update product by id
async function updateProductById(productId, name, description, price) {
    try {
      const result = await client.query(`
        UPDATE Products
        SET name = $1, description = $2, price = $3
        WHERE product_id = $4
        RETURNING *
      `, [name, description, price, productId]);
  
      return result.rows[0];
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }
  //update cart item by id
  async function updateCartItemById(cartItemId, quantity) {
    try {
      const result = await client.query(`
        UPDATE CartItems
        SET quantity = $1
        WHERE cart_item_id = $2
        RETURNING *
      `, [quantity, cartItemId]);
  
      return result.rows[0];
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  }
  //delete cart item by id
  async function deleteCartItemById(cartItemId) {
    try {
      await client.query(`
        DELETE FROM CartItems
        WHERE cart_item_id = $1
      `, [cartItemId]);
  
      console.log('Cart item deleted successfully');
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  }
  //create a new cart
  async function createCart(userId) {
    try {
      await client.query(`
        INSERT INTO Carts (cart_id, user_id)
        VALUES (uuid_generate_v4(), $1)
      `, [userId]);
  
      console.log('Cart created successfully');
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  }
  //create user orders
  async function createOrder(userId, total_amount) {
    try {
      const result = await client.query(`
        INSERT INTO Orders (order_id, user_id, total_amount)
        VALUES (uuid_generate_v4(), $1, $2)
        RETURNING *
      `, [userId, total_amount]);
        return result.rows[0];
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }
//create order products
async function createOrderProduct(orderId, productId, quantity) {
    try {
      await client.query(`
        INSERT INTO OrderProducts (order_product_id, order_id, product_id, quantity)
        VALUES (uuid_generate_v4(), $1, $2, $3)
      `, [orderId, productId, quantity]);
  
      console.log('Order product created successfully');
    } catch (error) {
      console.error('Error creating order product:', error);
    }
  }
//get products with full details by order id
async function getProductsByOrderId(orderId) {
    try {
      console.log('orderId',orderId);
      const result = await client.query(`
        SELECT *
        FROM OrderProducts op
        JOIN Products p ON op.product_id = p.product_id
        WHERE op.order_id = $1
      `, [orderId]);
      // do a query to get the cart id using user id
      const cartId = await client.query(`
        SELECT cart_id FROM Carts WHERE user_id = (SELECT user_id FROM Orders WHERE order_id = $1)
      `, [orderId]);
      // turn off all items in the cart
      turnItemsInCartFalse(cartId.rows[0].cart_id).then(() => {
        console.log('Items in cart turned off');
        return result.rows;
      });
    } catch (error) {
      console.error('Error getting products by order ID:', error);
    }
  }
//gel all orders by user id
async function getOrdersByUserId(userId) {
    try {
      const result = await client.query(`
        SELECT * FROM Orders
        WHERE user_id = $1
      `, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
    }
  }
//turn all items in cart to false
async function turnItemsInCartFalse(cartId) {
    try {
      await client.query(`
        UPDATE CartItems
        SET in_cart = FALSE
        WHERE cart_id = $1
      `, [cartId]);
  
      console.log('Items in cart turned off successfully');
    } catch (error) {
      console.error('Error turning items in cart off:', error);
    }

  }
  //get order by id
async function getOrderById(orderId) {
    try {
      const result = await client.query(`
        SELECT * FROM Orders
        WHERE order_id = $1
      `, [orderId]);
  
      return result.rows[0];
    } catch (error) {
      console.error('Error getting order by ID:', error);
    }
  }
module.exports = {
    connect,
    createTables,
    seedData,
    clearTables,
    getUserByEmailAndPassword,
    createProduct,
    getProducts,
    getProductByID,
    addProductToCart,
    deleteProductById,
    updateProductById,
    getCartItemsByUserId,
    updateCartItemById,
    deleteCartItemById,
    createOrder,
    getOrdersByUserId,
    getOrderById,
    getProductByName,
    createUser,
    createOrderProduct,
    getProductsByOrderId,
    createCart

};
