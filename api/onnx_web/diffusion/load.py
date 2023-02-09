from logging import getLogger
from typing import Any, Optional, Tuple

import numpy as np
from diffusers import DiffusionPipeline

from ..params import DeviceParams, Size
from ..utils import run_gc

logger = getLogger(__name__)

last_pipeline_instance: Any = None
last_pipeline_options: Tuple[
    Optional[DiffusionPipeline],
    Optional[str],
    Optional[str],
    Optional[str],
    Optional[bool],
] = (None, None, None, None, None)
last_pipeline_scheduler: Any = None

latent_channels = 4
latent_factor = 8


def get_latents_from_seed(seed: int, size: Size, batch: int = 1) -> np.ndarray:
    """
    From https://www.travelneil.com/stable-diffusion-updates.html.
    This one needs to use np.random because of the return type.
    """
    latents_shape = (
        batch,
        latent_channels,
        size.height // latent_factor,
        size.width // latent_factor,
    )
    rng = np.random.default_rng(seed)
    image_latents = rng.standard_normal(latents_shape).astype(np.float32)
    return image_latents


def get_tile_latents(
    full_latents: np.ndarray, dims: Tuple[int, int, int]
) -> np.ndarray:
    x, y, tile = dims
    t = tile // latent_factor
    x = x // latent_factor
    y = y // latent_factor
    xt = x + t
    yt = y + t

    return full_latents[:, :, y:yt, x:xt]


def load_pipeline(
    pipeline: DiffusionPipeline,
    model: str,
    scheduler: Any,
    device: DeviceParams,
    lpw: bool,
):
    global last_pipeline_instance
    global last_pipeline_scheduler
    global last_pipeline_options

    options = (pipeline, model, device.device, device.provider, lpw)
    if last_pipeline_instance is not None and last_pipeline_options == options:
        logger.debug("reusing existing diffusion pipeline")
        pipe = last_pipeline_instance
    else:
        logger.debug("unloading previous diffusion pipeline")
        last_pipeline_instance = None
        last_pipeline_scheduler = None
        run_gc()

        if lpw:
            custom_pipeline = "./onnx_web/diffusion/lpw_stable_diffusion_onnx.py"
        else:
            custom_pipeline = None

        logger.debug("loading new diffusion pipeline from %s", model)
        scheduler = scheduler.from_pretrained(
            model,
            provider=device.provider,
            provider_options=device.options,
            subfolder="scheduler",
        )
        pipe = pipeline.from_pretrained(
            model,
            custom_pipeline=custom_pipeline,
            provider=device.provider,
            provider_options=device.options,
            revision="onnx",
            safety_checker=None,
            scheduler=scheduler,
        )

        if device is not None and hasattr(pipe, "to"):
            pipe = pipe.to(device.torch_device())

        last_pipeline_instance = pipe
        last_pipeline_options = options
        last_pipeline_scheduler = scheduler

    if last_pipeline_scheduler != scheduler:
        logger.debug("loading new diffusion scheduler")
        scheduler = scheduler.from_pretrained(
            model,
            provider=device.provider,
            provider_options=device.options,
            subfolder="scheduler",
        )

        if device is not None and hasattr(scheduler, "to"):
            scheduler = scheduler.to(device)

        pipe.scheduler = scheduler
        last_pipeline_scheduler = scheduler
        run_gc()

    return pipe
