from sqlmodel import Field, SQLModel


class UsuarioCreate(SQLModel):
    username: str = Field(min_length=3, max_length=50)
    email: str
    password: str = Field(min_length=6)
