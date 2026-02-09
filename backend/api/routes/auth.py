"""
Authentication API Routes

Endpoints:
- POST /api/auth/login - Admin login with JWT token
- POST /api/auth/logout - Invalidate session (client-side)
- GET /api/auth/verify - Verify JWT token validity
"""

from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from auth import (
    Token, 
    TokenData, 
    authenticate_admin, 
    create_access_token, 
    verify_token
)
from settings import get_settings


router = APIRouter()
security = HTTPBearer(auto_error=False)


# ============================================
# REQUEST/RESPONSE MODELS
# ============================================

class LoginRequest(BaseModel):
    """Login request body."""
    username: str
    password: str


class LoginResponse(BaseModel):
    """Login response with token."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    username: str


class VerifyResponse(BaseModel):
    """Token verification response."""
    valid: bool
    username: Optional[str] = None
    message: str


# ============================================
# ROUTES
# ============================================

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Admin login endpoint.
    
    Returns a JWT token that must be included in the Authorization header
    for all protected routes.
    
    Example:
    ```
    POST /api/auth/login
    {
        "username": "admin",
        "password": "admin123"
    }
    
    Response:
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
        "token_type": "bearer",
        "expires_in": 3600,
        "username": "admin"
    }
    ```
    
    Usage:
    Include the token in subsequent requests:
    ```
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
    ```
    """
    # Authenticate against environment variables
    if not authenticate_admin(request.username, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    settings = get_settings()
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": request.username}
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.jwt_access_token_expire_minutes * 60,
        username=request.username
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint.
    
    Note: JWT tokens are stateless, so the server cannot invalidate them.
    The client should:
    1. Remove the token from storage
    2. Optionally, the token can be added to a blacklist (not implemented)
    
    This endpoint is provided for API completeness.
    """
    return {
        "message": "Logged out successfully",
        "note": "Please remove the token from client storage"
    }


@router.get("/verify", response_model=VerifyResponse)
async def verify(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Verify if a JWT token is valid.
    
    Include the token in the Authorization header:
    ```
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
    ```
    
    Returns the validity status and username if valid.
    """
    if credentials is None:
        return VerifyResponse(
            valid=False,
            message="No token provided"
        )
    
    token_data = verify_token(credentials.credentials)
    
    if token_data is None:
        return VerifyResponse(
            valid=False,
            message="Invalid or expired token"
        )
    
    return VerifyResponse(
        valid=True,
        username=token_data.username,
        message="Token is valid"
    )
