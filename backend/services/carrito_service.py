from sqlmodel import select

from models.carrito import Carrito
from models.carrito_item import CarritoItem
from models.producto import Producto
from schemas.carrito import CarritoItemCreate, CarritoItemUpdate


def obtener_o_crear_carrito(usuario_id: int, session):
    # Busca el carrito del usuario; si no tiene uno, lo crea automáticamente
    carrito = session.exec(
        select(Carrito).where(Carrito.usuario_id == usuario_id)
    ).first()

    if carrito is None:
        carrito = Carrito(usuario_id=usuario_id)
        session.add(carrito)
        session.commit()
        session.refresh(carrito)

    return carrito


def obtener_carrito_con_items(usuario_id: int, session):
    # Obtiene el carrito y construye la lista de items con información del producto
    carrito = obtener_o_crear_carrito(usuario_id, session)

    items = session.exec(
        select(CarritoItem).where(CarritoItem.carrito_id == carrito.id)
    ).all()

    total = 0.0
    items_detalle = []

    for item in items:
        producto = session.get(Producto, item.producto_id)
        if producto:
            subtotal = item.cantidad * producto.precio
            total += subtotal
            items_detalle.append({
                "id": item.id,
                "producto_id": item.producto_id,
                "nombre_producto": producto.nombre,
                "precio_unitario": producto.precio,
                "imagen": producto.imagen,
                "cantidad": item.cantidad,
                "subtotal": subtotal,
            })

    return {
        "carrito_id": carrito.id,
        "items": items_detalle,
        "total": round(total, 2),
    }


def agregar_item(usuario_id: int, data: CarritoItemCreate, session):
    # Agrega un producto al carrito; si ya existe, aumenta la cantidad
    producto = session.get(Producto, data.producto_id)
    if producto is None:
        return None, "Producto no encontrado"

    carrito = obtener_o_crear_carrito(usuario_id, session)

    # Verifica si el producto ya está en el carrito
    item_existente = session.exec(
        select(CarritoItem).where(
            CarritoItem.carrito_id == carrito.id,
            CarritoItem.producto_id == data.producto_id,
        )
    ).first()

    if item_existente:
        nueva_cantidad = item_existente.cantidad + data.cantidad
        # Verifica que haya stock suficiente
        if nueva_cantidad > producto.stock:
            return None, f"Stock insuficiente. Solo hay {producto.stock} unidades disponibles"
        item_existente.cantidad = nueva_cantidad
        session.add(item_existente)
    else:
        # Verifica que haya stock antes de agregar el item
        if data.cantidad > producto.stock:
            return None, f"Stock insuficiente. Solo hay {producto.stock} unidades disponibles"
        nuevo_item = CarritoItem(
            carrito_id=carrito.id,
            producto_id=data.producto_id,
            cantidad=data.cantidad,
        )
        session.add(nuevo_item)

    session.commit()
    return obtener_carrito_con_items(usuario_id, session), None


def actualizar_item(item_id: int, data: CarritoItemUpdate, usuario_id: int, session):
    # Actualiza la cantidad de un item del carrito
    carrito = obtener_o_crear_carrito(usuario_id, session)

    item = session.exec(
        select(CarritoItem).where(
            CarritoItem.id == item_id,
            CarritoItem.carrito_id == carrito.id,
        )
    ).first()

    if item is None:
        return None, "Item no encontrado en tu carrito"

    producto = session.get(Producto, item.producto_id)
    if data.cantidad > producto.stock:
        return None, f"Stock insuficiente. Solo hay {producto.stock} unidades disponibles"

    item.cantidad = data.cantidad
    session.add(item)
    session.commit()

    return obtener_carrito_con_items(usuario_id, session), None


def eliminar_item(item_id: int, usuario_id: int, session):
    # Elimina un item del carrito del usuario
    carrito = obtener_o_crear_carrito(usuario_id, session)

    item = session.exec(
        select(CarritoItem).where(
            CarritoItem.id == item_id,
            CarritoItem.carrito_id == carrito.id,
        )
    ).first()

    if item is None:
        return None

    session.delete(item)
    session.commit()
    return obtener_carrito_con_items(usuario_id, session)
