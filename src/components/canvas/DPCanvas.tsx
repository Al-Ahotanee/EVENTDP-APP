import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Circle, Group } from 'react-konva';
import useImage from 'use-image';
import { useAppStore } from '@/store/appStore';
import { generateFrameDataUrl } from '@/utils/frameGenerator';
import type { Campaign } from '@/config/campaigns';
import type Konva from 'konva';

interface Props {
  campaign: Campaign;
  stageRef: React.RefObject<Konva.Stage | null>;
  previewSize?: number;
}

function FrameImage({ url, size }: { url: string; size: number }) {
  const [image] = useImage(url, 'anonymous');
  if (!image) return null;
  return <KonvaImage image={image} x={0} y={0} width={size} height={size} listening={false} />;
}

function UserPhoto({ dataUrl, canvasSize, campaign }: { dataUrl: string; canvasSize: number; campaign: Campaign }) {
  const store = useAppStore();
  const { imageX, imageY, imageScale, imageRotation } = store.canvas;
  const [image] = useImage(dataUrl);
  const scale = canvasSize / 1080;

  const photoPos = campaign.frameStyle.photoPosition;
  const photoR = campaign.frameStyle.photoRadius;
  const cx = photoPos.x * scale;
  const cy = photoPos.y * scale;
  const r = photoR * scale;

  if (!image) return null;

  const imgW = image.width || 400;
  const imgH = image.height || 400;
  const baseScale = (r * 2) / Math.min(imgW, imgH);
  const finalScale = baseScale * imageScale;
  const drawW = imgW * finalScale;
  const drawH = imgH * finalScale;

  return (
    <Group
      clipFunc={(ctx) => {
        ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
      }}
    >
      <KonvaImage
        image={image}
        x={cx + imageX * scale - drawW / 2}
        y={cy + imageY * scale - drawH / 2}
        width={drawW}
        height={drawH}
        rotation={imageRotation}
        offsetX={drawW / 2}
        offsetY={drawH / 2}
        draggable
        onDragMove={(e) => {
          const node = e.target;
          const nx = (node.x() + drawW / 2 - cx) / scale;
          const ny = (node.y() + drawH / 2 - cy) / scale;
          store.setImagePosition(nx, ny);
        }}
      />
    </Group>
  );
}

function NameText({ campaign, canvasSize }: { campaign: Campaign; canvasSize: number }) {
  const { attendeeName } = useAppStore((s) => s.canvas);
  const scale = canvasSize / 1080;
  const { typography, frameStyle } = campaign;

  if (!attendeeName) return null;

  const namePos = frameStyle.namePosition;
  const fontSize = typography.nameFontSize * scale;
  const x = namePos.x * scale;
  const y = namePos.y * scale;

  return (
    <Text
      text={attendeeName.toUpperCase()}
      x={x - 300 * scale}
      y={y}
      width={600 * scale}
      align="center"
      fontSize={fontSize}
      fontFamily={typography.nameFont + ', serif'}
      fontStyle="bold"
      fill={typography.nameColor}
      shadowColor="rgba(0,0,0,0.6)"
      shadowBlur={8}
      shadowOffsetY={2}
      listening={false}
    />
  );
}

