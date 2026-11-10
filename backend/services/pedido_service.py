from sqlmodel import select

from models.carrito import Carrito
from models.carrito_item import CarritoItem
from models.pedido import Pedido
from models.pedido_item import PedidoItem
from models.producto import Producto
from schemas.pedido import PedidoEstadoUpdate


def crear_pedido_desde_carrito(usuario_id: int, session):
    # Obtiene el carrito del usuario para convertirlo en un pedido
    carrito = session.exec(
        select(Carrito).where(Carrito.usuario_id == usuario_id)
    ).first()

    if carrito is None:
        return None, "No tienes un carrito de compras"

    items = session.exec(
        select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)
    ).all()

    if not items:
        return None, "El carrito está vacío"

    # Primero valida el stock de todos los productos antes de crear el pedido
    total = 0.0
    for item in items:
        producto = session.get(Producto, item.producto_id)
        if producto is None:
            return None, f"El producto con id {item.producto_id} ya no existe"
        if producto.stock < item.cantidad:
            return None, f"Stock insuficiente para '{producto.nombre}'. Solo quedan {producto.stock} unidades"
        total += item.cantidad * producto.precio

    # Crea el pedido con el total calculado
    pedido = Pedido(usuario_id=usuario_id, total=round(total, 2))
    session.add(pedido)
    # Obtener el id sin confirmar todavía: toda la compra se guarda junta.
    session.flush()

    # Crea los items del pedido, descuenta el stock y limpia el carrito
    for item in items:
        producto = session.get(Producto, item.producto_id)

        pedido_item = PedidoItem(
            pedido_id=pedido.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=producto.precio,
        )
        session.add(pedido_item)

        # Descuenta el stock del producto
        producto.stock -= item.cantidad
        session.add(producto)

        # Elimina el item del carrito
        session.delete(item)

    session.commit()
    session.refresh(pedido)
    return pedido, None


def obtener_pedidos_usuario(usuario_id: int, session):
    # Retorna todos los pedidos del usuario ordenados por fecha (más reciente primero)
    return session.exec(
        select(Pedido).where(Pedido.usuario_id == usuario_id)
    ).all()


def obtener_pedido(pedido_id: int, session):
    # Busca un pedido por su id e incluye sus items con detalle del producto
    pedido = session.get(Pedido, pedido_id)
    if pedido is None:
        return None

    items = session.exec(
        select(PedidoItem).where(PedidoItem.pedido_id == pedido_id)
    ).all()

    items_detalle = []
    for item in items:
        producto = session.get(Producto, item.producto_id)
        nombre_producto = producto.nombre if producto else "Producto eliminado"
        items_detalle.append({
            "id": item.id,
            "producto_id": item.producto_id,
            "nombre_producto": nombre_producto,
            "cantidad": item.cantidad,
            "precio_unitario": item.precio_unitario,
            "subtotal": round(item.cantidad * item.precio_unitario, 2),
        })

    return {
        "id": pedido.id,
        "usuario_id": pedido.usuario_id,
        "fecha": pedido.fecha,
        "total": pedido.total,
        "estado": pedido.estado,
        "items": items_detalle,
    }


def actualizar_estado_pedido(pedido_id: int, data: PedidoEstadoUpdate, session):
    # Actualiza el estado de un pedido (solo para administradores)
    estados_validos = ["pendiente", "procesando", "enviado", "entregado"]
    if data.estado not in estados_validos:
        return None, f"Estado inválido. Los estados válidos son: {', '.join(estados_validos)}"

    pedido = session.get(Pedido, pedido_id)
    if pedido is None:
        return None, "Pedido no encontrado"

    pedido.estado = data.estado
    session.add(pedido)
    session.commit()
    session.refresh(pedido)
    return pedido, None


def obtener_todos_pedidos(session):
    # Retorna todos los pedidos de todos los usuarios (solo para administradores)
    return session.exec(select(Pedido)).all()
