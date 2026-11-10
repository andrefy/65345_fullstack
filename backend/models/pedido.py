from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Pedido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    total: float = Field(default=0.0)
    # Estados posibles: pendiente, procesando, enviado, entregado
    estado: str = Field(default="pendiente")
