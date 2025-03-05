const stripe = Stripe("pk_test_51Qz1j0PR4lLB5aUxEFAHxf3Rz0zhGdTg6JosCBwAcNoQ3fMhiXey40EbFEhFSrDwevWHIKfpFqqU5vXQZmJa4tnP00KJxfntB8");


// Función para crear un token de Stripe
async function createStripeToken(cardElement) {
    const {token, error} = await stripe.createToken(cardElement);
    
    if (error) {
        console.error('Error al crear el token:', error);
        alert('Error en el proceso de pago. Intenta de nuevo.');
        return null;
    }
    return token.id;
}

// Función para verificar las tarjetas y realizar el pago
async function verifyAndPay() {
    const cardNumberInput = document.getElementById('credit-cards').value.trim();
    const cards = cardNumberInput.split(',');

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Solo trabajamos con las tarjetas válidas
    const validCards = cards.filter(card => validateCardNumber(card.trim()));

    if (validCards.length === 0) {
        resultDiv.innerHTML = 'No se encontraron tarjetas válidas.';
        return;
    }

    resultDiv.innerHTML = 'Verificando las tarjetas y realizando el pago...';

    // Aquí se usa Stripe para procesar el pago
    const stripeElements = stripe.elements();
    const cardElement = stripeElements.create('card');
    cardElement.mount('#card-element');  // Aquí montas el campo de tarjeta en el frontend

    // Creando un token de Stripe con la tarjeta
    const tokenId = await createStripeToken(cardElement);
    
    if (tokenId) {
        // Enviar el token al servidor para completar el pago
        try {
            const response = await fetch('http://localhost:3000/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenId })
            });

            const result = await response.json();
            if (result.success) {
                resultDiv.innerHTML = `Pago exitoso de 1 USD con tarjeta: ${validCards.join(', ')}`;
            } else {
                resultDiv.innerHTML = 'Error al procesar el pago.';
            }
        } catch (error) {
            resultDiv.innerHTML = 'Error al conectar con el servidor de pago.';
            console.error(error);
        }
    }
}

// Función de validación de tarjetas
function validateCardNumber(cardNumber) {
    cardNumber = cardNumber.replace(/\s+/g, ''); // Eliminar espacios
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

document.getElementById('check-btn').addEventListener('click', verifyAndPay);

const cors = require('cors');
app.use(cors({
    origin: '*', // Permite cualquier origen (cambiar en producción)
    contentSecurityPolicy: false
}));

if (typeof Stripe !== "undefined") {
    const stripe = Stripe("pk_test_51Qz1j0PR4lLB5aUxEFAHxf3Rz0zhGdTg6JosCBwAcNoQ3fMhiXey40EbFEhFSrDwevWHIKfpFqqU5vXQZmJa4tnP00KJxfntB8");

} else {
    console.error("Stripe no se ha cargado correctamente.");
}




const helmet = require("helmet");
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://js.stripe.com", "https://m.stripe.network"],
                frameSrc: ["'self'", "https://js.stripe.com"]
            }
        }
    })
);





