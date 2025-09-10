import { writeFileSync } from "fs";
import { Canvas, Image } from "canvas";
import { CanvasImage, CustomColor, Shape, ImagelocationOption, DrawlocationOption, NessBuilder, FrameType, IntRange, ShapeLoad, Axis, Frame, ExperienceColor, Experience, Loading, Banner, Content } from "ness-canvas";
import { gifExtractor, progressBar } from "../function";
import { algorithm, EncoderOptions, quality, threshold } from "..";

const GIFEncoder = require('gif-encoder-2')

export default class GifBuilder {
  
  protected declare canvas: Canvas;
  // protected declare context: CanvasRenderingContext2D;

  private framePlacement = [];
  private algorithm: algorithm;
  private optimizer: boolean;
  private quality: quality;
  private threshold: threshold;
  private repeat: number = 0;
  private frameRate: number = null;
  private transparentColor = null;
  
  constructor (width, height) {
    this.canvas = new Canvas(width, height)
  }

  /**
   * canvas outline radius
   * @param radius The radius to set
   * @param outline Line size (default 3)
   * @param color Line color (default #FFFFFF)
   */
  public setCornerRadius(radius: number, outline?: number, color?: CustomColor): this {
    this.framePlacement.push({id: 0, radius, outline, color})
    return this;
  };

  /**
   * Sets the canvas background.
   * @param imageColor The image to set (no link, use loadImage() from canvas) or a custom color (Valid syntaxes: #hex | rgb | rgba | colorName | CanvasGradient | CanvasPattern)
   */
  public setBackground(imageColor: CanvasImage | `${string}.gif` | CustomColor): this {
    this.framePlacement.push({id: 1, imageColor})
    return this;
  };

  /**
   * Draw an image to S coordinates with D dimensions
   * @param image The image to set (no link, use loadImage() from canvas)
   * @param imageOption Source image coordinates to draw in the context of Canvas
   * @param locationOption Modify image coordinates to draw in the context of Canvas
   */
  public setImage(image: CanvasImage | `${string}.gif`, imageOption: ImagelocationOption, locationOption?: DrawlocationOption): this {
    this.framePlacement.push({id: 2, image, imageOption, locationOption})
    return this;
  };

  /**
   * Sets a predefined frame
   * @param shape Frame format
   * @param coordinate Coordinate X and Y from upper left corner of the frame
   * @param size Frame size
   * @param options Frame configuration
   */
  public setFrame<T extends FrameType, S extends Shape>(shape: S, frame: Frame<S>, content: ContentGif<T>): this {
    this.framePlacement.push({id: 3, shape, frame, content})
    return this;
  };

  /**
   * Set text to canvas
   * @param text Text to write
   * @param coordinate Text location
   * @param option Text option
   */
  public setText(text: string, coordinate: {x: number, y: number}, option: Text): this {
    this.framePlacement.push({id: 4, text, coordinate, option})
    return this;
  };
  
  /**
   * Change font to use
   * 
   * @param name System font name
   * @param size Font size
   */
  public setFont(name: string, size?: number): this {

    this.framePlacement.push({id: 5, name, size})
    return this;
  };
  
  /**
   * Set progress bar
   *
   * @param location Coordinate to set ExpBar
   * @param size Size of the first progression bar
   * @param radius Radius to set
   * @param progress Progression of the second progression bar 0 - 100%
   * @param color Text color. White color is used by Default
   */
  public setExp(option: Experience, progress: IntRange<0, 101>, color?: ExperienceColor): this {
    this.framePlacement.push({id: 6, option, progress, color})
    return this;
  };
  
  public setLoading<D extends ShapeLoad, S extends Shape>(shape: Shape, option: Loading<S, D>): this {
    this.framePlacement.push({id: 7, shape, option})
    return this;
  };

  public setAxis(axis: Axis): this {
    this.framePlacement.push({id: 8, axis})
    return this;
  };

  public setBanner<T extends FrameType>(banner: Banner, content: ContentGif<T>): this {
    this.framePlacement.push({id: 9, banner, content})
    return this;
  };

  public setEncoder<algo extends algorithm, bool extends boolean>(option: EncoderOptions<algo, bool>): this {
    const { algorithm, optimizer, repeat, quality, threshold, frameRate, transparentColor } = option;

    this.algorithm = algorithm
    if (quality) this.quality = quality;
    if (optimizer) this.optimizer = optimizer, this.threshold = threshold;
    if (repeat) this.repeat = repeat;
    if (frameRate) this.frameRate = frameRate;
    if (transparentColor) this.transparentColor = parseInt(transparentColor.slice(1), 16);
    
    return this;
  }

  /**
   * Return canvas Buffer
   */
  public async toBuffer() {

    const data = {setImage: [], setBackground: [], setFrame: [], setBanner: [], length: 0};
    const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, this.algorithm, this.optimizer);
    
