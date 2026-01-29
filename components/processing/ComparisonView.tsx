'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Interface for block styles
 */
interface BlockStyles {
  color: {
    rgb: [number, number, number];
    hex: string;
    name: string;
  };
  backgroundColor?: {
    rgb: [number, number, number];
    hex: string;
    name?: string;
  };
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  orientation?: 'Horizontal' | 'Vertical' | 'Other';
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Interface for styled block
 */
export interface StyledBlock {
  text: string;
  bbox: [number, number, number, number];
  confidence: number;
  styles: BlockStyles;
}

/**
 * Interface for detected logos/images
 */
export interface DetectedLogo {
  id: string;
  description: string;
  score: number;
  bbox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  vertices: Array<{ x: number; y: number }>;
  type: 'logo' | 'image' | 'object';
}

/**
 * Interface for table cell
 */
export interface TableCell {
  row: number;
  col: number;
  text: string;
  colspan?: number;
  rowspan?: number;
  isHeader?: boolean;
  textColorHex?: string;
  bgColorHex?: string;
}

/**
 * Interface for detected table
 */
export interface DetectedTable {
  id: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
  rows: number;
  cols: number;
  cells: TableCell[];
  hasHeaderRow?: boolean;
  headerBgColor?: string;
  borderColor?: string;
  blockIds: number[]; // IDs of OCR blocks that belong to this table
}

/**
 * Interface for a processed page
 */
export interface ProcessedPage {
  pageIndex: number;
  originalImageBase64: string;
  processedImageBase64: string;
  blocks: StyledBlock[];
  logos?: DetectedLogo[];
  tables?: DetectedTable[]; // Tables detected in this page
  pageWidth: number;
  pageHeight: number;
}

/**
 * Props for the component
 */
interface ComparisonViewProps {
  page: ProcessedPage;
  targetLanguage: string;
  onTranslate?: (translatedBlocks: StyledBlock[]) => void;
  onGeneratePdf?: () => void;
}

/**
 * Visual comparison component
 * Shows side by side the original PDF vs detected blocks with their styles
 */
export default function ComparisonView({
  page,
  targetLanguage,
  onTranslate,
  onGeneratePdf,
}: ComparisonViewProps) {
  const { pageIndex, originalImageBase64, processedImageBase64, blocks, logos = [], tables = [], pageWidth, pageHeight } = page;

  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // Editable blocks state - start with original blocks
  const [editableBlocks, setEditableBlocks] = useState<StyledBlock[]>(blocks);

  // Reconstruction mode:
  // 'blank' = from scratch (white background)
  // 'overlay' = on original PDF (text on top)
  // 'replace' = on original PDF but with white background per block (replaces text)
  const [reconstructionMode, setReconstructionMode] = useState<'blank' | 'overlay' | 'replace'>('blank');

  // Translation state
  const [translatedBlocks, setTranslatedBlocks] = useState<StyledBlock[] | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editFontSize, setEditFontSize] = useState(12);
  const [editFontFamily, setEditFontFamily] = useState('Arial');
  const [editFontWeight, setEditFontWeight] = useState('normal');
  const [editColor, setEditColor] = useState('#000000');
  const [editBboxX, setEditBboxX] = useState(0);
  const [editBboxY, setEditBboxY] = useState(0);
  const [editBboxW, setEditBboxW] = useState(100);
  const [editBboxH, setEditBboxH] = useState(20);

  // PDF generation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update editableBlocks when blocks prop changes
  useEffect(() => {
    setEditableBlocks(blocks);
  }, [blocks]);

  // Start editing when a block is selected
  const startEditing = (blockIndex: number) => {
    const block = editableBlocks[blockIndex];
    setEditText(block.text);
    setEditFontSize(block.styles.fontSize);
    setEditFontFamily(block.styles.fontFamily);
    setEditFontWeight(block.styles.fontWeight);
    setEditColor(block.styles.color.hex);
    setEditBboxX(block.bbox[0]);
    setEditBboxY(block.bbox[1]);
    setEditBboxW(block.bbox[2]);
    setEditBboxH(block.bbox[3]);
    setIsEditing(true);
  };

