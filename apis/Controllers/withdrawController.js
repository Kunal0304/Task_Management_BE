import { Op, Sequelize } from 'sequelize';
import db from '../../models/index.js';

const createWithdraw = async (req, res) => {
  try {
    const { userId, amount, type, date } = req.body;

    // Validate required fields
    if (!userId || !amount || !type || !date) {
      return res.status(400).json({ error: 'Please provide userId, amount, type, and date.' });
    }

    // Check if the user exists
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Create the withdraw entry
    const newWithdraw = await db.Withdraw.create({
      userId,
      amount,
      type,
      date,
      status: 'pending',  // Default status can be modified as per your logic
      is_obsolate: false, // Set default obsolate status
    });

    res.status(201).json(newWithdraw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await db.Withdraw.findAll({
        include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username'],  // Include user ID and username
            }]
        });
    res.status(200).json(withdraws);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWithdrawById = async (req, res) => {
  try {
    const { id } = req.params;
    const withdraw = await db.Withdraw.findOne({
        where: { id },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['username'], // Include the username
          },
        ],
      });
    if (withdraw) {
      res.status(200).json(withdraw);
    } else {
      res.status(201).json({ message: 'Withdraw request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWithdrawById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, amount, status, date, is_obsolate } = req.body;
    const withdraw = await db.Withdraw.findByPk(id);
    if (withdraw) {
      withdraw.userId = userId || withdraw.userId;
      withdraw.amount = amount || withdraw.amount;
      withdraw.status = status || withdraw.status;
      withdraw.date = date || withdraw.date;
      withdraw.is_obsolate = is_obsolate || withdraw.is_obsolate;
      await withdraw.save();
      res.status(200).json(withdraw);
    } else {
      res.status(404).json({ error: 'Withdraw request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteWithdrawById = async (req, res) => {
  try {
    const { id } = req.params;
    const withdraw = await db.Withdraw.findByPk(id);
    if (withdraw) {
      await withdraw.destroy();
      res.status(201).json({ message: 'Withdraw request deleted successfully' });
    } else {
      res.status(404).json({ error: 'Withdraw request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWithdrawsByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      const withdraws = await db.Withdraw.findAll({
        where: {
          userId,
        },
        include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username'],  // Include user ID and username
            }]
      });
  
      if (withdraws.length > 0) {
        res.status(200).json(withdraws);
      } else {
        res.status(201).json({ message: 'No withdrawals found for this user' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getWithdrawsCurrentMonth = async (req, res) => {
    try {
      const startOfMonth = Sequelize.literal("DATE_FORMAT(CURDATE() ,'%Y-%m-01')");
      const endOfMonth = Sequelize.literal("LAST_DAY(CURDATE())");
  
      const withdraws = await db.Withdraw.findAll({
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['id', 'username'],  // Include user ID and username
            }]
      });
  
      if (withdraws.length > 0) {
        res.status(200).json(withdraws);
      } else {
        res.status(404).json({ error: 'No withdrawals found for the current month' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getWithdrawsCurrentMonthByUserId = async (req, res) => {
    try {
      const { type } = req.params;
      const UserId = req.user.id
      const startOfMonth = Sequelize.literal("DATE_FORMAT(CURDATE() ,'%Y-%m-01')");
      const endOfMonth = Sequelize.literal("LAST_DAY(CURDATE())");
  
      const withdraws = await db.Withdraw.findAll({
        where: {
          UserId,
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
          type: type,
        },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'username'],  // Include user ID and username
          },
        ],
      });
  
      if (withdraws.length > 0) {
        res.status(200).json(withdraws);
      } else {
        res.status(201).json({ message: `No ${type} withdrawals found for this user in the current month` });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export { createWithdraw, getAllWithdraws, getWithdrawById, updateWithdrawById, deleteWithdrawById, getWithdrawsByUserId, getWithdrawsCurrentMonth, getWithdrawsCurrentMonthByUserId};
