import {App, MarkdownRenderChild, MarkdownPostProcessorContext, Modal, Plugin} from 'obsidian';
import {Infographic} from '@antv/infographic';
import {DEFAULT_SETTINGS, AntVInfographicSettings, AntVInfographicSettingTab} from "./settings";

export default class AntVInfographicPlugin extends Plugin {
	settings: AntVInfographicSettings;

	async onload() {
		await this.loadSettings();

		// Register markdown post processor for infographic code blocks
		this.registerMarkdownCodeBlockProcessor('infographic', this.renderInfographic.bind(this));

		// Add settings tab
		this.addSettingTab(new AntVInfographicSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<AntVInfographicSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Render infographic from code block source
	 */
	private renderInfographic = (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		const container = document.createElement('div');
		container.className = 'infographic-container';
		// Dynamic values - use CSS variable for theme compatibility
		container.style.width = `var(--infographic-width, ${this.settings.defaultWidth}px)`;
		container.style.minHeight = `var(--infographic-min-height, ${this.settings.defaultHeight}px)`;

		el.appendChild(container);

		// Create infographic
		const infographic = new Infographic({
			container: container,
			width: this.settings.defaultWidth,
			height: this.settings.defaultHeight,
			padding: this.settings.padding,
		});

		infographic.render(source);

		// Add double-click to zoom
		container.addEventListener('dblclick', () => {
			new InfographicModal(this.app, source, this.settings).open();
		});

		// Register cleanup
		ctx.addChild(new InfographicCleanup(infographic));
	}
}

/**
 * Cleanup class for infographic instances
 */
class InfographicCleanup extends MarkdownRenderChild {
	private infographic: Infographic;

	constructor(infographic: Infographic) {
		super(document.createElement('div'));
		this.infographic = infographic;
	}

	onunload() {
		this.infographic.destroy();
	}
}

/**
 * Modal for displaying enlarged infographic
 */
class InfographicModal extends Modal {
	private source: string;
	private settings: AntVInfographicSettings;

	constructor(app: App, source: string, settings: AntVInfographicSettings) {
		super(app);
		this.source = source;
		this.settings = settings;
	}

	onOpen() {
		const { contentEl } = this;
		const modalEl = (this as unknown as { modalEl: HTMLElement }).modalEl;
		// Override Obsidian Modal default width limits using setCssProps for theme compatibility
		if (modalEl) {
			modalEl.setCssProps({ maxWidth: '90vw', width: '90vw', minWidth: '600px' });
		}

		contentEl.classList.add('infographic-modal-content');

		// Create container first
		const container = document.createElement('div');
		container.className = 'infographic-modal-container';
		contentEl.appendChild(container);

		// Wait for DOM to be ready then render
		requestAnimationFrame(() => {
			setTimeout(() => {
				const actualWidth = container.clientWidth || 800;

				const infographic = new Infographic({
					container: container,
					width: actualWidth,
					padding: 30,
				});

				infographic.render(this.source);

				// Auto adjust height based on content
				const canvas = container.querySelector('canvas');
				if (canvas) {
					const height = canvas.height;
					container.style.minHeight = `${height}px`;
				}

				// Add double-click to close
				contentEl.addEventListener('dblclick', () => {
					infographic.destroy();
					this.close();
				});
			}, 50);
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