  // Save edits to the selected block
  const saveEdits = () => {
    if (selectedBlockIndex === null) return;

    const updatedBlocks = [...editableBlocks];
    updatedBlocks[selectedBlockIndex] = {
      ...updatedBlocks[selectedBlockIndex],
      text: editText,
      bbox: [editBboxX, editBboxY, editBboxW, editBboxH],
      styles: {
        ...updatedBlocks[selectedBlockIndex].styles,
        fontSize: editFontSize,
        fontFamily: editFontFamily,
        fontWeight: editFontWeight,
        color: {
          ...updatedBlocks[selectedBlockIndex].styles.color,
          hex: editColor,
          rgb: hexToRgb(editColor),
        },
      },
    };
    setEditableBlocks(updatedBlocks);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  // Helper to convert hex to rgb
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  /**
   * Draw a single table on the canvas
   */
  const drawTable = (
    ctx: CanvasRenderingContext2D,
    table: DetectedTable,
    scaleX: number,
    scaleY: number
  ) => {
    const [tableX, tableY, tableW, tableH] = table.bbox;
    const scaledTableX = tableX * scaleX;
    const scaledTableY = tableY * scaleY;
    const scaledTableW = tableW * scaleX;
    const scaledTableH = tableH * scaleY;

    // Calculate cell dimensions
    const cellWidth = scaledTableW / table.cols;
    const cellHeight = scaledTableH / table.rows;

    // Draw table background (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(scaledTableX, scaledTableY, scaledTableW, scaledTableH);

    // Draw header row background if exists
    if (table.hasHeaderRow) {
      const headerBgColor = table.headerBgColor || '#E0E0E0';
      ctx.fillStyle = headerBgColor;
      ctx.fillRect(scaledTableX, scaledTableY, scaledTableW, cellHeight);
    }

    // Draw each cell
    for (const cell of table.cells) {
      const cellX = scaledTableX + cell.col * cellWidth;
      const cellY = scaledTableY + cell.row * cellHeight;
      const cWidth = cellWidth * (cell.colspan || 1);
      const cHeight = cellHeight * (cell.rowspan || 1);

      // Draw cell background if specified
      if (cell.bgColorHex && cell.bgColorHex !== '#FFFFFF') {
        ctx.fillStyle = cell.bgColorHex;
        ctx.fillRect(cellX, cellY, cWidth, cHeight);
      }

      // Draw cell text
      if (cell.text) {
        const textColor = cell.textColorHex || '#000000';
        ctx.fillStyle = textColor;

        // Calculate font size based on cell height
        const fontSize = Math.min(cHeight * 0.6, 14);
        const fontWeight = cell.isHeader ? 'bold' : 'normal';
        ctx.font = `${fontWeight} ${fontSize}px Arial`;
        ctx.textBaseline = 'middle';

        // Measure text and truncate if needed
        let displayText = cell.text;
        let textWidth = ctx.measureText(displayText).width;
        const maxWidth = cWidth - 8; // 4px padding on each side

        if (textWidth > maxWidth) {
          // Truncate with ellipsis
          while (textWidth > maxWidth && displayText.length > 3) {
            displayText = displayText.slice(0, -1);
            textWidth = ctx.measureText(displayText + '...').width;
          }
          displayText += '...';
        }

        // Center text in cell
        const textX = cellX + (cWidth - ctx.measureText(displayText).width) / 2;
        const textY = cellY + cHeight / 2;
        ctx.fillText(displayText, textX, textY);
      }
    }

    // Draw table borders
    const borderColor = table.borderColor || '#000000';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;

    // Draw outer border
    ctx.strokeRect(scaledTableX, scaledTableY, scaledTableW, scaledTableH);

    // Draw row lines
    for (let row = 1; row < table.rows; row++) {
      const y = scaledTableY + row * cellHeight;
      ctx.beginPath();
      ctx.moveTo(scaledTableX, y);
      ctx.lineTo(scaledTableX + scaledTableW, y);
      ctx.stroke();
    }

    // Draw column lines
    for (let col = 1; col < table.cols; col++) {
      const x = scaledTableX + col * cellWidth;
      ctx.beginPath();
      ctx.moveTo(x, scaledTableY);
      ctx.lineTo(x, scaledTableY + scaledTableH);
      ctx.stroke();
    }

    console.log(`📊 Rendered table "${table.id}": ${table.rows}x${table.cols} at [${scaledTableX.toFixed(0)}, ${scaledTableY.toFixed(0)}]`);
  };

  /**
   * Draw blocks on canvas
   */
  const drawBlocks = (
    canvas: HTMLCanvasElement,
    imageElement: HTMLImageElement,
    renderText: boolean = false,
    mode: 'blank' | 'overlay' | 'replace' = 'blank',
    backgroundImage?: HTMLImageElement,
    blocksToRender?: StyledBlock[],
    tablesToRender?: DetectedTable[]
  ) => {
    const activeBlocks = blocksToRender || editableBlocks;
    const activeTables = tablesToRender || tables;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas to match the displayed image size
    const rect = imageElement.getBoundingClientRect();

    // Debug: Log rect dimensions
    console.log(`[drawBlocks] Image rect: ${rect.width}x${rect.height}, Natural: ${imageElement.naturalWidth}x${imageElement.naturalHeight}, renderText=${renderText}`);

    // Guard against zero dimensions
    if (rect.width === 0 || rect.height === 0) {
      console.warn('[drawBlocks] Image has zero dimensions, skipping render');
      return;
    }

    // Set internal canvas dimensions (for drawing)
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Also set CSS dimensions (for display) - critical for absolute positioned canvas
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (renderText) {
      if ((mode === 'overlay' || mode === 'replace') && backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        console.log('\n========================================');
        console.log(mode === 'replace' ? '🎨 RENDERING WITH TEXT REPLACEMENT' : '🎨 RENDERING OVER ORIGINAL PDF');
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log('\n========================================');
        console.log('🎨 RENDERING FROM SCRATCH (white background)');
      }
      console.log(`   Canvas: ${canvas.width}x${canvas.height}px`);
      console.log(`   Natural image: ${imageElement.naturalWidth}x${imageElement.naturalHeight}px`);
      console.log(`   Blocks to render: ${activeBlocks.length}`);
      console.log(`   Mode: ${mode}`);
      console.log('========================================');
    }

    // Always show block outlines on the left side (overlay is always on for left panel)
    // The showOverlay checkbox only affects whether tooltips appear on hover

    const scaleX = canvas.width / imageElement.naturalWidth;
    const scaleY = canvas.height / imageElement.naturalHeight;

    activeBlocks.forEach((block, index) => {
      const [x, y, width, height] = block.bbox;
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      const isSelected = selectedBlockIndex === index;
      const isHovered = hoveredBlockIndex === index;

      if (renderText) {
        // Get text color from styles
        const [r, g, b] = block.styles.color.rgb;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        const fontWeight = block.styles.fontWeight === 'bold' ? 'bold' : 'normal';
        const fontStyle = block.styles.fontStyle === 'italic' ? 'italic' : 'normal';
        const orientation = block.styles.orientation || 'Horizontal';

        // Log block info
        console.log(`\n📝 Rendering block #${index + 1}: "${block.text.substring(0, 30)}..."`);
        console.log(`   Color: rgb(${r}, ${g}, ${b}) / ${block.styles.color.hex} / ${block.styles.color.name}`);
        console.log(`   BBox original: [${x.toFixed(0)}, ${y.toFixed(0)}, ${width.toFixed(0)}, ${height.toFixed(0)}]`);
        console.log(`   BBox scaled: [${scaledX.toFixed(0)}, ${scaledY.toFixed(0)}, ${scaledWidth.toFixed(0)}, ${scaledHeight.toFixed(0)}]`);
        console.log(`   Styles: fontSize=${block.styles.fontSize}pt, family=${block.styles.fontFamily}, weight=${fontWeight}`);

        ctx.save();

        // In 'replace' or 'blank' modes: draw background color for the block
        // PRIORITY: Use backgroundColor from backend if exists, otherwise detect from context
        if (mode === 'replace' || mode === 'blank') {
          let bgR = 255, bgG = 255, bgB = 255;
          let bgSource = 'default';

          // 1. FIRST: Use backgroundColor from backend (more accurate)
          if (block.styles.backgroundColor && Array.isArray(block.styles.backgroundColor.rgb) && block.styles.backgroundColor.rgb.length >= 3) {
            bgR = block.styles.backgroundColor.rgb[0];
            bgG = block.styles.backgroundColor.rgb[1];
            bgB = block.styles.backgroundColor.rgb[2];
            bgSource = 'backend';
            console.log(`   🎨 Background from backend: rgb(${bgR}, ${bgG}, ${bgB}) - ${block.styles.backgroundColor.hex}`);
          }
          // 2. FALLBACK: Detect from image context (only in replace mode with image)
          else if (mode === 'replace' && backgroundImage) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
              tempCanvas.width = backgroundImage.naturalWidth;
              tempCanvas.height = backgroundImage.naturalHeight;
              tempCtx.drawImage(backgroundImage, 0, 0);

              const samplePoints: { x: number; y: number }[] = [];
              for (const margin of [5, 15, 25]) {
                for (const pct of [0.2, 0.4, 0.6, 0.8]) {
                  samplePoints.push({ x: Math.floor(x + width * pct), y: Math.floor(y - margin) });
                  samplePoints.push({ x: Math.floor(x + width * pct), y: Math.floor(y + height + margin) });
                }
                for (const pct of [0.3, 0.5, 0.7]) {
                  samplePoints.push({ x: Math.floor(x - margin), y: Math.floor(y + height * pct) });
                  samplePoints.push({ x: Math.floor(x + width + margin), y: Math.floor(y + height * pct) });
                }
              }

              const bgColors: { r: number; g: number; b: number }[] = [];
              for (const point of samplePoints) {
                const px = Math.max(0, Math.min(point.x, tempCanvas.width - 1));
                const py = Math.max(0, Math.min(point.y, tempCanvas.height - 1));
                const pixelData = tempCtx.getImageData(px, py, 1, 1).data;
                const brightness = (pixelData[0] + pixelData[1] + pixelData[2]) / 3;
                if (brightness > 80) {
                  bgColors.push({ r: pixelData[0], g: pixelData[1], b: pixelData[2] });
                }
              }

              if (bgColors.length >= 3) {
                const colorGroups: { r: number; g: number; b: number; count: number }[] = [];
                const tolerance = 25;
                for (const color of bgColors) {
                  let foundGroup = false;
                  for (const group of colorGroups) {
                    const dist = Math.abs(color.r - group.r) + Math.abs(color.g - group.g) + Math.abs(color.b - group.b);
                    if (dist <= tolerance * 3) {
                      group.r = Math.round((group.r * group.count + color.r) / (group.count + 1));
                      group.g = Math.round((group.g * group.count + color.g) / (group.count + 1));
                      group.b = Math.round((group.b * group.count + color.b) / (group.count + 1));
                      group.count++;
                      foundGroup = true;
                      break;
                    }
                  }
                  if (!foundGroup) {
                    colorGroups.push({ ...color, count: 1 });
                  }
                }
                colorGroups.sort((a, b) => b.count - a.count);
                if (colorGroups.length > 0) {
                  bgR = colorGroups[0].r;
                  bgG = colorGroups[0].g;
                  bgB = colorGroups[0].b;
                  bgSource = 'context-detection';
                }
              }
              console.log(`   🎨 Background detected from context: rgb(${bgR}, ${bgG}, ${bgB})`);
            }
          }

          // Draw background rectangle
          ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
          ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
          console.log(`   🎨 Background applied (${bgSource}): rgb(${bgR}, ${bgG}, ${bgB})`);

          // Restore text color
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        }

        if (orientation === 'Vertical') {
          ctx.translate(scaledX, scaledY + scaledHeight);
          ctx.rotate(-Math.PI / 2);

          const textAreaWidth = scaledHeight;
          const textAreaHeight = scaledWidth;

          let fontSizePx = scaledWidth * 1.2;
          ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${block.styles.fontFamily}`;
          ctx.textBaseline = 'top';

          let textWidth = ctx.measureText(block.text).width;

          if (textWidth > textAreaWidth) {
            fontSizePx = fontSizePx * (textAreaWidth / textWidth);
            ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${block.styles.fontFamily}`;
            textWidth = ctx.measureText(block.text).width;
          }

          const offsetX = (textAreaWidth - textWidth) / 2;
          const offsetY = (textAreaHeight - fontSizePx) / 2;

          ctx.fillText(block.text, offsetX, offsetY);
        } else {
          let fontSizePx = scaledHeight * 1.2;
          ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${block.styles.fontFamily}`;
          ctx.textBaseline = 'top';

          let textWidth = ctx.measureText(block.text).width;

          const widthFactor = scaledWidth / textWidth;
          fontSizePx = fontSizePx * widthFactor * 0.98;
          ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${block.styles.fontFamily}`;
          textWidth = ctx.measureText(block.text).width;

          if (fontSizePx > scaledHeight * 1.2) {
            fontSizePx = scaledHeight * 1.2;
            ctx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${block.styles.fontFamily}`;
            textWidth = ctx.measureText(block.text).width;
          }

          const offsetY = (scaledHeight - fontSizePx) / 2;
          const textX = scaledX + (scaledWidth - textWidth) / 2;

          ctx.fillText(block.text, textX, scaledY + offsetY);
        }

        ctx.restore();

        if (isSelected || isHovered) {
          ctx.strokeStyle = isSelected ? '#fbbf24' : '#06b6d4';
          ctx.lineWidth = isSelected ? 4 : 3;
          ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        }
      } else {
        // ALWAYS show block outlines on the left side (not just on hover)
        // Use different styles for selected, hovered, and normal blocks
        let strokeColor: string;
        let lineWidth: number;
        let fillColor: string;

        if (isSelected) {
          strokeColor = '#fbbf24'; // Yellow for selected
          lineWidth = 3;
          fillColor = 'rgba(251, 191, 36, 0.15)';
        } else if (isHovered) {
          strokeColor = '#06b6d4'; // Cyan for hovered
          lineWidth = 2.5;
          fillColor = 'rgba(6, 182, 212, 0.12)';
        } else {
          // Normal blocks - always visible with subtle styling
          strokeColor = '#8b5cf6'; // Purple for normal blocks
          lineWidth = 1.5;
          fillColor = 'rgba(139, 92, 246, 0.05)';
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fillColor;

        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Show block number for all blocks (small label in corner)
        const label = `${index + 1}`;
        ctx.font = 'bold 10px sans-serif';
        const labelWidth = ctx.measureText(label).width + 6;
        const labelHeight = 14;

        // Draw label background
        ctx.fillStyle = strokeColor;
        ctx.fillRect(scaledX, scaledY, labelWidth, labelHeight);

        // Draw label text
        ctx.fillStyle = 'white';
        ctx.fillText(label, scaledX + 3, scaledY + 10);
      }

      // Show tooltip only for selected or hovered blocks
      if (isSelected || isHovered) {
        const label = `#${index + 1}`;
        const textPreview = block.text.length > 15
          ? block.text.substring(0, 15) + '...'
          : block.text;

        const tooltipColor = isSelected ? '#fbbf24' : '#06b6d4';

        ctx.fillStyle = 'white';
        ctx.fillRect(scaledX - 2, scaledY - 40, 150, 38);

        ctx.strokeStyle = tooltipColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(scaledX - 2, scaledY - 40, 150, 38);

        ctx.fillStyle = tooltipColor;
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(label, scaledX + 4, scaledY - 22);

        ctx.fillStyle = '#666';
        ctx.font = 'normal 10px sans-serif';
        ctx.fillText(textPreview, scaledX + 4, scaledY - 8);
      }
    });

    // Draw tables if rendering text and tables exist
    if (renderText && activeTables && activeTables.length > 0) {
      console.log(`\n📊 Rendering ${activeTables.length} tables...`);
      for (const table of activeTables) {
        drawTable(ctx, table, scaleX, scaleY);
      }
    }
  };

