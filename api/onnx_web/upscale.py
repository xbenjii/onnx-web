from basicsr.archs.rrdbnet_arch import RRDBNet
from basicsr.utils.download_util import load_file_from_url
from gfpgan import GFPGANer
from os import path
from PIL import Image
from realesrgan import RealESRGANer

import numpy as np

denoise_strength = 0.5
gfpgan_url = 'https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth'
resrgan_url = [
    'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth']
fp16 = False
model_name = 'RealESRGAN_x4plus'
netscale = 4
outscale = 4
pre_pad = 0
tile = 0
tile_pad = 10


def make_resrgan(model_path):
    model_path = path.join(model_path, model_name + '.pth')
    if not path.isfile(model_path):
        for url in resrgan_url:
            model_path = load_file_from_url(
                url=url, model_dir=path.join(model_path, model_name), progress=True, file_name=None)

    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64,
                    num_block=23, num_grow_ch=32, scale=4)

    dni_weight = None
    if model_name == 'realesr-general-x4v3' and denoise_strength != 1:
        wdn_model_path = model_path.replace(
            'realesr-general-x4v3', 'realesr-general-wdn-x4v3')
        model_path = [model_path, wdn_model_path]
        dni_weight = [denoise_strength, 1 - denoise_strength]

    upsampler = RealESRGANer(
        scale=netscale,
        model_path=model_path,
        dni_weight=dni_weight,
        model=model,
        tile=tile,
        tile_pad=tile_pad,
        pre_pad=pre_pad,
        half=fp16)

    return upsampler


def upscale_resrgan(source_image: Image, model_path: str, faces=True) -> Image:
    image = np.array(source_image)
    upsampler = make_resrgan(model_path)

    output, _ = upsampler.enhance(image, outscale=outscale)

    if faces:
        output = upscale_gfpgan(output, upsampler)

    return Image.fromarray(output, 'RGB')


def upscale_gfpgan(image, upsampler) -> Image:
    face_enhancer = GFPGANer(
        model_path=gfpgan_url,
        upscale=outscale,
        arch='clean',
        channel_multiplier=2,
        bg_upsampler=upsampler)

    _, _, output = face_enhancer.enhance(
        image, has_aligned=False, only_center_face=False, paste_back=True)

    return output