from sqlmodel import SQLModel


class PedidoEstadoUpdate(SQLModel):
    # Estados válidos: pendiente, procesando, enviado, entregado
    estado: str
