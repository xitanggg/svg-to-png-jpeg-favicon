# 🎨 SVG to PNG / JPEG / ICO (Favicon) Converter

Hi there👋 This is a free online tool that allows you to convert `SVG` files to `PNG`, `JPEG`, `ICO` (Favicon) images.

It is very simple and fast - it runs only in your browser and allows you to customize image width and height💨 Try it out here: [https://svg-to-png-jpeg-favicon.vercel.app](https://svg-to-png-jpeg-favicon.vercel.app)

![Gif Demo](https://media.giphy.com/media/QFgU6UbCo7rv4idP90/giphy.gif)

## 💡 Story

While trying to do some svg to images conversion, I couldn't find any simple online tool that allows me to do so🤯 This was frustrating since the latest `Web APIs` - [URL API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) and [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) have made it very easy to convert files to different image types on a modern browser. So I went ahead and coded out this simple tool myself and shared it out there with others who might also experience the frustration🔥

## ⚙️ Implementation

This tool is open-source - you can use it for anything and read about its full implementation in `/pages/index.tsx`. The core utility is the `Canvas Class`, which is only ~100 lines of JavaScript code. At high level, it uses the below [Web APIs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction) to perform the svg conversion:

1. [URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) to read the svg file and convert it to a DOMString
2. [CanvasRenderingContext2D.drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) to render a svg image on a canvas without losing resolution
3. [HTMLCanvasElement.toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) to convert the svg file on canvas to be different image types based on user selection - `.png` `.jpeg` `.ico`

Since Web APIs are bundled into a browser, you can run this tool entirely offline on any modern day browser.

## 🍔 Tech Stack

| Language             | [TypeScript](https://www.typescriptlang.org/) |
| -------------------- | --------------------------------------------- |
| JavaScript Framework | React & [Next.js](https://nextjs.org)         |
| React UI Framework   | [Ant Design](https://ant.design)              |
| CSS                  | CSS modules                                   |
| Deployment           | [Vercel](https://vercel.com)\*                |

\*Vercel is used over GitHub page to deploy this tool because it has better SEO support with SSG and can be potentially helpful for others to find it on Google

## 💻Local Testing

```bash
git clone https://github.com/xitanggg/svg-to-png-jpeg-favicon.git
cd ./svg-to-png-jpeg-favicon
npm install
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) with your browser to use the tool locally 🚀
