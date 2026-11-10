from sqlmodel import Field, SQLModel


class CarritoItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = Field(ge=1, default=1)
