import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/app.module.css';
import {
	Button,
	Upload,
	InputNumber,
	Radio,
	RadioChangeEvent,
	Divider,
	Collapse,
} from 'antd';
const { Dragger } = Upload;
import type { UploadChangeParam } from 'antd/lib/upload';
import type { UploadFile } from 'antd/lib/upload/interface';
const { Panel } = Collapse;
import dynamic from 'next/dynamic';
const GitHubButtonWithNoSSR = dynamic(() => import('react-github-btn'), {
	ssr: false,
});

enum FileType {
	png = 'png',
	jpeg = 'jpeg',
	ico = 'ico',
}

// Canvas Class with helpful utils to add, update, and convert svg to different image type
class Canvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	svgName: string;
	svgURL: string;
	downloadType: FileType;

	constructor(
		canvas: HTMLCanvasElement,
		width: number,
		height: number,
		type: FileType
	) {
		this.canvas = canvas;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.svgName = '';
		this.svgURL = '';
		this.downloadType = type;
	}

	// Clear canvas as transparent (white for .jpeg)
	clear() {
		const { width, height } = this.canvas;
		if (this.downloadType === FileType.jpeg) {
			this.ctx.fillStyle = 'white';
			this.ctx.fillRect(0, 0, width, height);
		} else {
			this.ctx.clearRect(0, 0, width, height);
		}
	}

	// Draw svg file on canvas
	drawSvg() {
		const img = new Image();
		const { width, height } = this.canvas;
		img.onload = () => {
			this.ctx.drawImage(img, 0, 0, width, height);
		};
		img.src = this.svgURL;
	}

	// Add svg file on canvas and draw it
	addSvg(svgName: string = 'file', svgFile: Blob | any) {
		this.svgName = svgName;
		this.clear();
		// Revoke previous svg object URL to prevent memory leak
		if (this.svgURL) URL.revokeObjectURL(this.svgURL);
		this.svgURL = URL.createObjectURL(svgFile);
		this.drawSvg();
	}

	// Update svg file on canvas based on new width and height
	updateCanvas(width: number, height: number) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.clear();
		this.drawSvg();
	}

	// Update download file type and svg file on canvas
	updateDownloadType(type: FileType) {
		this.downloadType = type;
		this.updateCanvas(this.canvas.width, this.canvas.height);
	}

	// Download svg file as image to the selected file type
	downloadCanvasAsImg(type: FileType) {
		let fileType, fileName;
		switch (type) {
			case FileType.ico:
				fileType = 'image/x-icon';
				fileName = 'favicon.ico';
				break;
			default:
				fileType = `image/${type}`;
				const { width, height } = this.canvas;
				if (width === height) fileName = `${this.svgName}-${width}.${type}`;
				else fileName = `${this.svgName}-${width}x${height}.${type}`;
		}
		const link = document.createElement('a');
		link.download = fileName;
		link.href = this.canvas.toDataURL(fileType, 1.0);
		link.click();
	}
}

