from sqlmodel import Field, SQLModel


class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str | None = Field(default=None, max_length=500)
    precio: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    # Ruta a la imagen almacenada localmente en la carpeta Assets
    imagen: str | None = Field(default=None)
    categoria_id: int | None = Field(default=None, foreign_key="categoria.id")
