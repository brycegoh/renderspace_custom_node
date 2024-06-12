import base64
from io import BytesIO
from PIL import Image
import numpy as np
import torch

class RenderSpace:
    CATEGORY = "renderspace"

    @classmethod    
    def INPUT_TYPES(cls):
        return { "required":{"canvas_data": "BASE64"}}

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)
    FUNCTION = "func"

    def func(self, canvas_data):
        b64 = canvas_data.split(",")[1]
        image = Image.open(BytesIO(base64.b64decode(b64))).convert("RGB")
        
        image = np.array(image).astype(np.float32) / 255.0
        image = torch.from_numpy(image).unsqueeze(0)
        
        return (image,)
