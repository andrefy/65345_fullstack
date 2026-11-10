from fastapi import APIRouter, HTTPException, status

from db.database import SessionDep
from dependencies.auth import AdminUser
from schemas.categoria import CategoriaCreate, CategoriaUpdate
from services import categoria_service

router = APIRouter(tags=["Categorías"], prefix="/categorias")


@router.get("/")
def obtener_categorias(session: SessionDep):
    # Retorna todas las categorías (no requiere autenticación)
    return categoria_service.obtener_categorias(session)


@router.get("/{id}")
def obtener_categoria(id: int, session: SessionDep):
    # Retorna una categoría por su id
    categoria = categoria_service.obtener_categoria(id, session)

    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )

    return categoria


@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, current_user: AdminUser, session: SessionDep):
    # Crea una nueva categoría (solo administrador)
    return categoria_service.crear_categoria(data, session)


@router.put("/{id}")
def actualizar_categoria(id: int, data: CategoriaUpdate, current_user: AdminUser, session: SessionDep):
    # Actualiza los datos de una categoría existente (solo administrador)
    categoria = categoria_service.actualizar_categoria(id, data, session)

    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )

    return categoria


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def borrar_categoria(id: int, current_user: AdminUser, session: SessionDep):
    # Elimina una categoría por su id (solo administrador)
    categoria = categoria_service.borrar_categoria(id, session)

    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )
