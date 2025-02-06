import pkg from 'svix';
const { Webhook } = pkg;
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with the Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify the webhook signature
    const payload = JSON.stringify(req.body);
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    try {
      whook.verify(payload, headers);
    } catch (verificationError) {
      console.error('Webhook verification failed:', verificationError.message);
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    // Destructure data from request body
    const { data, type } = req.body;

    // Handle different event types
    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url || '',
          resume: '',
        };

        await User.create(userData);
        return res.status(200).json({ success: true, message: 'User created successfully' });
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url || '',
        };

        await User.findByIdAndUpdate(data.id, userData);
        return res.status(200).json({ success: true, message: 'User updated successfully' });
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
      }

      default: {
        console.warn('Unhandled event type:', type);
        return res.status(400).json({ success: false, message: `Unhandled event type: ${type}` });
      }
    }
  } catch (error) {
    console.error('Error handling webhook:', error.message);
    res.status(500).json({ success: false, message: 'Webhook error' });
  }
};
