# GifBuilder 1.4.0

<div align="center">
  <br/>
  <p>
    <a href="https://discord.gg/sjABtBmTWa"><h1>Join Discord</h1></a>
  </p>
  <p>
    <a href="https://discord.gg/sjABtBmTWa">
      <img alt="Discord" src="https://img.shields.io/discord/726208970489987152?style=plastic&logo=discord&label=Discord&color=%239400D3&link=https%3A%2F%2Fdiscord.gg%2FsjABtBmTWa">
    </a>
    <a href="https://www.npmjs.com/package/gif-ness-canvas"><img src="https://badge.fury.io/js/gif-ness-canvas.png" alt="npm version" height=18 />
    </a>
    <a href="https://www.npmjs.com/package/gif-ness-canvas"><img src="https://img.shields.io/npm/dt/gif-ness-canvas.png" alt="npm download" height=18 />
    </a>
  </p>
</div>

## Inslallation

```bash
$ npm install gif-ness-canvas
```

> Gifbuilder uses the same methods as Nessbuilder, whose documentation you will find [here](https://github.com/DARK-ECNELIS/Ness-Canvas/tree/main).
## Infos

> The only difference is that the gifbuilder takes into account the gif type image and therefore can generate GIF. The GIF generate reading size will depend on the reading size of the GIFs which has been given to it, more precisely it will take the longest unlest its change.

```diff
⚠️ If this does not suit you and you want certain features, you only have to ask, only according to the request that I would make appropriate changes
```

## Quick Example

```js
  const background = await loadImage('src/test/assets/image/background/background-3147808.jpg');
  const avatar = await loadImage('src/test/assets/image/avatar/witch.png');
  const gif = "src/test/assets/image/gif/stickMan.gif"
  const gif2 = "src/test/assets/image/gif/tvHS.gif"
  const gif3 = "src/test/assets/image/gif/nyan-cat-gif-1.gif"
  const image = await loadImage('https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg');
  
  const builder = new GifBuilder(700, 250)
    .setAxis("BottomRight")
    .setCornerRadius(15)
    .setBackground(background) // Add Backgr  ound
    .setImage(gif, {sx: 250, sy: 25, sWidth: 250, sHeight: 150})
    .setBanner({ location: { x: 25, y: 175 }, size: { height: 60, width: 200 }, outline: { color: "Navy", join: "miter", size: 5 }, Side: { extend: 20, n: 4 }}, { type: "Image", "content": gif3 })
    .setFrame("Square", { location:{x: 450, y: 125}, size: 50, Quadrilateral: { radius: 0}, outline: { size: 2, color: "Aquamarine"} }, { type: "Color", content: "HotPink"})
    .setFrame("Square", { location: { x: 25, y: 25 }, size: 80, outline: { color: "Brown", size: 2 } }, { type: "Image", content: avatar })
    .setFrame("Circle", { location: { x: 525, y: 25 }, size: 80, outline: { color: "Crimson", size: 2 } }, { type: "Image", content: image })
    .setFrame("Decagon", { location: { x: 275, y: 75 }, size: 80, outline: { color: "Fuchsia", size: 2 } }, { type: "Image", content: gif2 })

    .setEncoder({ algorithm: "neuquant", optimizer: false, quality: 30, repeat: 0})
  await builder.generatedTo("src/test/", "gifImage")
// console.log(await builder.toDataURL())
// console.log(await builder.toBuffer())
```
## Result

<div style="display:flex; text-align:center; justify-content:space-evenly">
  <div style="display:inline-block">
    <h3>GifBuilder</h3>
    <img style="display:block" src="https://github.com/DARK-ECNELIS/Gif-Ness-Canvas/blob/main/Assets/test.gif?raw=true" height=180/>
  </div>
  <div style="display:inline-block">
    <h3>Console Log</h3>
    <img src="https://github.com/DARK-ECNELIS/Gif-Ness-Canvas/blob/main/Assets/GifConsole.png?raw=true" height= 80/>
  </div>
</div>


### setEncoder()

>```ts
> setEncoder<algo extends algorithm, bool extends boolean>(option: EncoderOptions<algo, bool>): this
>```

Change GIF generation

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **algorithm**: `neuquant` or `octree`
* **`quality`**: Change gif quality 1-30 (30 = lowest)
* **optimizer**: Reusing color palette from previous frame on the current frame
* **`threshold`**: How similar the two images must be to trigger the optimizer (default 90%)
* **repeat**: Number of loops GIF does 0 is forever, anything else if literal number of loops (default 0)
* **frameRate**: Number of frames per second to display
* **transparentColor**: This color will be transparent (hex color only `#FFFFFF`)

> - `threshold` => optimizer = true
> - `quality` => algorith = neuquant
</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { GifBuilder } = require('gif-ness-canvas')
const builder = new GifBuilder(250, 300)

...
.setEncoder({ algorithm: "neuquant", optimizer: false, quality: 30, repeat: 0, frameRate: 30})
...
```

<div style="display:inline-block">
  <img style="display:block" src="https://github.com/DARK-ECNELIS/Gif-Ness-Canvas/blob/main/Assets/test2.gif?raw=true" height=180/>
</div>

</details>