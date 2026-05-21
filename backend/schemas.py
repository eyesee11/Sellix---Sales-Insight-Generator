from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UploadResponse(BaseModel):
    message: str = Field(
        example="Summary generated and sent to your inbox.",
        description="Human-readable result message.",
    )
    recipient: str = Field(
        example="ayushchauhan1164@gmail.com",
        description="The email address the summary was delivered to.",
    )
