from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY

password_hash = PasswordHash.recommended()


def hash_password(password: str):
    # Convierte la contraseña en texto plano a un hash seguro
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str):
    # Compara la contraseña ingresada con el hash guardado en la base de datos
    return password_hash.verify(password, hashed_password)


def crear_token(data: dict):
    # Genera un token JWT con los datos del usuario y una fecha de expiración
    contenido = data.copy()
    expiracion = datetime.now(timezone.utc) + timedelta(
        minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    contenido.update({"exp": expiracion})

    return jwt.encode(contenido, SECRET_KEY, algorithm=ALGORITHM)
