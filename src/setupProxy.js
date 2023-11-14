const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/api", { target: "http://127.0.0.1:8484", changeOrigin: true })
  );
  app.use(
    proxy("/v1", { target: "https://api.snapscore.dev", changeOrigin: true })
  );
  app.use(
    proxy("/data", { target: "http://127.0.0.1:8484", changeOrigin: true })
  );
  app.use(
    proxy("/mapping", { target: "http://127.0.0.1:8484", changeOrigin: true })
  );
};
