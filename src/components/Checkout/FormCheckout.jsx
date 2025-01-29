import { useState, useContext } from 'react';
import cartContext from '../Context/cartContext';
import { createBuyOrder } from '../../data/database';
import './FormCheckout.css';

export default function Form() {
  const [userData, setUserData] = useState({
    username: '',
    surname: '',
    age: '',
    email: '',
  });
  
  const [orderID, setOrderID] = useState(null); // New state for order ID visibility

  function onInputChange(evt) {
    const inputName = evt.target.name;
    const newUserData = { ...userData };
    newUserData[inputName] = evt.target.value;
    setUserData(newUserData);
  }

  const { cartItems, getTotalPrice, clearCart } = useContext(cartContext);

  async function handleCheckout(evt) {
    evt.preventDefault();

    const orderData = {
      Comprador: {
        Nombre: userData.username,
        Apellido: userData.surname,
        Edad: userData.age,
        Email: userData.email
      },
      Fecha: new Date(),
      Artículos: cartItems,
      total: getTotalPrice()
    };
    setOrderID(null);
    const newOrderID = await createBuyOrder(orderData); 
    setOrderID(newOrderID); // Set the order ID to state
  }

  const handleReturnHome = () => {
    clearCart(); // Clear the shopping cart
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <div className="form-checkout">
    
      
      <form>
      <h2 className='form-group'>Para comprar, rellene sus datos:</h2>
        <div className="form-group">
          <label htmlFor="username">Nombre</label>
          <input
            name="username"
            type="text"
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Apellido</label>
          <input name="surname" type="text" onChange={onInputChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="age">Edad</label>
          <input name="age" type="number" onChange={onInputChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input name="email" type="email" onChange={onInputChange} required />
        </div>

        <button
          disabled={!(userData.username && userData.surname && userData.age && userData.email)}
          onClick={handleCheckout}
        >
          Realizar Compra
        </button>
      </form>

      {/* Conditional rendering for the order confirmation ticket */}  
      {orderID && (
        <div className="order-confirmation">
          <h3>Comparte tu ID de pedido, estás a un paso de terminar tu compra:</h3>
          <p>Tu ID de pedido es: <strong>{orderID}</strong></p>
          <p>Compartelo acá:</p>
          <button onClick={() => window.open(`mailto:jorregor@udd.cl?subject=Mi ID de pedido&body=Mi ID de pedido es: ${orderID}`)}>Email</button>
          <button onClick={() => window.open(`https://www.instagram.com/jorregodesign/`)}>Instagram</button>
          <button onClick={handleReturnHome}>Volver al Inicio</button>
        </div>
      )}
    </div>
  );
}
