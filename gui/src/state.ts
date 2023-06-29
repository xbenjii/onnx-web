/* eslint-disable max-lines */
/* eslint-disable no-null/no-null */
import { Maybe } from '@apextoaster/js-utils';
import { PaletteMode } from '@mui/material';
import { Logger } from 'noicejs';
import { createContext } from 'react';
import { StateCreator, StoreApi } from 'zustand';

import {
  ApiClient,
  BaseImgParams,
  BlendParams,
  BrushParams,
  HighresParams,
  ImageResponse,
  Img2ImgParams,
  InpaintParams,
  ModelParams,
  OutpaintPixels,
  ReadyResponse,
  RetryParams,
  Txt2ImgParams,
  UpscaleParams,
  UpscaleReqParams,
} from './client/types.js';
import { Config, ConfigFiles, ConfigState, ServerParams } from './config.js';
import { CorrectionModel, DiffusionModel, ExtraNetwork, ExtraSource, ExtrasFile, UpscalingModel } from './types.js';

export const MISSING_INDEX = -1;

export type Theme = PaletteMode | ''; // tri-state, '' is unset

/**
 * Combine optional files and required ranges.
 */
export type TabState<TabParams> = ConfigFiles<Required<TabParams>> & ConfigState<Required<TabParams>>;

interface HistoryItem {
  image: ImageResponse;
  ready: Maybe<ReadyResponse>;
  retry: RetryParams;
}

interface BrushSlice {
  brush: BrushParams;

  setBrush(brush: Partial<BrushParams>): void;
}

interface DefaultSlice {
  defaults: TabState<BaseImgParams>;
  theme: Theme;

  setDefaults(param: Partial<BaseImgParams>): void;
  setTheme(theme: Theme): void;
}

interface ExtraSlice {
  extras: ExtrasFile;

  setExtras(extras: Partial<ExtrasFile>): void;

  setCorrectionModel(model: CorrectionModel): void;
  setDiffusionModel(model: DiffusionModel): void;
  setExtraNetwork(model: ExtraNetwork): void;
  setExtraSource(model: ExtraSource): void;
  setUpscalingModel(model: UpscalingModel): void;

  removeCorrectionModel(model: CorrectionModel): void;
  removeDiffusionModel(model: DiffusionModel): void;
  removeExtraNetwork(model: ExtraNetwork): void;
  removeExtraSource(model: ExtraSource): void;
  removeUpscalingModel(model: UpscalingModel): void;
}

interface HistorySlice {
  history: Array<HistoryItem>;
  limit: number;

  pushHistory(image: ImageResponse, retry: RetryParams): void;
  removeHistory(image: ImageResponse): void;
  setLimit(limit: number): void;
  setReady(image: ImageResponse, ready: ReadyResponse): void;
}

interface ModelSlice {
  model: ModelParams;

  setModel(model: Partial<ModelParams>): void;
}

// #region tab slices
interface Txt2ImgSlice {
  txt2img: TabState<Txt2ImgParams>;

  setTxt2Img(params: Partial<Txt2ImgParams>): void;
  resetTxt2Img(): void;
}

interface Img2ImgSlice {
  img2img: TabState<Img2ImgParams>;

  setImg2Img(params: Partial<Img2ImgParams>): void;
  resetImg2Img(): void;
}

interface InpaintSlice {
  inpaint: TabState<InpaintParams>;

  setInpaint(params: Partial<InpaintParams>): void;
  resetInpaint(): void;
}

interface OutpaintSlice {
  outpaint: OutpaintPixels;

  setOutpaint(pixels: Partial<OutpaintPixels>): void;
}

interface HighresSlice {
  highres: HighresParams;

  setHighres(params: Partial<HighresParams>): void;
  resetHighres(): void;
}

interface UpscaleSlice {
  upscale: UpscaleParams;
  upscaleTab: TabState<UpscaleReqParams>;

  setUpscale(upscale: Partial<UpscaleParams>): void;
  setUpscaleTab(params: Partial<UpscaleReqParams>): void;
  resetUpscaleTab(): void;
}

interface BlendSlice {
  blend: TabState<BlendParams>;

  setBlend(blend: Partial<BlendParams>): void;
  resetBlend(): void;
}

interface ResetSlice {
  resetAll(): void;
}

interface PromptSlice {
  prompts: Array<string>;

  savePrompt(prompt: string): void;
  removePrompt(prompt: string): void;
}
// #endregion

/**
 * Full merged state including all slices.
 */
export type OnnxState
  = BrushSlice
  & DefaultSlice
  & HistorySlice
  & Img2ImgSlice
  & InpaintSlice
  & ModelSlice
  & OutpaintSlice
  & Txt2ImgSlice
  & HighresSlice
  & UpscaleSlice
  & BlendSlice
  & ResetSlice
  & ExtraSlice
  & PromptSlice;

