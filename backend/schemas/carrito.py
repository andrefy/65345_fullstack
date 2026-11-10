from sqlmodel import Field, SQLModel


class CarritoItemCreate(SQLModel):
    producto_id: int
    cantidad: int = Field(ge=1, default=1)


class CarritoItemUpdate(SQLModel):
    cantidad: int = Field(ge=1)
