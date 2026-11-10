from sqlmodel import select

from core.security import hash_password, verify_password
from models.usuario import Usuario


def registrar_usuario(data, session):
    # Verifica que el username y el email no existan antes de crear el usuario
    usuario_por_username = session.exec(
        select(Usuario).where(Usuario.username == data.username)
    ).first()

    if usuario_por_username:
        return None, "El nombre de usuario ya está en uso"

    usuario_por_email = session.exec(
        select(Usuario).where(Usuario.email == data.email)
    ).first()

    if usuario_por_email:
        return None, "El correo electrónico ya está registrado"

    usuario = Usuario(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
    )

    session.add(usuario)
    session.commit()
    session.refresh(usuario)

    return usuario, None


def authenticar_usuario(username: str, password: str, session):
    # Busca el usuario por username y verifica que la contraseña sea correcta
    usuario = session.exec(select(Usuario).where(Usuario.username == username)).first()

    if usuario is None:
        return None

    if not verify_password(password, usuario.hashed_password):
        return None

    return usuario
