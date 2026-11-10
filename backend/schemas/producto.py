from sqlmodel import Field, SQLModel


class ProductoCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=500)
    precio: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    imagen: str | None = Field(default=None)
    categoria_id: int | None = Field(default=None)


class ProductoUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=500)
    precio: float | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    imagen: str | None = Field(default=None)
    categoria_id: int | None = Field(default=None)
