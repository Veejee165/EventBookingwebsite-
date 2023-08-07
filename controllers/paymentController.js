const stripe = require("stripe")(process.env.stripe)

exports.createPaymentIntent = async (req, res) => {
   const { amount, currency, paymentMethodId, description } = req.body

   try {
      const paymentIntent = await stripe.paymentIntents.create({
         amount,
         currency,
         payment_method: paymentMethodId,
         confirm: true,
         description: description,
      })

      res.status(200).json({
         clientSecret: paymentIntent.client_secret,
      })
   } catch (error) {
      res.status(500).json({ error: error.message })
   }
}

// Rest of the code remains unchanged

exports.processRefund = async (req, res) => {
   const { paymentIntentId } = req.params

   try {
      const refund = await stripe.refunds.create({
         payment_intent: paymentIntentId,
      })

      res.status(200).json({ refundId: refund.id })
   } catch (error) {
      res.status(500).json({ error: error.message })
   }
}
