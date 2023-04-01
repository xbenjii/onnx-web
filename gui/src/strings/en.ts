export const I18N_STRINGS_EN = {
  en: {
    translation: {
      error: {
        inpaint: {
          support: 'This diffusion model may not support inpainting.',
        },
      },
      generate: 'Generate',
      highresMethod: {
        bilinear: 'Bilinear',
        lanczos: 'Lanczos',
        upscale: 'Upscaling',
      },
      history: {
        empty: 'No recent history. Press Generate to create an image.',
      },
      input: {
        image: {
          empty: 'Please select an image.',
          mask: 'Mask',
          source: 'Source',
        },
        list: {
          error: {
            specific: 'Error: {{message}}',
            unknown: 'Unknown Error',
          },
          idle: 'Idle?',
          loading: 'Loading...',
        },
        numeric: {
          error: {
            range: 'Out of range',
          },
        },
        prompt: {
          tokens: '{{tokens}} tokens, {{groups}} groups',
        },
      },
      loading: {
        cancel: 'Cancel',
        progress: '{{current}} of {{total}} steps',
        server: 'Connecting to server...',
        unknown: 'many',
      },
      mask: {
        fill: {
          black: 'Fill with black',
          white: 'Fill with white',
        },
        gray: {
          black: 'Gray to black',
          white: 'Gray to white',
        },
        // eslint-disable-next-line max-len
        help: 'Black pixels in the mask will stay the same, white pixels will be replaced. The masked pixels will be blended with the noise source before the diffusion model runs, giving it more variety to use.',
        invert: 'Invert',
      },
      maskFilter: {
        'gaussian-multiply': 'Gaussian Multiply',
        'gaussian-screen': 'Gaussian Screen',
        'none': 'None',
      },
      model: {
        '': 'None',
        // correction
        'correction-codeformer': 'CodeFormer',
        'correction-gfpgan-v1-3': 'GFPGAN v1.3',
        // diffusion
        'stable-diffusion-onnx-v1-4': 'Stable Diffusion v1.4',
        'stable-diffusion-onnx-v1-5': 'Stable Diffusion v1.5',
        'stable-diffusion-onnx-v1-inpainting': 'SD Inpainting v1',
        'stable-diffusion-onnx-v2-0': 'Stable Diffusion v2.0',
        'stable-diffusion-onnx-v2-1': 'Stable Diffusion v2.1',
        'stable-diffusion-onnx-v2-inpainting': 'SD Inpainting v2',
        // inversion
        'inversion-cubex': 'Cubex',
        'inversion-birb': 'Birb Style',
        'inversion-line-art': 'Line Art',
        'inversion-minecraft': 'Minecraft Concept',
        'inversion-ugly-sonic': 'Ugly Sonic',
        // upscaling
        'upscaling-real-esrgan-x2-plus': 'Real ESRGAN x2 Plus',
        'upscaling-real-esrgan-x4-plus': 'Real ESRGAN x4 Plus',
        'upscaling-real-esrgan-x4-v3': 'Real ESRGAN x4 v3',
        'upscaling-stable-diffusion-x4': 'Stable Diffusion x4',
        // extras
        'diffusion-stablydiffused-aesthetic-v2-6': 'Aesthetic Mix v2.6',
        'diffusion-anything': 'Anything',
        'diffusion-anything-v3': 'Anything v3',
        'diffusion-anything-v4': 'Anything v4',
        'diffusion-darkvictorian': 'Dark Victorian',
        'diffusion-dreamlike-photoreal': 'Dreamlike Photoreal',
        'diffusion-dreamlike-photoreal-v1': 'Dreamlike Photoreal 1.0',
        'diffusion-dreamlike-photoreal-v2': 'Dreamlike Photoreal 2.0',
        'diffusion-ghibli': 'Ghibli',
        'diffusion-knollingcase': 'Knollingcase',
        'diffusion-openjourney': 'OpenJourney',
        'diffusion-openjourney-v1': 'OpenJourney v1',
        'diffusion-openjourney-v2': 'OpenJourney v2',
        'diffusion-pastel-mix': 'Pastel Mix',
        'diffusion-unstable-ink-dream-v6': 'Unstable Ink Dream v6',
      },
      modelType: {
        correction: 'Correction Model',
        diffusion: 'Diffusion Model',
        inversion: 'Textual Inversion',
        lora: 'LoRA',
        upscaling: 'Upscaling Model',
      },
      noiseSource: {
        'fill-edge': 'Fill Edges',
        'fill-mask': 'Fill Masked',
        'gaussian': 'Gaussian Blur',
        'histogram': 'Histogram Noise',
        'normal': 'Gaussian Noise',
        'uniform': 'Uniform Noise',
      },
      parameter: {
        batch: 'Batch Size',
        brush: {
          color: 'Brush Color',
          size: 'Brush Size',
          strength: 'Brush Strength',
        },
        cfg: 'CFG',
        eta: 'Eta',
        fillColor: 'Fill Color',
        height: 'Height',
        highres: {
          label: 'Highres',
          method: 'Upscaler',
          scale: 'Scale',
          steps: 'Steps',
          strength: 'Strength',
        },
        lpw: 'Long Prompt Weighting',
        maskFilter: 'Mask Filter',
        noiseSource: 'Noise Source',
        negativePrompt: 'Negative Prompt',
        newSeed: 'New Seed',
        outpaint: {
          label: 'Outpaint',
          left: 'Left',
          right: 'Right',
          top: 'Top',
          bottom: 'Bottom',
        },
        platform: 'Platform',
        prompt: 'Prompt',
        scheduler: 'Scheduler',
        seed: 'Seed',
        size: 'Size',
        steps: 'Steps',
        strength: 'Strength',
        tileOrder: 'Tile Order',
        upscale: {
          label: 'Upscale',
          denoise: 'Denoise',
          scale: 'Scale',
          order: 'Upscale Order',
          outscale: 'Outscale',
        },
        width: 'Width',
        correction: {
          label: 'Face Correction',
          strength: 'Strength',
          outscale: 'Outscale',
        },
      },
      platform: {
        amd: 'AMD GPU',
        // eslint-disable-next-line id-blacklist
        any: 'Any Platform',
        cpu: 'CPU',
        cuda: 'CUDA',
        directml: 'DirectML',
        nvidia: 'Nvidia GPU',
        rocm: 'ROCm',
      },
      setting: {
        connectServer: 'Connect',
        history: 'Image History',
        loadState: 'Load',
        prompt: 'Default Prompt',
        reset: {
          all: 'Reset All',
          img2img: 'Reset Img2img',
          inpaint: 'Reset Inpaint',
          txt2img: 'Reset Txt2img',
        },
        scheduler: 'Default Scheduler',
        server: 'API Server',
        state: 'Client State',
      },
      scheduler: {
        'ddim': 'DDIM',
        'ddpm': 'DDPM',
        'deis-multi': 'DEIS Multistep',
        'dpm-multi': 'DPM Multistep',
        'dpm-single': 'DPM Singlestep',
        'euler': 'Euler',
        'euler-a': 'Euler Ancestral',
        'heun': 'Heun',
        'k-dpm-2-a': 'KDPM2 Ancestral',
        'k-dpm-2': 'KDPM2',
        'karras-ve': 'Karras Ve',
        'ipndm': 'iPNDM',
        'lms-discrete': 'LMS',
        'pndm': 'PNDM',
        'unipc-multi': 'UniPC Multistep',
      },
      tab: {
        blend: 'Blend',
        img2img: 'Img2img',
        inpaint: 'Inpaint',
        txt2txt: 'Txt2txt',
        txt2img: 'Txt2img',
        upscale: 'Upscale',
      },
      tileOrder: {
        grid: 'Grid',
        spiral: 'Spiral',
      },
      tooltip: {
        delete: 'Delete',
        next: 'Next',
        previous: 'Previous',
        retry: 'Retry',
        save: 'Save',
      },
      upscaleOrder: {
        'correction-both': 'Correction Both',
        'correction-first': 'Correction First',
        'correction-last': 'Correction Last',
      },
    }
  },
};
