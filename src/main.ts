import {App, MarkdownRenderChild, MarkdownPostProcessorContext, Modal, Plugin} from 'obsidian';
import {Infographic} from '@antv/infographic';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// Register markdown post processor for infographic code blocks
		this.registerMarkdownCodeBlockProcessor('infographic', this.renderInfographic.bind(this));

		// Add settings tab
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Render infographic from code block source
	 */
	private renderInfographic = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		const container = document.createElement('div');
		container.className = 'infographic-container';
		container.style.width = `${this.settings.defaultWidth}px`;
		container.style.minHeight = `${this.settings.defaultHeight}px`;
		container.style.margin = '0 auto';
		container.style.cursor = 'pointer';

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
		super(null as any);
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
	private settings: MyPluginSettings;

	constructor(app: App, source: string, settings: MyPluginSettings) {
		super(app);
		this.source = source;
		this.settings = settings;
	}

	onOpen() {
		const { contentEl, modalEl } = this as any;
		// Override Obsidian Modal default width limits
		if (modalEl) {
			modalEl.style.maxWidth = '90vw';
			modalEl.style.width = '90vw';
			modalEl.style.minWidth = '600px';
		}

		contentEl.style.padding = '20px';
		contentEl.style.background = 'var(--background-primary)';
		contentEl.style.overflow = 'auto';

		// Create container first
		const container = document.createElement('div');
		container.style.minHeight = '400px';
		contentEl.appendChild(container);

		// Wait for DOM to be ready then render
		requestAnimationFrame(() => {
			setTimeout(() => {
				const actualWidth = container.clientWidth || 800;
				const modalHeight = 700;

				const infographic = new Infographic({
					container: container,
					width: actualWidth,
					height: modalHeight,
					padding: 30,
				});

				infographic.render(this.source);

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
