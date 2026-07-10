const app = require('../dist/app').default;

let handler;
async function getHandler() {
  if (!handler) {
    const { initDatabase } = require('../dist/config/database');
    await initDatabase();
    handler = app;
  }
  return handler;
}

module.exports = async (req, res) => {
  const h = await getHandler();
  return h(req, res);
};
