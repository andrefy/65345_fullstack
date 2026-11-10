from sqlmodel import select

from models.categoria import Categoria
from schemas.categoria import CategoriaCreate, CategoriaUpdate


def obtener_categorias(session):
    # Retorna todas las categorías registradas
    return session.exec(select(Categoria)).all()


def obtener_categoria(id: int, session):
    # Busca una categoría por su id
    return session.get(Categoria, id)


def crear_categoria(data: CategoriaCreate, session):
    # Crea una nueva categoría con los datos recibidos
    categoria = Categoria(**data.model_dump())
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def actualizar_categoria(id: int, data: CategoriaUpdate, session):
    # Actualiza solo los campos que se enviaron (los que no son None)
    categoria = session.get(Categoria, id)

    if categoria is None:
        return None

    campos_a_actualizar = data.model_dump(exclude_none=True)
    for campo, valor in campos_a_actualizar.items():
        setattr(categoria, campo, valor)

    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def borrar_categoria(id: int, session):
    # Elimina la categoría si existe
    categoria = session.get(Categoria, id)

    if categoria is None:
        return None

    session.delete(categoria)
    session.commit()
    return categoria
