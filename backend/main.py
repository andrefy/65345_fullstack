from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from controllers.auth_controller import router as auth_router
from controllers.carrito_controller import router as carrito_router
from controllers.categoria_controller import router as categoria_router
from controllers.pedido_controller import router as pedido_router
from controllers.producto_controller import router as producto_router
from db.database import crear_tablas

# Es necesario importar todos los modelos para que SQLModel pueda crear las tablas
import models.usuario  # noqa: F401
import models.categoria  # noqa: F401
import models.producto  # noqa: F401
import models.carrito  # noqa: F401
import models.carrito_item  # noqa: F401
import models.pedido  # noqa: F401
import models.pedido_item  # noqa: F401

app = FastAPI(
    title="Tienda Virtual API",
    description="Backend para la tienda virtual con FastAPI, SQLModel y SQLite",
    version="1.0.0",
    lifespan=crear_tablas,
)

# Configura CORS para permitir que el frontend se comunique con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sirve las imágenes de productos desde la carpeta Assets
app.mount("/assets", StaticFiles(directory="Assets"), name="assets")

# Registra todos los routers de la aplicación
app.include_router(auth_router)
app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(carrito_router)
app.include_router(pedido_router)


@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a la API de la Tienda Virtual"}
