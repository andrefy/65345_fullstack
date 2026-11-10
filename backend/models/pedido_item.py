from sqlmodel import Field, SQLModel


class PedidoItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = Field(ge=1)
    # Se guarda el precio al momento de la compra para mantener el historial
    precio_unitario: float = Field(gt=0)
