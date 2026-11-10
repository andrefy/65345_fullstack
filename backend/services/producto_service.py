import random

from sqlmodel import or_, select

from models.producto import Producto
from schemas.producto import ProductoCreate, ProductoUpdate


def obtener_productos(session):
    # Retorna todos los productos registrados
    return session.exec(select(Producto)).all()


def obtener_producto(id: int, session):
    # Busca un producto por su id
    return session.get(Producto, id)


def buscar_productos(termino: str, session):
    # Busca productos cuyo nombre o descripción contengan el término de búsqueda
    return session.exec(
        select(Producto).where(
            or_(
                Producto.nombre.contains(termino),
                Producto.descripcion.contains(termino),
            )
        )
    ).all()


def obtener_productos_aleatorios(cantidad: int, session):
    # Obtiene todos los productos y selecciona una cantidad aleatoria
    todos = session.exec(select(Producto)).all()
    if len(todos) <= cantidad:
        return todos
    return random.sample(todos, cantidad)


def obtener_productos_por_categoria(categoria_id: int, session):
    # Filtra los productos que pertenecen a la categoría indicada
    return session.exec(
        select(Producto).where(Producto.categoria_id == categoria_id)
    ).all()


def crear_producto(data: ProductoCreate, session):
    # Crea un nuevo producto con los datos recibidos
    producto = Producto(**data.model_dump())
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def actualizar_producto(id: int, data: ProductoUpdate, session):
    # Actualiza solo los campos que se enviaron (los que no son None)
    producto = session.get(Producto, id)

    if producto is None:
        return None

    campos_a_actualizar = data.model_dump(exclude_none=True)
    for campo, valor in campos_a_actualizar.items():
        setattr(producto, campo, valor)

    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def borrar_producto(id: int, session):
    # Elimina el producto si existe
    producto = session.get(Producto, id)

    if producto is None:
        return None

    session.delete(producto)
    session.commit()
    return producto
