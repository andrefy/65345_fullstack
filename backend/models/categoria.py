from sqlmodel import Field, SQLModel


class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100, unique=True)
    descripcion: str | None = Field(default=None, max_length=300)
