
export const requireInvestorRole = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    if (userRole && (userRole === 'investor' || userRole === 'admin')) {
      return next();
    } else {
      return res.status(403).json({ error: 'Access denied. You must be an investor or admin to access this resource.' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
