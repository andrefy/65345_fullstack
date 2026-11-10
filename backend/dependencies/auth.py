from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from core.config import ALGORITHM, SECRET_KEY
from db.database import SessionDep
from models.usuario import Usuario
from sqlmodel import select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def obtener_usuario_actual(
    token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep
):
    # Decodifica el token JWT y devuelve el usuario si el token es válido
    error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise error
    except jwt.InvalidTokenError:
        raise error

    usuario = session.exec(select(Usuario).where(Usuario.username == username)).first()
    if usuario is None:
        raise error

    return usuario


CurrentUser = Annotated[Usuario, Depends(obtener_usuario_actual)]


def es_administrador(usuario: Usuario):
    """
    Solo andres_yajamin tiene el rol de administrador
    """
    return usuario.username == "andres_yajamin"


def requerir_administrador(current_user: CurrentUser):
    """
    Impedir el acceso a usuarios que no son administradores
    """
    if not es_administrador(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo el administrador puede realizar esta acción",
        )
    return current_user


AdminUser = Annotated[Usuario, Depends(requerir_administrador)]
