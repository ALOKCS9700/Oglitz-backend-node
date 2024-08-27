import newsletterModels from '../models/newsletter.models.js';

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name } = req.body;
    const existingSubscription = await newsletterModels.findOne({ email });

    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const newSubscription = new newsletterModels({ email, name });
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all subscribers
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await newsletterModels.find();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.params;
    const deletedSubscription = await newsletterModels.findOneAndDelete({ email });

    if (!deletedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
