#!/usr/bin/env python3
"""Generate the polished jetztaber>PROMPT! vector and raster identity assets."""

from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTCollection
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
FONT_PATH = Path("/System/Library/Fonts/Avenir Next.ttc")

ORANGE = "#FF4F00"
CHARCOAL = "#171717"
WARM_WHITE = "#FAF7F2"
WHITE = "#FFFFFF"
WORDMARK_SEPARATOR_GAP = 0


def chevron_points(x: float, cy: float, width: float, height: float):
    """Six-point chevron with an assertive, compact terminal-like silhouette."""
    inset = width * 0.34
    return [
        (x, cy - height / 2),
        (x + inset, cy - height / 2),
        (x + width, cy),
        (x + inset, cy + height / 2),
        (x, cy + height / 2),
        (x + width - inset, cy),
    ]


def svg_points(points):
    return " ".join(f"{x:.2f},{y:.2f}" for x, y in points)


def svg_shell(width, height, body, title, description, background=None):
    elements = []
    if background:
        elements.append(f'  <rect width="{width}" height="{height}" fill="{background}"/>')
    elements.append(body.strip("\n"))
    content = "\n".join(elements)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">{description}</desc>
{content}
</svg>
'''


def build_mark_svg(dark=False):
    exclamation = WHITE if dark else CHARCOAL
    body = f'''
  <polygon points="{svg_points(chevron_points(70, 256, 226, 256))}" fill="{ORANGE}"/>
  <path d="M350 124H420L411 306H359Z" fill="{exclamation}"/>
  <circle cx="385" cy="369" r="35" fill="{exclamation}"/>'''
    return svg_shell(
        512,
        512,
        body,
        "jetztaber>PROMPT! symbol",
        "An orange prompt chevron followed by a bold exclamation mark.",
        CHARCOAL if dark else None,
    )


class OutlineFont:
    def __init__(self, face_index):
        self.collection = TTCollection(str(FONT_PATH))
        self.ttfont = self.collection.fonts[face_index]
        self.glyph_set = self.ttfont.getGlyphSet()
        self.glyph_order = self.ttfont.getGlyphOrder()
        font_data = FONT_PATH.read_bytes()
        face = hb.Face(font_data, face_index)
        self.upem = face.upem
        self.hbfont = hb.Font(face)
        self.hbfont.scale = (self.upem, self.upem)

    def shape(self, text, size, x, baseline):
        buffer = hb.Buffer()
        buffer.add_str(text)
        buffer.guess_segment_properties()
        hb.shape(self.hbfont, buffer, {"kern": True})
        scale = size / self.upem
        cursor = x
        commands = []
        for info, pos in zip(buffer.glyph_infos, buffer.glyph_positions):
            glyph_name = self.glyph_order[info.codepoint]
            pen = SVGPathPen(self.glyph_set)
            transform = (
                scale,
                0,
                0,
                -scale,
                cursor + pos.x_offset * scale,
                baseline - pos.y_offset * scale,
            )
            self.glyph_set[glyph_name].draw(TransformPen(pen, transform))
            commands.append(pen.getCommands())
            cursor += pos.x_advance * scale
        return " ".join(commands), cursor


def build_wordmark_svg(dark=False):
    regular = OutlineFont(7)
    heavy = OutlineFont(8)
    text_color = WHITE if dark else CHARCOAL

    baseline = 250
    left = 64
    regular_path, x = regular.shape("jetztaber", 176, left, baseline)
    chevron_x = x + WORDMARK_SEPARATOR_GAP
    chevron_width = 94
    chevron_height = 104
    chevron_cy = 202
    heavy_x = chevron_x + chevron_width + WORDMARK_SEPARATOR_GAP
    heavy_path, end_x = heavy.shape("PROMPT!", 184, heavy_x, baseline)
    width = int(end_x + 66)
    body = f'''
  <path d="{regular_path}" fill="{text_color}"/>
  <polygon points="{svg_points(chevron_points(chevron_x, chevron_cy, chevron_width, chevron_height))}" fill="{ORANGE}"/>
  <path d="{heavy_path}" fill="{text_color}"/>'''
    return svg_shell(
        width,
        340,
        body,
        "jetztaber>PROMPT! wordmark",
        "The word jetztaber, an orange prompt chevron set directly between the words, and PROMPT! in heavy weight.",
        CHARCOAL if dark else None,
    ), width


def load_fonts(scale=1):
    regular = ImageFont.truetype(str(FONT_PATH), 176 * scale, index=7)
    heavy = ImageFont.truetype(str(FONT_PATH), 184 * scale, index=8)
    return regular, heavy


def render_mark_png(size=1024, dark=False, transparent=True):
    scale = size / 512
    if transparent:
        image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    else:
        bg = CHARCOAL if dark else WARM_WHITE
        image = Image.new("RGBA", (size, size), bg)
    draw = ImageDraw.Draw(image)
    points = [(round(x * scale), round(y * scale)) for x, y in chevron_points(70, 256, 226, 256)]
    draw.polygon(points, fill=ORANGE)
    exclamation = WHITE if dark else CHARCOAL
    draw.polygon(
        [(350 * scale, 124 * scale), (420 * scale, 124 * scale), (411 * scale, 306 * scale), (359 * scale, 306 * scale)],
        fill=exclamation,
    )
    draw.ellipse(
        [(350 * scale, 334 * scale), (420 * scale, 404 * scale)],
        fill=exclamation,
    )
    return image


def render_wordmark_png(width=2400, dark=False, transparent=True):
    base_scale = 2
    regular, heavy = load_fonts(base_scale)
    canvas = Image.new("RGBA", (4800, 680), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    color = WHITE if dark else CHARCOAL
    baseline = 500
    x = 128
    draw.text((x, baseline), "jetztaber", fill=color, font=regular, anchor="ls")
    bbox = draw.textbbox((x, baseline), "jetztaber", font=regular, anchor="ls")
    chevron_x = bbox[2] + WORDMARK_SEPARATOR_GAP * base_scale
    chevron = chevron_points(chevron_x, 404, 188, 208)
    draw.polygon(chevron, fill=ORANGE)
    heavy_x = chevron_x + 188 + WORDMARK_SEPARATOR_GAP * base_scale
    draw.text((heavy_x, baseline), "PROMPT!", fill=color, font=heavy, anchor="ls")
    right = draw.textbbox((heavy_x, baseline), "PROMPT!", font=heavy, anchor="ls")[2] + 132
    crop = canvas.crop((0, 0, right, 680))
    if not transparent:
        bg = Image.new("RGBA", crop.size, CHARCOAL if dark else WARM_WHITE)
        bg.alpha_composite(crop)
        crop = bg
    target_height = round(crop.height * (width / crop.width))
    return crop.resize((width, target_height), Image.Resampling.LANCZOS)


def build_preview():
    image = Image.new("RGB", (2400, 1500), WARM_WHITE)
    draw = ImageDraw.Draw(image)
    label_font = ImageFont.truetype(str(FONT_PATH), 34, index=2)
    small_font = ImageFont.truetype(str(FONT_PATH), 26, index=7)

    draw.text((120, 92), "jetztaber>PROMPT! — primary identity", fill=CHARCOAL, font=label_font)
    draw.text((120, 146), "International Orange  #FF4F00   ·   Charcoal  #171717", fill="#66615B", font=small_font)

    mark = render_mark_png(520, transparent=True)
    image.paste(mark, (180, 260), mark)

    wordmark = render_wordmark_png(1450, transparent=True)
    image.paste(wordmark, (790, 345), wordmark)

    draw.rounded_rectangle((100, 900, 2300, 1380), radius=42, fill=CHARCOAL)
    dark_mark = render_mark_png(350, dark=True, transparent=True)
    image.paste(dark_mark, (210, 965), dark_mark)
    dark_wordmark = render_wordmark_png(1420, dark=True, transparent=True)
    image.paste(dark_wordmark, (690, 1010), dark_wordmark)

    return image


def main():
    mark_svg = build_mark_svg(False)
    mark_dark_svg = build_mark_svg(True)
    wordmark_svg, _ = build_wordmark_svg(False)
    wordmark_dark_svg, _ = build_wordmark_svg(True)

    (ROOT / "jetztaber-mark.svg").write_text(mark_svg, encoding="utf-8")
    (ROOT / "jetztaber-mark-reversed.svg").write_text(mark_dark_svg, encoding="utf-8")
    (ROOT / "jetztaber-wordmark.svg").write_text(wordmark_svg, encoding="utf-8")
    (ROOT / "jetztaber-wordmark-reversed.svg").write_text(wordmark_dark_svg, encoding="utf-8")

    render_mark_png(1024, transparent=True).save(ROOT / "jetztaber-mark-1024.png")
    render_mark_png(512, transparent=True).save(ROOT / "jetztaber-mark-512.png")
    render_mark_png(32, transparent=True).save(ROOT / "jetztaber-favicon-32.png")
    render_wordmark_png(2400, transparent=True).save(ROOT / "jetztaber-wordmark-2400.png")
    build_preview().save(ROOT / "jetztaber-identity-preview.png", quality=95)


if __name__ == "__main__":
    main()