let canvas: Canvas;
const initialWidth: number = 48;
const initialHeight: number = 48;
const initialType: FileType = FileType.png;
const Home: NextPage = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [width, setWidth] = useState(initialWidth);
	const [height, setHeight] = useState(initialHeight);
	const [type, setType] = useState(initialType);
	const [dummy, setDummy] = useState(false);

	// Create Canvas Object once component finishes mounting
	useEffect(() => {
		if (canvasRef.current && !canvas)
			canvas = new Canvas(canvasRef.current, width, height, type);
	}, []);

	// Handler when a file is added
	const onFileAdd = (info: UploadChangeParam<UploadFile>) => {
		const { status, originFileObj: svgFile } = info.file;
		if (status === 'done') {
			const svgName = svgFile?.name.slice(0, -4);
			canvas.addSvg(svgName, svgFile);
			// React Escape Hatch: force a react refresh with dummy
			setDummy(!dummy);
		}
	};

	const onWidthChange = (value: any) => {
		if (Number.isFinite(value)) {
			const newWidth = value;
			const newHeight = value;
			canvas.updateCanvas(newWidth, newHeight);
			setWidth(newWidth);
			setHeight(newHeight);
		}
	};

	const onHeightChange = (value: any) => {
		if (Number.isFinite(value)) {
			const newHeight = value;
			canvas.updateCanvas(width, newHeight);
			setHeight(newHeight);
		}
	};

	const onTypeChange = (e: RadioChangeEvent) => {
		const newType = e.target.value;
		canvas.updateDownloadType(newType);
		setType(newType);
		if (newType === FileType.ico) {
			setWidth(48);
			setHeight(48);
		}
	};

	return (
		<div>
			<Head>
				<title>
					SVG to PNG / JPEG / ICO (Favicon) Online Converter - Free and Fast
				</title>
				<meta
					name='description'
					content='This free online tool allows you to convert SVG files to PNG, JPEG, Ico (Favicon) images with custom width and height - it is super simple, fast and runs in your browser only!'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<h1>🎨 SVG Converter</h1>
				<p>
					Convert <span className={styles.spanText}>.svg</span> to{' '}
					<span className={styles.spanText}>.png</span>{' '}
					<span className={styles.spanText}>.jpeg</span>{' '}
					<span className={styles.spanText}>.ico</span> like a breeze 💨{' '}
				</p>
				<Dragger
					name='file'
					accept='image/*'
					customRequest={
						(({ onSuccess }: { onSuccess: any }) =>
							setTimeout(() => onSuccess('success'), 0)) as any
					}
					className={styles.dragger}
					maxCount={1}
					showUploadList={false}
					onChange={onFileAdd}
				>
					<p className='ant-upload-text'>📥 Click or Drag SVG File Here</p>
					<div className={styles.canvasWrapper}>
						<canvas ref={canvasRef} className={styles.canvas} />
					</div>
				</Dragger>
				<div className={styles.inputGroup}>
					<InputNumber
						size='large'
						value={width}
						onChange={onWidthChange}
						addonBefore='↔️ Width'
						addonAfter='px'
					/>
					<InputNumber
						size='large'
						value={height}
						onChange={onHeightChange}
						addonBefore='↕️ Height'
						addonAfter='px'
					/>
				</div>
				<div>
					<Radio.Group
						value={type}
						onChange={onTypeChange}
						className={styles.radioGroup}
					>
						<label className={`ant-radio-button-wrapper ${styles.radioLabel}`}>
							<span>📁 Convert to</span>
						</label>
						{Object.keys(FileType).map((type) => (
							<Radio.Button key={type} value={type}>
								{type}
							</Radio.Button>
						))}
					</Radio.Group>
				</div>
				<Button
					type='primary'
					onClick={() => canvas.downloadCanvasAsImg(type)}
					disabled={!canvas?.svgURL}
				>
					🚀 Download as .{type} Image
				</Button>
			</main>

			<Divider plain>
				💡 This tool only runs in the browser and can be ran entirely offline
			</Divider>
			<footer className={styles.footer}>
				<Collapse className={styles.collapse}>
					<Panel header='❔ What is the story behind this tool?' key='1'>
						<p>
							While trying to do some svg to images conversion, I couldn't find
							any simple online tool that allows me to do so. This was
							frustrating since the latest Web APIs -{' '}
							<a href='https://developer.mozilla.org/en-US/docs/Web/API/URL_API'>
								URL API
							</a>{' '}
							and{' '}
							<a href='https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API'>
								Canvas API
							</a>{' '}
							have made it very easy to convert files to different image types
							on a modern browser. So I went ahead and coded out this simple
							tool myself (the core utility is ~100 lines of JavaScript code)
							and shared it out there with others who might also experience the
							frustration.
						</p>
					</Panel>
					<Panel header='🤔 How does this tool work?' key='2'>
						<p>
							This tool is open-source - you can use it for anything and read
							about its full implementation in this{' '}
							<a href='https://github.com/xitanggg/svg-to-png-jpeg-favicon'>
								GitHub repository - /pages/index.tsx
							</a>
							. At high level, it uses the{' '}
							<a href='https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction'>
								Web APIs
							</a>{' '}
							to perform the svg conversion: it uses{' '}
							<a href='https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL'>
								<span className={styles.spanText}>URL.createObjectURL</span>
							</a>{' '}
							to read the svg file and convert it to a DOMString,{' '}
							<a href='https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage'>
								<span className={styles.spanText}>
									CanvasRenderingContext2D.drawImage
								</span>
							</a>{' '}
							to render a svg image on a canvas without losing resolution, and{' '}
							<a href='https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL'>
								<span className={styles.spanText}>
									HTMLCanvasElement.toDataURL
								</span>
							</a>{' '}
							to convert the svg file on canvas to be different image types
							based on user selection -{' '}
							<span className={styles.spanText}>.png</span>{' '}
							<span className={styles.spanText}>.jpeg</span>{' '}
							<span className={styles.spanText}>.ico</span>. Since Web APIs are
							bundled into a browser, you can run this tool entirely offline on
							any modern day browser. More information about the tech stack can
							be found in the{' '}
							<a href='https://github.com/xitanggg/svg-to-png-jpeg-favicon'>
								README.md
							</a>
							.
						</p>
					</Panel>
					<Panel header='📖 Any reference to common file sizes?' key='3'>
						<ul>
							<li>
								Favicon must be a multiple of 48px square, for example: 48x48px,
								96x96px, 144x144px and so on{' '}
								<a href='https://developers.google.com/search/docs/advanced/appearance/favicon-in-search'>
									[Source - Google Search Central]
								</a>
							</li>
							<li>
								Google Chrome Extension should use a 128x128 icon for Chrome Web
								Store, a 48x48 icon for chrome://extensions page, and a 16x16
								icon as favicon. Icons should generally be in PNG format,
								because PNG has the best support for transparency.{' '}
								<a href='https://developer.chrome.com/docs/extensions/mv3/manifest/icons/'>
									[Source - Chrome Developers Manifest - Icons]
								</a>
							</li>
						</ul>
					</Panel>
				</Collapse>
				<div>
					<GitHubButtonWithNoSSR
						href='https://github.com/xitanggg/svg-to-png-jpeg-favicon'
						data-size='large'
						data-show-count='true'
						aria-label='Star xitanggg/svg-to-png-jpeg-favicon on GitHub'
					>
						Star
					</GitHubButtonWithNoSSR>
					<GitHubButtonWithNoSSR
						href='https://github.com/xitanggg/svg-to-png-jpeg-favicon/fork'
						data-size='large'
						data-show-count='true'
						aria-label='Fork xitanggg/svg-to-png-jpeg-favicon on GitHub'
					>
						Fork
					</GitHubButtonWithNoSSR>
				</div>
				<p>
					🔥 Created by <a href='https://github.com/xitanggg'>Xitang</a> - Jan
					2022
				</p>
			</footer>
		</div>
	);
};

export default Home;