  /**
   * Handle canvas click
   */
  const handleCanvasClick = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    imageElement: HTMLImageElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = canvas.width / imageElement.naturalWidth;
    const scaleY = canvas.height / imageElement.naturalHeight;

    for (let i = editableBlocks.length - 1; i >= 0; i--) {
      const block = editableBlocks[i];
      const [bx, by, bw, bh] = block.bbox;
      const scaledX = bx * scaleX;
      const scaledY = by * scaleY;
      const scaledWidth = bw * scaleX;
      const scaledHeight = bh * scaleY;

      if (
        x >= scaledX &&
        x <= scaledX + scaledWidth &&
        y >= scaledY &&
        y <= scaledY + scaledHeight
      ) {
        setSelectedBlockIndex(i);
        setIsEditing(false); // Close edit mode when selecting a different block
        return;
      }
    }

    setSelectedBlockIndex(null);
    setIsEditing(false);
  };

  /**
   * Handle canvas mouse move
   */
  const handleCanvasMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    imageElement: HTMLImageElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = canvas.width / imageElement.naturalWidth;
    const scaleY = canvas.height / imageElement.naturalHeight;

    let foundIndex: number | null = null;
    for (let i = editableBlocks.length - 1; i >= 0; i--) {
      const block = editableBlocks[i];
      const [bx, by, bw, bh] = block.bbox;
      const scaledX = bx * scaleX;
      const scaledY = by * scaleY;
      const scaledWidth = bw * scaleX;
      const scaledHeight = bh * scaleY;

      if (
        x >= scaledX &&
        x <= scaledX + scaledWidth &&
        y >= scaledY &&
        y <= scaledY + scaledHeight
      ) {
        foundIndex = i;
        break;
      }
    }

    setHoveredBlockIndex(foundIndex);
  };

  /**
   * Translate all text blocks
   */
  const translateBlocks = async () => {
    setIsTranslating(true);
    try {
      const textsToTranslate = editableBlocks.map(b => b.text);

      const response = await fetch('/api/processing/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation error');
      }

      const result = await response.json();

      const newTranslatedBlocks: StyledBlock[] = editableBlocks.map((block, index) => ({
        ...block,
        text: result.translations[index] || block.text,
      }));

      setTranslatedBlocks(newTranslatedBlocks);
      setShowTranslation(true);
      setReconstructionMode('replace');

      onTranslate?.(newTranslatedBlocks);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Error translating. Please check your API configuration.');
    } finally {
      setIsTranslating(false);
    }
  };

  /**
   * Generate PDF with current text
   */
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const blocksToUse = (showTranslation && translatedBlocks) ? translatedBlocks : editableBlocks;

      const response = await fetch('/api/processing/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImageBase64,
          blocks: blocksToUse,
          pageWidth,
          pageHeight,
          mode: reconstructionMode,
        }),
      });

      if (!response.ok) {
        throw new Error('Error generating PDF');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = showTranslation ? 'translated_document.pdf' : 'reconstructed_document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      onGeneratePdf?.();
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  /**
   * Redraw when states change
   */
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const leftCanvas = leftCanvasRef.current;
      const rightCanvas = rightCanvasRef.current;
      const leftImg = document.getElementById(
        `comparison-left-${pageIndex}`
      ) as HTMLImageElement;
      const rightImg = document.getElementById(
        `comparison-right-${pageIndex}`
      ) as HTMLImageElement;

      if (leftCanvas && leftImg && leftImg.complete && leftImg.naturalWidth > 0) {
        // Update canvas CSS dimensions
        const leftRect = leftImg.getBoundingClientRect();
        leftCanvas.style.width = `${leftRect.width}px`;
        leftCanvas.style.height = `${leftRect.height}px`;
        drawBlocks(leftCanvas, leftImg, false, 'blank', undefined, undefined, tables);
      }

      const blocksForRender = (showTranslation && translatedBlocks) ? translatedBlocks : editableBlocks;

      if (rightCanvas && rightImg && rightImg.complete && rightImg.naturalWidth > 0) {
        // Update canvas CSS dimensions
        const rightRect = rightImg.getBoundingClientRect();
        rightCanvas.style.width = `${rightRect.width}px`;
        rightCanvas.style.height = `${rightRect.height}px`;

        if (reconstructionMode === 'overlay' || reconstructionMode === 'replace') {
          const bgImg = new Image();
          bgImg.onload = () => {
            drawBlocks(rightCanvas, rightImg, true, reconstructionMode, bgImg, blocksForRender, tables);
          };
          bgImg.src = `data:image/png;base64,${originalImageBase64}`;
        } else {
          drawBlocks(rightCanvas, rightImg, true, 'blank', undefined, blocksForRender, tables);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [blocks, editableBlocks, selectedBlockIndex, hoveredBlockIndex, showOverlay, reconstructionMode, originalImageBase64, showTranslation, translatedBlocks, pageIndex, tables]);

  const selectedBlock = selectedBlockIndex !== null ? editableBlocks[selectedBlockIndex] : null;

  return (
    <div className="border-2 border-purple-300 rounded-lg overflow-hidden">
      {/* Header with controls */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-3 border-b border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-purple-900 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Page {pageIndex + 1}
          </h3>
          <p className="text-xs text-purple-600">
            Click any block to edit
          </p>
        </div>
      </div>

      {/* Comparative grid - 50/50 split with max size */}
      <div className="flex divide-x divide-purple-200">
        {/* Left: Original PDF with detected blocks */}
        <div className="w-1/2 bg-gray-50 p-2 flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Original + Blocks
            </span>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
              {blocks.length} blocks
            </span>
          </div>
          <div className="relative border border-gray-300 rounded bg-white flex-1">
            <img
              src={`data:image/png;base64,${originalImageBase64}`}
              alt="PDF Original Background"
              className="w-full h-auto block"
            />
            <img
              id={`comparison-left-${pageIndex}`}
              src={`data:image/png;base64,${processedImageBase64}`}
              alt="Reference"
              className="absolute top-0 left-0 w-full h-auto opacity-0 pointer-events-none"
              onLoad={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                // Set canvas CSS dimensions to match image display size
                if (leftCanvasRef.current) {
                  const rect = img.getBoundingClientRect();
                  leftCanvasRef.current.style.width = `${rect.width}px`;
                  leftCanvasRef.current.style.height = `${rect.height}px`;
                }
                drawBlocks(leftCanvasRef.current!, img, false, 'blank', undefined, undefined, tables);
              }}
            />
            <canvas
              ref={leftCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-auto cursor-crosshair"
              onClick={(e) => {
                const img = document.getElementById(
                  `comparison-left-${pageIndex}`
                ) as HTMLImageElement;
                handleCanvasClick(e, leftCanvasRef.current!, img);
              }}
              onMouseMove={(e) => {
                const img = document.getElementById(
                  `comparison-left-${pageIndex}`
                ) as HTMLImageElement;
                handleCanvasMouseMove(e, leftCanvasRef.current!, img);
              }}
            />
          </div>
        </div>

        {/* Right: Reconstructed preview */}
        <div className="w-1/2 bg-purple-50 p-2 flex flex-col">
          <div className="mb-1 flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                Preview
              </span>
              <span className="text-xs text-purple-600 bg-purple-200 px-2 py-0.5 rounded">
                {(showTranslation && translatedBlocks ? translatedBlocks : editableBlocks).length} blocks
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setReconstructionMode('blank')}
                className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                  reconstructionMode === 'blank'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-100'
                }`}
                title="White background, OCR text only"
              >
                Blank
              </button>
              <button
                onClick={() => setReconstructionMode('overlay')}
                className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                  reconstructionMode === 'overlay'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-100'
                }`}
                title="Original PDF with OCR text on top"
              >
                Overlay
              </button>
              <button
                onClick={() => setReconstructionMode('replace')}
                className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                  reconstructionMode === 'replace'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-100'
                }`}
                title="Original PDF with text replaced (detects background)"
              >
                Replace
              </button>
            </div>
          </div>

          {/* Translation and PDF buttons */}
          <div className="mb-1 flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center space-x-1">
              <button
                onClick={translateBlocks}
                disabled={isTranslating}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors flex items-center ${
                  isTranslating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title={`Translate text to ${targetLanguage}`}
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-1 h-3 w-3" />
                    ...
                  </>
                ) : (
                  <>{targetLanguage.toUpperCase()}</>
                )}
              </button>
              {translatedBlocks && (
                <label className="flex items-center text-xs text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTranslation}
                    onChange={(e) => setShowTranslation(e.target.checked)}
                    className="mr-1"
                  />
                  Show
                </label>
              )}
              {/* Generate PDF button - temporarily hidden
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className={`px-3 py-1.5 text-xs rounded font-medium transition-colors flex items-center ${
                  isGeneratingPDF
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                title="Download PDF with current text"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>Generate PDF</>
                )}
              </button>
              */}
            </div>
            {translatedBlocks && showTranslation && (
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {targetLanguage.toUpperCase()}
              </span>
            )}
          </div>

          <div className="relative border border-purple-300 rounded bg-white flex-1">
            {/* Reference image with opacity-0 to establish container dimensions (still takes up space unlike visibility:hidden) */}
            <img
              id={`comparison-right-${pageIndex}`}
              src={`data:image/png;base64,${processedImageBase64}`}
              alt="Reconstructed View"
              className="w-full h-auto block opacity-0"
              onLoad={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                const blocksForRender = (showTranslation && translatedBlocks) ? translatedBlocks : editableBlocks;

                console.log(`[RIGHT onLoad] Image loaded. Rect: ${img.getBoundingClientRect().width}x${img.getBoundingClientRect().height}`);
                console.log(`[RIGHT onLoad] Blocks to render: ${blocksForRender.length}, Mode: ${reconstructionMode}`);

                // Set canvas CSS dimensions to match image display size
                if (rightCanvasRef.current) {
                  const rect = img.getBoundingClientRect();
                  rightCanvasRef.current.style.width = `${rect.width}px`;
                  rightCanvasRef.current.style.height = `${rect.height}px`;
                  console.log(`[RIGHT onLoad] Canvas CSS set to: ${rect.width}x${rect.height}`);
                }

                if (reconstructionMode === 'overlay' || reconstructionMode === 'replace') {
                  const bgImg = new Image();
                  bgImg.onload = () => {
                    if (rightCanvasRef.current) {
                      console.log(`[RIGHT onLoad] Drawing with background image`);
                      drawBlocks(rightCanvasRef.current, img, true, reconstructionMode, bgImg, blocksForRender, tables);
                    }
                  };
                  bgImg.src = `data:image/png;base64,${originalImageBase64}`;
                } else {
                  if (rightCanvasRef.current) {
                    console.log(`[RIGHT onLoad] Drawing blank mode`);
                    drawBlocks(rightCanvasRef.current, img, true, 'blank', undefined, blocksForRender, tables);
                  }
                }
              }}
            />
            <canvas
              ref={rightCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-auto cursor-crosshair"
              onClick={(e) => {
                const img = document.getElementById(
                  `comparison-right-${pageIndex}`
                ) as HTMLImageElement;
                if (img && rightCanvasRef.current) {
                  handleCanvasClick(e, rightCanvasRef.current, img);
                }
              }}
              onMouseMove={(e) => {
                const img = document.getElementById(
                  `comparison-right-${pageIndex}`
                ) as HTMLImageElement;
                if (img && rightCanvasRef.current) {
                  handleCanvasMouseMove(e, rightCanvasRef.current, img);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Selected block info panel */}
      {selectedBlock && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-t-2 border-purple-300 p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {selectedBlockIndex! + 1}
              </div>
            </div>

            {!isEditing ? (
              // View mode - show block info
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-purple-800">Block Details</h4>
                  <button
                    onClick={() => startEditing(selectedBlockIndex!)}
                    className="px-3 py-1.5 text-xs rounded font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Block
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-600 font-semibold mb-1">TEXT:</p>
                    <p
                      className="font-medium"
                      style={{
                        color: selectedBlock.styles.color.hex,
                        fontFamily: selectedBlock.styles.fontFamily,
                        fontSize: '16px',
                      }}
                    >
                      {selectedBlock.text}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-600 font-semibold mb-2">COLORS:</p>
                    <div className="space-y-2">
                      {/* Text Color */}
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border-2 border-gray-300 shadow-inner"
                          style={{ backgroundColor: selectedBlock.styles.color.hex }}
                        />
                        <div className="text-xs">
                          <p className="font-mono font-semibold text-gray-800">
                            {selectedBlock.styles.color.hex}
                          </p>
                          <p className="text-gray-500 text-[10px]">Text</p>
                        </div>
                      </div>
                      {/* Background Color */}
                      {selectedBlock.styles.backgroundColor && (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border-2 border-gray-300 shadow-inner"
                            style={{ backgroundColor: selectedBlock.styles.backgroundColor.hex }}
                          />
                          <div className="text-xs">
                            <p className="font-mono font-semibold text-gray-800">
                              {selectedBlock.styles.backgroundColor.hex}
                            </p>
                            <p className="text-gray-500 text-[10px]">Background</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-600 font-semibold mb-2">FONT:</p>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-gray-800">
                        {selectedBlock.styles.fontFamily}
                      </p>
                      <p className="text-gray-600">
                        Weight: <span className="font-medium">{selectedBlock.styles.fontWeight}</span>
                      </p>
                      <p className="text-gray-600">
                        Orientation: <span className="font-medium">{selectedBlock.styles.orientation || 'Horizontal'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-600 font-semibold mb-2">SIZE:</p>
                    <div className="text-xs space-y-1">
                      <p className="text-gray-600">
                        Font: <span className="font-bold text-xl text-gray-800">{selectedBlock.styles.fontSize}pt</span>
                      </p>
                      <p className="text-gray-600">
                        BBox: {selectedBlock.bbox[2].toFixed(0)}x{selectedBlock.bbox[3].toFixed(0)}px
                      </p>
                      <p className="text-gray-600">
                        Confidence: <span className="font-medium">{(selectedBlock.confidence * 100).toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit mode - show edit form
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-yellow-700">Editing Block #{selectedBlockIndex! + 1}</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={saveEdits}
                      className="px-3 py-1.5 text-xs rounded font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1.5 text-xs rounded font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {/* Text input */}
                  <div className="col-span-4 bg-white rounded-lg p-3 border-2 border-yellow-300">
                    <label className="text-xs text-yellow-700 font-semibold mb-1 block">TEXT:</label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      rows={2}
                      style={{
                        color: editColor,
                        fontFamily: editFontFamily,
                      }}
                    />
                  </div>

                  {/* Font Family */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">FONT:</label>
                    <select
                      value={editFontFamily}
                      onChange={(e) => setEditFontFamily(e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                      <option value="Palatino">Palatino</option>
                      <option value="Garamond">Garamond</option>
                      <option value="Impact">Impact</option>
                    </select>
                  </div>

                  {/* Font Weight */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">WEIGHT:</label>
                    <select
                      value={editFontWeight}
                      onChange={(e) => setEditFontWeight(e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="light">Light</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">SIZE (pt):</label>
                    <input
                      type="number"
                      value={editFontSize}
                      onChange={(e) => setEditFontSize(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-yellow-400"
                      min={6}
                      max={200}
                    />
                  </div>

                  {/* Color */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">COLOR:</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="flex-1 p-1.5 border border-gray-300 rounded text-xs font-mono focus:ring-2 focus:ring-yellow-400"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  {/* Position X */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">X (px):</label>
                    <input
                      type="number"
                      value={editBboxX}
                      onChange={(e) => setEditBboxX(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-yellow-400"
                      min={0}
                    />
                  </div>

                  {/* Position Y */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">Y (px):</label>
                    <input
                      type="number"
                      value={editBboxY}
                      onChange={(e) => setEditBboxY(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-yellow-400"
                      min={0}
                    />
                  </div>

                  {/* Width */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">WIDTH (px):</label>
                    <input
                      type="number"
                      value={editBboxW}
                      onChange={(e) => setEditBboxW(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-yellow-400"
                      min={1}
                    />
                  </div>

                  {/* Height */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <label className="text-xs text-purple-600 font-semibold mb-1 block">HEIGHT (px):</label>
                    <input
                      type="number"
                      value={editBboxH}
                      onChange={(e) => setEditBboxH(Number(e.target.value))}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-yellow-400"
                      min={1}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
