from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from core.security import crear_token
from db.database import SessionDep
from dependencies.auth import CurrentUser, es_administrador
from schemas.usuario import UsuarioCreate
from services.usuario_service import authenticar_usuario, registrar_usuario

router = APIRouter(tags=["Autenticación"], prefix="/auth")


@router.post("/register", status_code=status.HTTP_201_CREATED)
def registrar(data: UsuarioCreate, session: SessionDep):
    # Registra un nuevo usuario si el username y el email no están en uso
    usuario, error = registrar_usuario(data, session)

    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error
        )

    return {"id": usuario.id, "username": usuario.username, "email": usuario.email}


@router.post("/login")
def login(data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    # Verifica las credenciales y devuelve un token JWT si son correctas
    usuario = authenticar_usuario(data.username, data.password, session)

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = crear_token({"sub": usuario.username})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def obtener_mi_perfil(current_user: CurrentUser):
    # Retorna la información del usuario que está autenticado
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "rol": "admin" if es_administrador(current_user) else "cliente",
    }
