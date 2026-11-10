from fastapi import APIRouter, HTTPException, status

from db.database import SessionDep
from dependencies.auth import AdminUser, CurrentUser, es_administrador
from schemas.pedido import PedidoEstadoUpdate
from services import pedido_service

router = APIRouter(tags=["Pedidos"], prefix="/pedidos")


@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_pedido(current_user: CurrentUser, session: SessionDep):
    # Convierte el carrito del usuario en un pedido y descuenta el stock
    pedido, error = pedido_service.crear_pedido_desde_carrito(current_user.id, session)

    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error
        )

    return pedido


@router.get("/mis-pedidos")
def mis_pedidos(current_user: CurrentUser, session: SessionDep):
    # Retorna el historial de pedidos del usuario autenticado
    return pedido_service.obtener_pedidos_usuario(current_user.id, session)


@router.get("/admin/todos")
def todos_los_pedidos(current_user: AdminUser, session: SessionDep):
    # Retorna todos los pedidos de todos los usuarios (solo para administradores)
    return pedido_service.obtener_todos_pedidos(session)


@router.get("/{pedido_id}")
def detalle_pedido(pedido_id: int, current_user: CurrentUser, session: SessionDep):
    # Retorna el detalle completo de un pedido con todos sus productos
    detalle = pedido_service.obtener_pedido(pedido_id, session)

    if detalle is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado"
        )

    if detalle["usuario_id"] != current_user.id and not es_administrador(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para consultar este pedido",
        )

    return detalle


@router.put("/{pedido_id}/estado")
def actualizar_estado(pedido_id: int, data: PedidoEstadoUpdate, current_user: AdminUser, session: SessionDep):
    # Actualiza el estado de un pedido (solo para administradores)
    pedido, error = pedido_service.actualizar_estado_pedido(pedido_id, data, session)

    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error
        )

    return pedido
