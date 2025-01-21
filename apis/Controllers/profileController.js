import db from '../../models/index.js';

const getProfile = async (req, res) => {
  const authuser = req.user;

  try {

    const user = await db.User.findByPk(authuser.id,{
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(401).json({ error: 'User Profile not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {getProfile};
