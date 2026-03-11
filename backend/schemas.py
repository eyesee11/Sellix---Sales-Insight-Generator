from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    message: str = Field(
        example="Summary generated and sent to your inbox.",
        description="Human-readable result message.",
    )
    recipient: str = Field(
        example="ayushchauhan1164@gmail.com",
        description="The email address the summary was delivered to.",
    )
