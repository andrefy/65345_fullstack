from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from sqlmodel import Session, SQLModel, create_engine

from core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)


@asynccontextmanager
async def crear_tablas(app: FastAPI):
    # Crea todas las tablas en la base de datos al iniciar la aplicación
    # Es importante que todos los modelos estén importados antes de esta línea
    SQLModel.metadata.create_all(engine)
    yield


def obtener_sesion():
    # Abre una sesión con la base de datos y la cierra al terminar la solicitud
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(obtener_sesion)]
