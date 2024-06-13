import base64
from io import BytesIO
from PIL import Image
import numpy as np
import torch
import cv2

COLORS = [
    (120, 120, 120),
(180, 120, 120),
(6, 230, 230),
(80, 50, 50),
(4, 200, 3),
(120, 120, 80),
(140, 140, 140),
(204, 5, 255),
(230, 230, 230),
(4, 250, 7),
(224, 5, 255),
(235, 255, 7),
(150, 5, 61),
(120, 120, 70),
(8, 255, 51),
(255, 6, 82),
(143, 255, 140),
(204, 255, 4),
(255, 51, 7),
(204, 70, 3),
(0, 102, 200),
(61, 230, 250),
(255, 6, 51),
(11, 102, 255),
(255, 7, 71),
(255, 9, 224),
(9, 7, 230),
(220, 220, 220),
(255, 9, 92),
(112, 9, 255),
(8, 255, 214),
(7, 255, 224),
(255, 184, 6),
(10, 255, 71),
(255, 41, 10),
(7, 255, 255),
(224, 255, 8),
(102, 8, 255),
(255, 61, 6),
(255, 194, 7),
(255, 122, 8),
(0, 255, 20),
(255, 8, 41),
(255, 5, 153),
(6, 51, 255),
(235, 12, 255),
(160, 150, 20),
(0, 163, 255),
(140, 140, 140),
(250, 10, 15),
(20, 255, 0),
(31, 255, 0),
(255, 31, 0),
(255, 224, 0),
(153, 255, 0),
(0, 0, 255),
(255, 71, 0),
(0, 235, 255),
(0, 173, 255),
(31, 0, 255),
(11, 200, 200),
(255 ,82, 0),
(0, 255, 245),
(0, 61, 255),
(0, 255, 112),
(0, 255, 133),
(255, 0, 0),
(255, 163, 0),
(255, 102, 0),
(194, 255, 0),
(0, 143, 255),
(51, 255, 0),
(0, 82, 255),
(0, 255, 41),
(0, 255, 173),
(10, 0, 255),
(173, 255, 0),
(0, 255, 153),
(255, 92, 0),
(255, 0, 255),
(255, 0, 245),
(255, 0, 102),
(255, 173, 0),
(255, 0, 20),
(255, 184, 184),
(0, 31, 255),
(0, 255, 61),
(0, 71, 255),
(255, 0, 204),
(0, 255, 194),
(0, 255, 82),
(0, 10, 255),
(0, 112, 255),
(51, 0, 255),
(0, 194, 255),
(0, 122, 255),
(0, 255, 163),
(255, 153, 0),
(0, 255, 10),
(255, 112, 0),
(143, 255, 0),
(82, 0, 255),
(163, 255, 0),
(255, 235, 0),
(8, 184, 170),
(133, 0, 255),
(0, 255, 92),
(184, 0, 255),
(255, 0, 31),
(0, 184, 255),
(0, 214, 255),
(255, 0, 112),
(92, 255, 0),
(0, 224, 255),
(112, 224, 255),
(70, 184, 160),
(163, 0, 255),
(153, 0, 255),
(71, 255, 0),
(255, 0, 163),
(255, 204, 0),
(255, 0, 143),
(0, 255, 235),
(133, 255, 0),
(255, 0, 235),
(245, 0, 255),
(255, 0, 122),
(255, 245, 0),
(10, 190, 212),
(214, 255, 0),
(0, 204, 255),
(20, 0, 255),
(255, 255, 0),
(0, 153, 255),
(0, 41, 255),
(0, 255, 204),
(41, 0, 255),
(41, 255, 0),
(173, 0, 255),
(0, 245, 255),
(71, 0, 255),
(122, 0, 255),
(0, 255, 184),
(0, 92, 255),
(184, 255, 0),
(0, 133, 255),
(255, 214, 0),
(25, 194, 194),
(102, 255, 0),
(92, 0, 255),
]

BLACK = np.array([0, 0, 0])
WHITE = np.array([255, 255, 255])

def color_distance(c1, c2):
    return np.linalg.norm(c1 - c2)

def is_valid_color(color):
    return any(np.array_equal(color, valid_color) for valid_color in COLORS)

def get_surrounding_valid_pixels(array, x, y):
    height, width, _ = array.shape
    valid_pixels = []
    for i in range(max(0, x-1), min(height, x+2)):
        for j in range(max(0, y-1), min(width, y+2)):
            if (i, j) != (x, y) and is_valid_color(array[i, j]):
                valid_pixels.append(array[i, j])
    return valid_pixels

def find_closest_color(color, valid_colors):
    if not valid_colors:
        return color # Return the original color if no valid colors are found
    distances = [color_distance(color, vc) for vc in valid_colors]
    closest_color_index = np.argmin(distances)
    return valid_colors[closest_color_index]

def replace_invalid_colors(array):
    height, width, _ = array.shape
    new_array = array.copy()
    for x in range(height):
        for y in range(width):
            if not is_valid_color(array[x, y]):
                surrounding_valid_colors = get_surrounding_valid_pixels(array, x, y)
                new_array[x, y] = find_closest_color(array[x, y], surrounding_valid_colors)
    return new_array

def find_and_draw_contours(np_image):
    contour_image = np_image.copy()
    
    unique_colors = {tuple(color) for color in np_image.reshape(-1, np_image.shape[-1])}
    unique_colors.discard(tuple(BLACK))
    unique_colors.discard(tuple(WHITE))
    
    for color in unique_colors:
        color = np.array(color, dtype=np.uint8)
        mask = cv2.inRange(np_image, color, color)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cv2.drawContours(contour_image, contours, -1, (0, 0, 0), 3)
    
    return contour_image

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
        np_image = np.array(image)        
        np_image = replace_invalid_colors(np_image)
        np_image = find_and_draw_contours(np_image)

        image = np_image.astype(np.float32) / 255.0
        image = torch.from_numpy(image).unsqueeze(0)
        
        return (image,)