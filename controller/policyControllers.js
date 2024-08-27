import policyModels from '../models/policy.models.js';

// Create a new policy
export const createPolicy = async (req, res) => {
  try {
    const { type, content } = req.body;
    const newPolicy = new policyModels({ type, content });
    await newPolicy.save();
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a policy by type
export const getPolicy = async (req, res) => {
  try {
    const { type } = req.params;
    const policy = await policyModels.findOne({ type });
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.status(200).json(policy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a policy by type
export const updatePolicy = async (req, res) => {
  try {
    const { type } = req.params;
    const { content } = req.body;
    const updatedPolicy = await Policy.findOneAndUpdate(
      { type },
      { content },
      { new: true }
    );
    if (!updatedPolicy) return res.status(404).json({ error: 'Policy not found' });
    res.status(200).json(updatedPolicy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a policy by type
export const deletePolicy = async (req, res) => {
  try {
    const { type } = req.params;
    const deletedPolicy = await policyModels.findOneAndDelete({ type });
    if (!deletedPolicy) return res.status(404).json({ error: 'Policy not found' });
    res.status(200).json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