    if (this.quality) encoder.setQuality(this.quality);
    if (this.optimizer) encoder.setThreshold(this.threshold);
    if (this.frameRate !== null) encoder.setFrameRate(this.frameRate);
    if (this.transparentColor !== null) encoder.setTransparent(this.transparentColor);

    encoder.setRepeat(this.repeat);

    encoder.start();

    for (let e of this.framePlacement) {

      let imageData: Array<Image>;

      if (!e.image && !e.content?.content && !e.imageColor) continue;
      if (/.gif$/.test(e.image || e.content?.content || e.imageColor)) {
        imageData = await gifExtractor(e.image || e.content?.content || e.imageColor)
      } else if ((e.imageColor && typeof e.imageColor !== "object") || (e.content?.content && typeof e.content?.content !== "object")) {
        continue;
      } else {
        imageData = e.image || e.content?.content || e.imageColor
      };

      if (data.length < imageData.length || data.length == 0 && imageData.length !== undefined) data.length = imageData.length;

      switch (e.id) {
        case 1: {
          data.setBackground.push(imageData);
          break;
        };
        case 2: {
          data.setImage.push(imageData);
          break;
        };
        case 3: {
          data.setFrame.push(imageData);
          break;
        };
        case 9: {
          data.setBanner.push(imageData);
          break;
        };
      };
    };
    
    const builder = new NessBuilder(this.canvas.width, this.canvas.height);
    
    for (let i = 0, w = 0, x = 0, y = 0, z = 0; i < data.length; i++, w++, x++, y++, z++) {
      let X = 0, Y = 0, Z = 0;

      for (const e of this.framePlacement) {
        switch (e.id) {
          case 0: {
            builder.setCornerRadius(e.radius, e.outline, e.color);
            break;
          };
          case 1: {
            if (typeof e.imageColor == "string") {
              builder.setBackground(e.imageColor);
            } else if (!data.setBackground[0].complete) {
              if (w == data.setBackground[0].length) w = 0;
              builder.setBackground(data.setBackground[0][w]);
            } else {
              builder.setBackground(data.setBackground[0]);
            };
            break;
          };
          case 2: {
            if (!data.setImage[Y].complete) {
              if (y == data.setImage[Y].length) y = 0;
              builder.setImage(data.setImage[Y][y], e.imageOption, e.locationOption);
            } else {
              builder.setImage(data.setImage[Y], e.imageOption, e.locationOption);
            };
            Y++;
            break;
          };
          case 3: {
            if (e.content.type == "Empty" || e.content.type == "Color" || e.content.type == "Text") {
              builder.setFrame(e.shape, e.frame, e.content);
              break
            } else if (!data.setFrame[Z].complete) {
              if (z == data.setFrame[Z].length) z = 0;
              e.content.content = data.setFrame[Z][z];
              builder.setFrame(e.shape, e.frame, e.content);
            } else {
              e.content.content = data.setFrame[Z];
              builder.setFrame(e.shape, e.frame, e.content);
            };
            Z++;
            break;
          };
          case 4: {
            builder.setText(e.text, e.coordinate, e.option)
            break;
          };
          case 5: {
            builder.setFont(e.name, e.size)
            break;
          };
          case 6: {
            builder.setExp(e.option, e.progress, e.color)
            break;
          };
          case 7: {
            builder.setLoading(e.shape, e.option)
            break;
          };
          case 8: {
            builder.setAxis(e.axis)
            break;
          };
          case 9: {
            if (e.content.type == "Empty" || e.content.type == "Color" || e.content.type == "Text") {
              builder.setBanner(e.banner, e.content);
              break
            } else if (!data.setBanner[X].complete) {
              if (x == data.setBanner[X].length) x = 0;
              e.content.content = data.setBanner[X][x];
              builder.setBanner(e.banner, e.content);
            } else {
              e.content.content = data.setBanner[X];
              builder.setBanner(e.banner, e.content);
            };
            X++;
            break;
          };
        };
      };
      progressBar(i +1, data.length, "\x1b[34mGif builder: \x1b[33m")
      await encoder.addFrame(builder.context);
    };

    encoder.finish();
    return encoder.out.getData();
  };

  /**
   * Generated image from canvas
   * @param location Image Generation Path
   * @param name Image name
   */
  public async generatedTo(path: string, name: string) {
    writeFileSync(`${path}/${name}.gif`, await this.toBuffer());
  };

  /**
   * Returns a base64 encoded string
   */
  public async toDataURL(): Promise<string> {
    return Buffer.from(await this.toBuffer()).toString('base64');
  };
  
}

interface ContentGif<T extends FrameType> {
  /**
   * Type of frame content to use
   */
  type: T;
   /**
    * Image, text or color to place in the frame
    * 
    * Color: colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
  content: T extends "Image" ? CanvasImage | `${string}.gif` : T extends "Text" ? string | number : T extends "Color" ? CustomColor : "Empty";
  /**
   * Text configuration (not used if imageOrText is a CanvasImage)
   */
  text?: T extends "Text" ? Text : never;
}