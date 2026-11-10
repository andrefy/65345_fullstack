from fastapi import APIRouter, HTTPException, status

from db.database import SessionDep
from dependencies.auth import CurrentUser
from schemas.carrito import CarritoItemCreate, CarritoItemUpdate
from services import carrito_service

router = APIRouter(tags=["Carrito"], prefix="/carrito")


@router.get("/")
def ver_carrito(current_user: CurrentUser, session: SessionDep):
    # Muestra el contenido del carrito del usuario autenticado con el total
    return carrito_service.obtener_carrito_con_items(current_user.id, session)


@router.post("/items", status_code=status.HTTP_201_CREATED)
def agregar_al_carrito(data: CarritoItemCreate, current_user: CurrentUser, session: SessionDep):
    # Agrega un producto al carrito del usuario (si ya existe, suma la cantidad)
    carrito, error = carrito_service.agregar_item(current_user.id, data, session)

    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error
        )

    return carrito


@router.put("/items/{item_id}")
def actualizar_item_carrito(item_id: int, data: CarritoItemUpdate, current_user: CurrentUser, session: SessionDep):
    # Actualiza la cantidad de un producto en el carrito
    carrito, error = carrito_service.actualizar_item(item_id, data, current_user.id, session)

    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error
        )

    return carrito


@router.delete("/items/{item_id}", status_code=status.HTTP_200_OK)
def eliminar_item_carrito(item_id: int, current_user: CurrentUser, session: SessionDep):
    # Elimina un producto del carrito del usuario
    carrito = carrito_service.eliminar_item(item_id, current_user.id, session)

    if carrito is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item no encontrado en tu carrito"
        )

    return carrito
