export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Dirección del backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
