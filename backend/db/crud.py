from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .models import User
from .schemas import UserCreate, UserOAuthCreate
import uuid
from typing import Optional, Union

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Fetch a user by email.
    """
    return db.query(User).filter(User.email == email).first()


def create_user(
    db: Session,
    user_data: UserCreate,
    hashed_password: Optional[str] = None,
    verification_token: Optional[str] = None,
    is_verified: bool = False
) -> User:
    """
    Create a new user in the database.
    Handles both:
        - Regular (email/password) registration
        - Social login (Google, etc.), where password may be None
    """

    db_user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        verification_token=verification_token,
        is_verified=is_verified
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_regular_user(db: Session, user_data: UserCreate, generate_verification_token) -> User:
    """
    Wrapper to create a regular (email/password) user.
    Handles hashing the password and generating a verification token.
    """
    hashed_password = pwd_context.hash(user_data.password)
    verification_token = generate_verification_token()

    return create_user(
        db=db,
        user_data=user_data,
        hashed_password=hashed_password,
        verification_token=verification_token,
        is_verified=False  # Not verified until email confirmation
    )



def create_social_user(db: Session, user_data: UserOAuthCreate) -> User:
    """
    Create a social login user (e.g., Google OAuth) who is automatically verified.
    """
    db_user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        full_name=user_data.full_name,
        oauth_provider=user_data.oauth_provider,
        oauth_id=user_data.oauth_id,
        is_verified=True  # Social login users are auto-verified
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_email(db: Session, token: str) -> Optional[User]:
    """
    Verify a user's email using a verification token.
    """
    user = db.query(User).filter(User.verification_token == token).first()
    if user:
        user.is_verified = True
        user.verification_token = None
        db.commit()
        db.refresh(user)
    return user


def get_user_by_verification_token(db: Session, token: str) -> Optional[User]:
    """
    Fetch a user by their email verification token.
    """
    return db.query(User).filter(User.verification_token == token).first()

