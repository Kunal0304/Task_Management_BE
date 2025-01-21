import app from "./apis/app.js";
import db from "./models/index.js";
import logger from "./apis/utils/logger.js";

const PORT = process.env.PORT || 8900;

const startServer = async () => {
  try {
    await db.sequelize.sync();
    logger.info("Database Connected Successfully.");

    app.listen(PORT, () => {
      logger.info(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    logger.error("Unable to connect to the database:", { stack: error.stack });
  }
};

startServer();
