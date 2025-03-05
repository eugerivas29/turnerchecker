require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ruta para realizar el pago de 1 USD
app.post('/pay', async (req, res) => {
    try {
        const { tokenId } = req.body;  // token enviado desde el frontend

        // Crear un cargo de 1 USD
        const charge = await stripe.paymentIntents.create({
            amount: 100,  // 1 USD = 100 centavos
            currency: 'usd',
            payment_method: tokenId,
            confirm: true,
        });

        res.json({ success: true, message: 'Pago realizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const cors = require('cors');
app.use(cors({
    origin: '*', // Permite cualquier origen (cambiar en producción)
    contentSecurityPolicy: false
}));

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://js.stripe.com https://m.stripe.network 'unsafe-inline'");
    next();
});





