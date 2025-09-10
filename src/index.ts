import { IntRange } from 'ness-canvas';

declare type algorithm = "neuquant" | "octree";
declare type quality = IntRange<1, 31>
declare type threshold = IntRange<1, 101>

interface EncoderOptions<algo extends algorithm, bool extends boolean> {
    algorithm: algo;
    optimizer: bool;
    quality?: algo extends "neuquant"? quality : never;
    threshold?: bool extends true? threshold : never;
    repeat?: number;
    frameRate?: number;
    transparentColor?: `#${string}`;
}

export { algorithm, quality, threshold, EncoderOptions }
export { default as GifBuilder } from './Managers/GifBuilder';