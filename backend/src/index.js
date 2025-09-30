// importar app
const app = require('./routes/app');


// inicializar servidor
app.listen(app.get("port"), () => {
    console.log("Servidor escuchando en el puerto", app.get("port"));
});
