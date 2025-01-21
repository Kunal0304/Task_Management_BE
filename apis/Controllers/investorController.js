import db from '../../models/index.js';

const getAllUsersWithInvestments = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: {
        is_obsolate: false,
        role: 'investor',
      },
      include: [
        {
          model: db.Investment,
          as: 'investments',
          attributes: ['id', 'capital', 'interest_rate', 'type', 'date'],
        },
      ],
    });

    const usersWithTotal = users.map(user => {
      // Calculate total capital, interest, and daily interest for only "approved" investments
      const approvedInvestments = user.investments.filter(investment => investment.type === 'approved');

      const totalCapital = approvedInvestments.reduce((sum, investment) => sum + investment.capital, 0);

      const currentDate = new Date();

      const totalInterest = approvedInvestments.reduce((sum, investment) => {
        const investmentDate = new Date(investment.date);

        // Calculate the number of days the investment has been active
        const daysElapsed = Math.floor((currentDate - investmentDate) / (1000 * 60 * 60 * 24)) + 1;

        // Calculate daily interest rate from the yearly interest rate
        const dailyInterestRate = investment.interest_rate / 365 / 100;

        // Calculate interest for this investment based on the days elapsed
        const interestForThisInvestment = investment.capital * dailyInterestRate * daysElapsed;

        return sum + interestForThisInvestment;
      }, 0);

      const dayInterest = approvedInvestments.reduce((sum, investment) => {
        const dailyInterestRate = investment.interest_rate / 365 / 100;
        const interestForThisInvestment = investment.capital * dailyInterestRate;
        return sum + interestForThisInvestment;
      }, 0);

      return {
        id: user.id,
        userId: user.userId,
        username: user.username,
        password: user.password,
        mobile_no: user.mobile_no,
        email: user.email,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        gender: user.gender,
        age: user.age,
        config: user.config,
        totalCapital: totalCapital.toFixed(2) || 0,
        totalInterest: totalInterest.toFixed(2) || 0,
        day_interest: dayInterest.toFixed(2) || 0,
      };
    });

    res.json(usersWithTotal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserWithInvestmentsById = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.User.findOne({
      where: {
        id: userId,
        is_obsolate: false,
        role: 'investor',
      },
      include: [
        {
          model: db.Investment,
          as: 'investments',
          attributes: ['capital', 'interest_rate', 'type', 'date'],
          where: {
            type: 'approved',
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User Investments not found' });
    }

    const totalCapital = user.investments.reduce((sum, investment) => sum + investment.capital, 0);

    const currentDate = new Date();

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

    const totalInterest = user.investments.reduce((sum, investment) => {
      const investmentDate = new Date(investment.date);
      const daysElapsed = Math.floor((currentDate - investmentDate) / (1000 * 60 * 60 * 24)) + 1;
      const dailyInterestRate = investment.interest_rate / 365 / 100;
      return sum + investment.capital * dailyInterestRate * daysElapsed;
    }, 0);

    const monthlyInterest = user.investments.reduce((sum, investment) => {
      const monthlyInterestRate = investment.interest_rate / 12 / 100;
      return sum + investment.capital * monthlyInterestRate;
    }, 0);

    const averageInterestRate = user.investments.reduce((sum, investment) => sum + investment.interest_rate, 0) / user.investments.length || 0;

    // Calculate the total daily interest across all investments
    const dayInterest = user.investments.reduce((sum, investment) => {
      const dailyInterestRate = investment.interest_rate / 365 / 100;
      return sum + investment.capital * dailyInterestRate;
    }, 0);

    // Calculate the total approved withdrawal amount
    const totalApprovedWithdrawals = approvedWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Calculate the total pending withdrawal amount
    const totalPendingWithdrawals = pendingWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    // Deduct approved withdrawals from total capital
    const finalInterest = totalInterest - totalApprovedWithdrawals - totalPendingWithdrawals;


    const userWithTotal = {
      id: user.id,
      userId: user.userId,
      username: user.username,
      mobile_no: user.mobile_no,
      email: user.email,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      gender: user.gender,
      age: user.age,
      config: user.config,
      totalCapital: totalCapital.toFixed(2),
      totalInterest: finalInterest.toFixed(2),
      monthly_interest: monthlyInterest.toFixed(2),
      interest_rate: averageInterestRate.toFixed(2),
      day_interest: dayInterest.toFixed(2),
    };

    res.json(userWithTotal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {getAllUsersWithInvestments, getUserWithInvestmentsById}
