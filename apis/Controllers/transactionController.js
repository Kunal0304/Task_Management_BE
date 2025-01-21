import db from '../../models/index.js';
import { Op } from 'sequelize';

// Create a new transaction
const addtransaction = async (req, res) => {
  try {
    const transaction = await db.Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all transactions
const getAllTransaction = async (req, res) => {
  try {
    const transactions = await db.Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await db.Transaction.findByPk(req.params.id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update transaction by ID
const updateTransaction = async (req, res) => {
  try {
    const [updated] = await db.Transaction.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTransaction = await db.Transaction.findByPk(req.params.id);
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete transaction by ID
const deleteTranSaction = async (req, res) => {
  try {
    const deleted = await db.Transaction.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total transaction amount
const totalTransaction = async (req, res) => {
  try {
    const total = await db.Transaction.sum('amount');
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get monthly transaction amount
 const monthlyTransaction = async (req, res) => {
  const { month, year } = req.query;
  try {
    const monthlyTotal = await db.Transaction.sum('amount', {
      where: {
        [Op.and]: [
          db.Sequelize.where(db.Sequelize.fn('MONTH', db.Sequelize.col('created_at')), month),
          db.Sequelize.where(db.Sequelize.fn('YEAR', db.Sequelize.col('created_at')), year),
        ]
      }
    });
    res.json({ monthlyTotal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {addtransaction,getAllTransaction,getTransactionById,updateTransaction,deleteTranSaction,totalTransaction,monthlyTransaction};
