from sqlmodel import Field, SQLModel


class Carrito(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # Cada usuario tiene un solo carrito (unique=True lo garantiza)
    usuario_id: int = Field(foreign_key="usuario.id", unique=True)
