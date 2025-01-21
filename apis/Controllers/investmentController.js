
import { Op, Sequelize } from 'sequelize';
import db from '../../models/index.js';

// Create a new investment
const addInvestment = async (req, res) => {
  try {
    const investment = await db.Investment.create(req.body);
    res.status(201).json(investment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all investments
const getAllInvestment = async (req, res) => {
  try {
    const investments = await db.Investment.findAll(
      {
        where: {
          is_obsolate: false,
        },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['username', 'mobile_no'],
          },
        ],
      }
    );
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get investment by ID
const getInvestmentById =  async (req, res) => {
  try {
    const investment = await db.Investment.findByPk(req.params.id);
    if (investment) {
      res.json(investment);
    } else {
      res.status(404).json({ error: 'Investment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get investment by ID
const getInvestmentByUserId = async (req, res) => {
    try {
      const investments = await db.Investment.findAll({
        where: {
          userId: req.params.uid
        }
      });
      if (investments.length > 0) {
        res.json(investments);
      } else {
        res.status(404).json({ error: 'No investments found for this user' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update investment by ID 
const updateInvestment = async (req, res) => {
    try {
 
      const [updated] = await db.Investment.update(req.body,
        {
        where: { id: req.params.id }
      });
      if (updated) {
        const getupdatedInvestment = await db.Investment.findByPk(req.params.id);
        res.json(getupdatedInvestment);
      } else {
        res.status(404).json({ error: 'Investment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Delete investment by ID
const deleteInvestment = async (req, res) => {
  try {
    const deleted = await db.Investment.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(200).json({message: 'Investment Deleted Successfully'});
    } else {
      res.status(404).json({ error: 'Investment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVisibleInvestments = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentDate = new Date();

    const investments = await db.Investment.findAll({
      where: {
        userId,
        is_obsolate: false,
        type: 'approved',
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('DATE_ADD', Sequelize.col('date'), Sequelize.literal('INTERVAL lockPeriod MONTH')),
            {
              [Op.lte]: currentDate,
            }
          ),
        ],
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username'], // Include user ID and username
        },
      ],
    });

    if (investments.length > 0) {
      res.status(200).json(investments);
    } else {
      res.status(201).json({ message: 'No capital found that meet the criteria.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVisibleInvestmentsAll = async (req, res) => {
  try {

    const currentDate = new Date();

    const investments = await db.Investment.findAll({
      where: {
        is_obsolate: false,
        type: 'approved',
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('DATE_ADD', Sequelize.col('date'), Sequelize.literal('INTERVAL lockPeriod MONTH')),
            {
              [Op.lte]: currentDate,
            }
          ),
        ],
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username'], // Include user ID and username
        },
      ],
    });

    if (investments.length > 0) {
      res.status(200).json(investments);
    } else {
      res.status(201).json({ message: 'No capital found that meet the criteria.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getVisibleUserInvestmentsAmount = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentDate = new Date();

    // Fetch all investments that match the criteria
    const investments = await db.Investment.findAll({
      where: {
        userId,
        is_obsolate: false,
        type: 'approved',
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('DATE_ADD', Sequelize.col('date'), Sequelize.literal('INTERVAL lockPeriod MONTH')),
            {
              [Op.lte]: currentDate,
            }
          ),
        ],
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username'], // Include user ID and username
        },
      ],
    });

    // Fetch approved withdrawals
    const approvedWithdrawals = await db.Withdraw.findAll({
      where: {
        userId,
        type: 'capital',
        status: 'approved', // Only approved withdrawals
      },
    });

    // Fetch pending withdrawals
    const pendingWithdrawals = await db.Withdraw.findAll({
      where: {
        userId,
        type: 'capital',
        status: 'pending', // Only pending withdrawals
      },
    });

    // Calculate the total capital from approved investments
    const totalCapital = investments.reduce((sum, investment) => sum + investment.capital, 0);

    // Calculate the total approved withdrawal amount
    const totalApprovedWithdrawals = approvedWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Calculate the total pending withdrawal amount
    const totalPendingWithdrawals = pendingWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Deduct approved withdrawals from total capital
    const finalCapital = totalCapital - totalApprovedWithdrawals - totalPendingWithdrawals;

    // if (investments.length > 0) {
      res.status(200).json({
        totalCapital: finalCapital.toFixed(2) || 0, // Final capital after approved withdrawal deduction
        totalApprovedWithdrawals: totalApprovedWithdrawals.toFixed(2) || 0, // Total approved withdrawals
        totalPendingWithdrawals: totalPendingWithdrawals.toFixed(2) || 0, // Total pending withdrawals
      });
    // } else {
    //   res.status(201).json({ message: 'No investments found that meet the criteria.' });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserTotalInterestAmount = async (req, res) => {

  try {
    const userId = req.user.id;

    const currentDate = new Date();

    // Fetch all investments that match the criteria
    const investments = await db.Investment.findAll({
      where: {
        userId,
        is_obsolate: false,
        type: 'approved',
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username'], // Include user ID and username
        },
      ],
    });

    // Fetch approved withdrawals
    const approvedWithdrawals = await db.Withdraw.findAll({
      where: {
        userId,
        type: 'interest',
        status: 'approved', // Only approved withdrawals
      },
    });

    // Fetch pending withdrawals
    const pendingWithdrawals = await db.Withdraw.findAll({
      where: {
        userId,
        type: 'interest',
        status: 'pending', // Only pending withdrawals
      },
    });

      const totalInterest = investments.reduce((sum, investment) => {
      const investmentDate = new Date(investment.date);
      const daysElapsed = Math.floor((currentDate - investmentDate) / (1000 * 60 * 60 * 24)) + 1;
      const dailyInterestRate = investment.interest_rate / 365 / 100;
      return sum + investment.capital * dailyInterestRate * daysElapsed;
    }, 0);

    // Calculate the total approved withdrawal amount
    const totalApprovedWithdrawals = approvedWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Calculate the total pending withdrawal amount
    const totalPendingWithdrawals = pendingWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Deduct approved withdrawals from total capital
    const finalInterest = totalInterest - totalApprovedWithdrawals - totalPendingWithdrawals;
    // // Deduct approved withdrawals from total capital

        const startOfMonth = Sequelize.literal("DATE_FORMAT(CURDATE() ,'%Y-%m-01')");
        const endOfMonth = Sequelize.literal("LAST_DAY(CURDATE())");

    const withdraws = await db.Withdraw.findAll({
      where: {
        date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
        type: 'interest',
        userId
      },
      include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'username'],  // Include user ID and username
          }]
    });

    // if (investments.length > 0) {
      res.status(200).json({
        totalInterest: finalInterest.toFixed(2) || 0, // Final capital after approved withdrawal deduction
        totalApprovedWithdrawals: totalApprovedWithdrawals.toFixed(2) || 0, // Total approved withdrawals
        totalPendingWithdrawals: totalPendingWithdrawals.toFixed(2) || 0, // Total pending withdrawals
        withdraws: withdraws || []
      });
    // } 
    // else {
    //   res.status(201).json({ message: 'No investments found that meet the criteria.' });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

export { addInvestment,getVisibleInvestments,getUserTotalInterestAmount,getVisibleInvestmentsAll,getVisibleUserInvestmentsAmount, getAllInvestment,getInvestmentByUserId, getInvestmentById , updateInvestment, deleteInvestment}