/**
 * Shorthand for state creator to reduce repeated arguments.
 */
export type Slice<T> = StateCreator<OnnxState, [], [], T>;

/**
 * React context binding for API client.
 */
export const ClientContext = createContext<Maybe<ApiClient>>(undefined);

/**
 * React context binding for merged config, including server parameters.
 */
export const ConfigContext = createContext<Maybe<Config<ServerParams>>>(undefined);

/**
 * React context binding for bunyan logger.
 */
export const LoggerContext = createContext<Maybe<Logger>>(undefined);

/**
 * React context binding for zustand state store.
 */
export const StateContext = createContext<Maybe<StoreApi<OnnxState>>>(undefined);

/**
 * Key for zustand persistence, typically local storage.
 */
export const STATE_KEY = 'onnx-web';

/**
 * Current state version for zustand persistence.
 */
export const STATE_VERSION = 7;

export const BLEND_SOURCES = 2;

/**
 * Default parameters for the inpaint brush.
 *
 * Not provided by the server yet.
 */
export const DEFAULT_BRUSH = {
  color: 255,
  size: 8,
  strength: 0.5,
};

/**
 * Default parameters for the image history.
 *
 * Not provided by the server yet.
 */
export const DEFAULT_HISTORY = {
  /**
   * The number of images to be shown.
   */
  limit: 4,

  /**
   * The number of additional images to be kept in history, so they can scroll
   * back into view when you delete one. Does not include deleted images.
   */
  scrollback: 2,
};

export function baseParamsFromServer(defaults: ServerParams): Required<BaseImgParams> {
  return {
    batch: defaults.batch.default,
    cfg: defaults.cfg.default,
    eta: defaults.eta.default,
    negativePrompt: defaults.negativePrompt.default,
    prompt: defaults.prompt.default,
    scheduler: defaults.scheduler.default,
    steps: defaults.steps.default,
    seed: defaults.seed.default,
    tiledVAE: defaults.tiledVAE.default,
    tiles: defaults.tiles.default,
    overlap: defaults.overlap.default,
    stride: defaults.stride.default,
  };
}

/**
 * Prepare the state slice constructors.
 *
 * In the default state, image sources should be null and booleans should be false. Everything
 * else should be initialized from the default value in the base parameters.
 */