export default function DPCanvas({ campaign, stageRef, previewSize = 540 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(previewSize);
  const frameDataUrl = generateFrameDataUrl(campaign, 1080);
  const { canvas } = useAppStore();

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setCanvasSize(Math.min(w, previewSize));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [previewSize]);

  return (
    <div ref={containerRef} className="w-full flex items-center justify-center">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: canvasSize, height: canvasSize }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${campaign.themeColors.bg} 0%, ${campaign.themeColors.primary}80 100%)` }}
        />

        <Stage
          ref={stageRef as React.RefObject<Konva.Stage>}
          width={canvasSize}
          height={canvasSize}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Layer>
            {/* User photo (behind frame) */}
            {canvas.imageDataUrl && (
              <UserPhoto
                dataUrl={canvas.imageDataUrl}
                canvasSize={canvasSize}
                campaign={campaign}
              />
            )}

            {/* Placeholder circle when no photo */}
            {!canvas.imageDataUrl && (
              <Circle
                x={campaign.frameStyle.photoPosition.x * (canvasSize / 1080)}
                y={campaign.frameStyle.photoPosition.y * (canvasSize / 1080)}
                radius={campaign.frameStyle.photoRadius * (canvasSize / 1080)}
                fill={campaign.themeColors.primary + '50'}
                stroke={campaign.themeColors.accent + '60'}
                strokeWidth={2}
              />
            )}

            {/* Frame overlay */}
            <FrameImage url={frameDataUrl} size={canvasSize} />

            {/* Attendee name */}
            <NameText campaign={campaign} canvasSize={canvasSize} />
          </Layer>
        </Stage>

        {/* Upload prompt overlay when no image */}
        {!canvas.imageDataUrl && (
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: campaign.frameStyle.photoPosition.x * (canvasSize / 1080) - campaign.frameStyle.photoRadius * (canvasSize / 1080),
              top: campaign.frameStyle.photoPosition.y * (canvasSize / 1080) - campaign.frameStyle.photoRadius * (canvasSize / 1080),
              width: campaign.frameStyle.photoRadius * 2 * (canvasSize / 1080),
              height: campaign.frameStyle.photoRadius * 2 * (canvasSize / 1080),
              borderRadius: '50%',
            }}
          >
            <div className="text-center">
              <div className="text-3xl mb-1">📷</div>
              <p className="text-xs font-medium opacity-70" style={{ color: campaign.themeColors.text }}>
                Upload your photo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the canvas to a PNG at full resolution (1080x1080)
export async function exportCanvasHD(
  campaign: Campaign,
  attendeeName: string,
  imageDataUrl: string | null,
  imageX: number,
  imageY: number,
  imageScale: number,
  imageRotation: number,
  format: 'png' | 'jpeg' = 'png'
): Promise<string> {
  const SIZE = campaign.exportSize.width;
  const { typography, frameStyle, themeColors } = campaign;

  const offscreen = document.createElement('canvas');
  offscreen.width = SIZE;
  offscreen.height = SIZE;
  const ctx = offscreen.getContext('2d')!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, themeColors.bg);
  bg.addColorStop(1, themeColors.primary + '80');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // User photo inside circle
  if (imageDataUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const cx = frameStyle.photoPosition.x;
        const cy = frameStyle.photoPosition.y;
        const r = frameStyle.photoRadius;
        const baseScale = (r * 2) / Math.min(img.width, img.height);
        const finalScale = baseScale * imageScale;
        const drawW = img.width * finalScale;
        const drawH = img.height * finalScale;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();

        ctx.translate(cx + imageX, cy + imageY);
        ctx.rotate((imageRotation * Math.PI) / 180);
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = imageDataUrl;
    });
  }

  // Frame overlay
  const frameSvgUrl = generateFrameDataUrl(campaign, SIZE);
  await new Promise<void>((resolve) => {
    const frameImg = new Image();
    frameImg.onload = () => {
      ctx.drawImage(frameImg, 0, 0, SIZE, SIZE);
      resolve();
    };
    frameImg.onerror = () => resolve();
    frameImg.src = frameSvgUrl;
  });

  // Attendee name
  if (attendeeName) {
    const namePos = frameStyle.namePosition;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `bold ${typography.nameFontSize}px "${typography.nameFont}", serif`;
    ctx.fillStyle = typography.nameColor;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillText(attendeeName.toUpperCase(), namePos.x, namePos.y + typography.nameFontSize * 0.35);
    ctx.restore();
  }

  const quality = format === 'jpeg' ? 0.95 : undefined;
  return offscreen.toDataURL(`image/${format}`, quality);
}
