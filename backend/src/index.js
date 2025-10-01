// importar app
const app = require('./routes/app');

app.get('/', (req, res) => {
  res.send('Servidor funcionando ✅');
});

// inicializar servidor
app.listen(app.get("port"), () => {
    console.log("Servidor escuchando en el puerto", app.get("port"));
});