export function createStateSlices(server: ServerParams) {
  const base = baseParamsFromServer(server);

  const createTxt2ImgSlice: Slice<Txt2ImgSlice> = (set) => ({
    txt2img: {
      ...base,
      width: server.width.default,
      height: server.height.default,
    },
    setTxt2Img(params) {
      set((prev) => ({
        txt2img: {
          ...prev.txt2img,
          ...params,
        },
      }));
    },
    resetTxt2Img() {
      set({
        txt2img: {
          ...base,
          width: server.width.default,
          height: server.height.default,
        },
      });
    },
  });

  const createImg2ImgSlice: Slice<Img2ImgSlice> = (set) => ({
    img2img: {
      ...base,
      loopback: server.loopback.default,
      source: null,
      sourceFilter: '',
      strength: server.strength.default,
    },
    setImg2Img(params) {
      set((prev) => ({
        img2img: {
          ...prev.img2img,
          ...params,
        },
      }));
    },
    resetImg2Img() {
      set({
        img2img: {
          ...base,
          loopback: server.loopback.default,
          source: null,
          sourceFilter: '',
          strength: server.strength.default,
        },
      });
    },
  });

  const createInpaintSlice: Slice<InpaintSlice> = (set) => ({
    inpaint: {
      ...base,
      fillColor: server.fillColor.default,
      filter: server.filter.default,
      mask: null,
      noise: server.noise.default,
      source: null,
      strength: server.strength.default,
      tileOrder: server.tileOrder.default,
    },
    setInpaint(params) {
      set((prev) => ({
        inpaint: {
          ...prev.inpaint,
          ...params,
        },
      }));
    },
    resetInpaint() {
      set({
        inpaint: {
          ...base,
          fillColor: server.fillColor.default,
          filter: server.filter.default,
          mask: null,
          noise: server.noise.default,
          source: null,
          strength: server.strength.default,
          tileOrder: server.tileOrder.default,
        },
      });
    },
  });

  const createHistorySlice: Slice<HistorySlice> = (set) => ({
    history: [],
    limit: DEFAULT_HISTORY.limit,
    pushHistory(image, retry) {
      set((prev) => ({
        ...prev,
        history: [
          {
            image,
            ready: undefined,
            retry,
          },
          ...prev.history,
        ].slice(0, prev.limit + DEFAULT_HISTORY.scrollback),
      }));
    },
    removeHistory(image) {
      set((prev) => ({
        ...prev,
        history: prev.history.filter((it) => it.image.outputs[0].key !== image.outputs[0].key),
      }));
    },
    setLimit(limit) {
      set((prev) => ({
        ...prev,
        limit,
      }));
    },
    setReady(image, ready) {
      set((prev) => {
        const history = [...prev.history];
        const idx = history.findIndex((it) => it.image.outputs[0].key === image.outputs[0].key);
        if (idx >= 0) {
          history[idx].ready = ready;
        } else {
          // TODO: error
        }

        return {
          ...prev,
          history,
        };
      });
    },
  });

  const createOutpaintSlice: Slice<OutpaintSlice> = (set) => ({
    outpaint: {
      enabled: false,
      left: server.left.default,
      right: server.right.default,
      top: server.top.default,
      bottom: server.bottom.default,
    },
    setOutpaint(pixels) {
      set((prev) => ({
        outpaint: {
          ...prev.outpaint,
          ...pixels,
        }
      }));
    },
  });

  const createBrushSlice: Slice<BrushSlice> = (set) => ({
    brush: {
      ...DEFAULT_BRUSH,
    },
    setBrush(brush) {
      set((prev) => ({
        brush: {
          ...prev.brush,
          ...brush,
        },
      }));
    },
  });

  const createUpscaleSlice: Slice<UpscaleSlice> = (set) => ({
    upscale: {
      denoise: server.denoise.default,
      enabled: false,
      faces: false,
      faceOutscale: server.faceOutscale.default,
      faceStrength: server.faceStrength.default,
      outscale: server.outscale.default,
      scale: server.scale.default,
      upscaleOrder: server.upscaleOrder.default,
    },
    upscaleTab: {
      negativePrompt: server.negativePrompt.default,
      prompt: server.prompt.default,
      source: null,
    },
    setUpscale(upscale) {
      set((prev) => ({
        upscale: {
          ...prev.upscale,
          ...upscale,
        },
      }));
    },
    setUpscaleTab(source) {
      set((prev) => ({
        upscaleTab: {
          ...prev.upscaleTab,
          ...source,
        },
      }));
    },
    resetUpscaleTab() {
      set({
        upscaleTab: {
          negativePrompt: server.negativePrompt.default,
          prompt: server.prompt.default,
          source: null,
        },
      });
    },
  });

  const createHighresSlice: Slice<HighresSlice> = (set) => ({
    highres: {
      enabled: false,
      highresIterations: server.highresIterations.default,
      highresMethod: '',
      highresSteps: server.highresSteps.default,
      highresScale: server.highresScale.default,
      highresStrength: server.highresStrength.default,
    },
    setHighres(params) {
      set((prev) => ({
        highres: {
          ...prev.highres,
          ...params,
        },
      }));
    },
    resetHighres() {
      set({
        highres: {
          enabled: false,
          highresIterations: server.highresIterations.default,
          highresMethod: '',
          highresSteps: server.highresSteps.default,
          highresScale: server.highresScale.default,
          highresStrength: server.highresStrength.default,
        },
      });
    },
  });

  const createBlendSlice: Slice<BlendSlice> = (set) => ({
    blend: {
      mask: null,
      sources: [],
    },
    setBlend(blend) {
      set((prev) => ({
        blend: {
          ...prev.blend,
          ...blend,
        },
      }));
    },
    resetBlend() {
      set({
        blend: {
          mask: null,
          sources: [],
        },
      });
    },
  });

  const createDefaultSlice: Slice<DefaultSlice> = (set) => ({
    defaults: {
      ...base,
    },
    theme: '',
    setDefaults(params) {
      set((prev) => ({
        defaults: {
          ...prev.defaults,
          ...params,
        }
      }));
    },
    setTheme(theme) {
      set((prev) => ({
        theme,
      }));
    }
  });

  const createModelSlice: Slice<ModelSlice> = (set) => ({
    model: {
      control: server.control.default,
      correction: server.correction.default,
      model: server.model.default,
      pipeline: server.pipeline.default,
      platform: server.platform.default,
      upscaling: server.upscaling.default,
    },
    setModel(params) {
      set((prev) => ({
        model: {
          ...prev.model,
          ...params,
        }
      }));
    },
  });

  const createResetSlice: Slice<ResetSlice> = (set) => ({
    resetAll() {
      set((prev) => {
        const next = { ...prev };
        next.resetImg2Img();
        next.resetInpaint();
        next.resetTxt2Img();
        next.resetUpscaleTab();
        next.resetBlend();
        return next;
      });
    },
  });

  const createPromptSlice: Slice<PromptSlice> = (set) => ({
    prompts: [],
    savePrompt(prompt) {
      set((prev) => {
        console.log(prev);
        return {
          ...prev,
          prompts: [...prev.prompts, prompt],
        };
      });
    },
    removePrompt(prompt) {
      set((prev) => {
        const prompts = [...prev.prompts];
        const index = prompts.findIndex((it) => it === prompt);
        prompts.splice(index, 1);
        return {
          ...prev,
          prompts,
        };
      });
    },
  });


  // eslint-disable-next-line sonarjs/cognitive-complexity
  const createExtraSlice: Slice<ExtraSlice> = (set) => ({
    extras: {
      correction: [],
      diffusion: [],
      networks: [],
      sources: [],
      upscaling: [],
    },
    setExtras(extras) {
      set((prev) => ({
        ...prev,
        extras: {
          ...prev.extras,
          ...extras,
        },
      }));
    },
    setCorrectionModel(model) {
      set((prev) => {
        const correction = [...prev.extras.correction];
        const exists = correction.findIndex((it) => model.name === it.name);
        if (exists === MISSING_INDEX) {
          correction.push(model);
        } else {
          correction[exists] = model;
        }

        return {
          ...prev,
          extras: {
            ...prev.extras,
            correction,
          },
        };
      });
    },
    setDiffusionModel(model) {
      set((prev) => {
        const diffusion = [...prev.extras.diffusion];
        const exists = diffusion.findIndex((it) => model.name === it.name);
        if (exists === MISSING_INDEX) {
          diffusion.push(model);
        } else {
          diffusion[exists] = model;
        }

        return {
          ...prev,
          extras: {
            ...prev.extras,
            diffusion,
          },
        };
      });
    },
    setExtraNetwork(model) {
      set((prev) => {
        const networks = [...prev.extras.networks];
        const exists = networks.findIndex((it) => model.name === it.name);
        if (exists === MISSING_INDEX) {
          networks.push(model);
        } else {
          networks[exists] = model;
        }

        return {
          ...prev,
          extras: {
            ...prev.extras,
            networks,
          },
        };
      });
    },
    setExtraSource(model) {
      set((prev) => {
        const sources = [...prev.extras.sources];
        const exists = sources.findIndex((it) => model.name === it.name);
        if (exists === MISSING_INDEX) {
          sources.push(model);
        } else {
          sources[exists] = model;
        }

        return {
          ...prev,
          extras: {
            ...prev.extras,
            sources,
          },
        };
      });
    },
    setUpscalingModel(model) {
      set((prev) => {
        const upscaling = [...prev.extras.upscaling];
        const exists = upscaling.findIndex((it) => model.name === it.name);
        if (exists === MISSING_INDEX) {
          upscaling.push(model);
        } else {
          upscaling[exists] = model;
        }

        return {
          ...prev,
          extras: {
            ...prev.extras,
            upscaling,
          },
        };
      });
    },
    removeCorrectionModel(model) {
      set((prev) => {
        const correction = prev.extras.correction.filter((it) => model.name !== it.name);;
        return {
          ...prev,
          extras: {
            ...prev.extras,
            correction,
          },
        };
      });

    },
    removeDiffusionModel(model) {
      set((prev) => {
        const diffusion = prev.extras.diffusion.filter((it) => model.name !== it.name);;
        return {
          ...prev,
          extras: {
            ...prev.extras,
            diffusion,
          },
        };
      });

    },
    removeExtraNetwork(model) {
      set((prev) => {
        const networks = prev.extras.networks.filter((it) => model.name !== it.name);;
        return {
          ...prev,
          extras: {
            ...prev.extras,
            networks,
          },
        };
      });

    },
    removeExtraSource(model) {
      set((prev) => {
        const sources = prev.extras.sources.filter((it) => model.name !== it.name);;
        return {
          ...prev,
          extras: {
            ...prev.extras,
            sources,
          },
        };
      });

    },
    removeUpscalingModel(model) {
      set((prev) => {
        const upscaling = prev.extras.upscaling.filter((it) => model.name !== it.name);;
        return {
          ...prev,
          extras: {
            ...prev.extras,
            upscaling,
          },
        };
      });
    },
  });

  return {
    createBrushSlice,
    createDefaultSlice,
    createHistorySlice,
    createImg2ImgSlice,
    createInpaintSlice,
    createModelSlice,
    createOutpaintSlice,
    createTxt2ImgSlice,
    createUpscaleSlice,
    createHighresSlice,
    createBlendSlice,
    createResetSlice,
    createExtraSlice,
    createPromptSlice,
  };
}
