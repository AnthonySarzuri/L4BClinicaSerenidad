const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pacientesRoutes = require("./routes/pacientes");
const terapeutasRoutes = require("./routes/terapeutas");
const historialesRoutes = require("./routes/historiales");
const User = require("./models/User"); // Modelo de usuario

const app = express();

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para manejar datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Flash messages
app.use(flash());

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport estrategia local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // El campo del formulario que contiene el correo
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findByEmail(email); // Método para buscar usuario por email
        if (!user)
          return done(null, false, { message: "Usuario no encontrado" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
          return done(null, false, { message: "Contraseña incorrecta" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.user_id)); // Cambia a user.user_id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Método para buscar usuario por ID
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Rutas protegidas
app.use("/pacientes", isAuthenticated, pacientesRoutes);
app.use("/terapeutas", isAuthenticated, terapeutasRoutes);
app.use("/historiales", isAuthenticated, historialesRoutes);

// Ruta principal redirige a welcome si está autenticado
app.get("/", isAuthenticated, (req, res) => {
  res.redirect("/welcome");
});

// Ruta para mostrar el login
app.get("/login", (req, res) => res.render("login"));

// Ruta para mostrar la página de bienvenida
app.get("/welcome", isAuthenticated, (req, res) =>
  res.render("welcome", { user: req.user })
);

// Ruta para mostrar el registro
app.get("/register", (req, res) => res.render("register"));

// Ruta para manejar el inicio de sesión
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/welcome", // Redirige al dashboard o página de bienvenida
    failureRedirect: "/login", // Redirige de nuevo al login si falla
    failureFlash: true, // Muestra mensajes de error
  })
);

// Ruta para manejar el registro de usuarios
app.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create(username, email, hashedPassword, role);
    req.flash("success_msg", "Registro exitoso, ahora puedes iniciar sesión");
    res.redirect("/login");
  } catch (error) {
    console.error("Error en registro:", error); // Captura detallada del error
    req.flash("error_msg", "Error al registrar usuario");
    res.redirect("/register");
  }
});

// Ruta para cerrar sesión
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "Sesión cerrada correctamente");
    res.redirect("/login");
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Por favor inicia sesión");
  res.redirect("/login");
}

// Middleware para verificar roles
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    req.flash("error_msg", "No tienes permiso para acceder a esta página");
    res.redirect("/");
  };
}
