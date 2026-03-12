# Obsidian AntV Infographic

在 Obsidian 中渲染 AntV Infographic 可视化图表。

## 功能

- 使用 `infographic` 代码块渲染信息图
- 支持多种模板（列表、层级结构、时间线等）
- 自动清理渲染资源

## 使用方法

### 基本语法

```infographic
infographic <模板名称>
data
  <数据内容>
```

### 示例

```infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label 步骤 1
      desc 开始
    - label 步骤 2
      desc 进行中
    - label 步骤 3
      desc 完成
```

### 可用模板

- `list-row-simple-horizontal-arrow` - 水平箭头列表
- `list-row-simple-vertical` - 垂直列表
- `hierarchy-structure-mirror` - 镜像层级结构
- `hierarchy-tree` - 树形层级

更多模板请参考 [AntV Infographic 文档](https://infographic.antv.vision/learn)。

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听变化自动编译）
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint
```

## 安装

将编译后的文件复制到你的 Obsidian  vaults 的 `.obsidian/plugins/obsidian-antv-infographic/` 目录下：

- `main.js`
- `manifest.json`
- `styles.css`（可选）

然后在 Obsidian 设置中启用插件。

## 许可证

MIT
