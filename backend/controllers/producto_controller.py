from fastapi import APIRouter, HTTPException, Query, status

from db.database import SessionDep
from dependencies.auth import AdminUser
from schemas.producto import ProductoCreate, ProductoUpdate
from services import producto_service

router = APIRouter(tags=["Productos"], prefix="/productos")


@router.get("/")
def obtener_productos(session: SessionDep):
    # Retorna todos los productos del catálogo (no requiere autenticación)
    return producto_service.obtener_productos(session)


@router.get("/buscar")
def buscar_productos(termino: str = Query(min_length=1), *, session: SessionDep):
    # Busca productos por nombre o descripción usando el parámetro ?termino=
    return producto_service.buscar_productos(termino, session)


@router.get("/aleatorios")
def obtener_productos_aleatorios(
    cantidad: int = Query(default=4, ge=1, le=20), *, session: SessionDep
):
    # Retorna productos aleatorios del catálogo para mostrar en la landing page
    return producto_service.obtener_productos_aleatorios(cantidad, session)


@router.get("/categoria/{categoria_id}")
def obtener_productos_por_categoria(categoria_id: int, session: SessionDep):
    # Retorna todos los productos que pertenecen a una categoría específica
    return producto_service.obtener_productos_por_categoria(categoria_id, session)


@router.get("/{id}")
def obtener_producto(id: int, session: SessionDep):
    # Retorna el detalle de un producto por su id
    producto = producto_service.obtener_producto(id, session)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado"
        )

    return producto


@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, current_user: AdminUser, session: SessionDep):
    # Crea un nuevo producto (solo administrador)
    return producto_service.crear_producto(data, session)


@router.put("/{id}")
def actualizar_producto(id: int, data: ProductoUpdate, current_user: AdminUser, session: SessionDep):
    # Actualiza los datos de un producto existente (solo administrador)
    producto = producto_service.actualizar_producto(id, data, session)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado"
        )

    return producto


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def borrar_producto(id: int, current_user: AdminUser, session: SessionDep):
    # Elimina un producto por su id (solo administrador)
    producto = producto_service.borrar_producto(id, session)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado"
        )
