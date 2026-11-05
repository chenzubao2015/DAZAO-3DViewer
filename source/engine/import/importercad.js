import { Coord3D } from '../geometry/coord3d.js';
import { Direction } from '../geometry/geometry.js';
import { ArrayBufferToUtf8String } from '../io/bufferutils.js';
import { RGBColor } from '../model/color.js';
import { Line } from '../model/line.js';
import { PhongMaterial } from '../model/material.js';
import { Mesh } from '../model/mesh.js';
import { Triangle } from '../model/triangle.js';
import { ImporterBase } from './importerbase.js';
import { LoadExternalLibraryFromUrl } from '../io/externallibs.js';
import { DxfParser } from '@mlightcad/dxf-json';
import { LibreDwg, Dwg_File_Type, createModule } from '@mlightcad/libredwg-web';

const AUTO_CAD_COLOR_INDEX = [
    0x000000, 0xFF0000, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFF00FF, 0x1E293B, 0x808080,
    0xC0C0C0, 0xFF0000, 0xFF7F7F, 0xCC0000, 0xCC6666, 0x990000, 0x994C4C, 0x7F0000,
    0x7F3F3F, 0x4C0000, 0x4C2626, 0xFF3F00, 0xFF9F7F, 0xCC3300, 0xCC7F66, 0x992600,
    0x995F4C, 0x7F1F00, 0x7F4F3F, 0x4C1300, 0x4C2F26, 0xFF7F00, 0xFFBF7F, 0xCC6600,
    0xCC9966, 0x994C00, 0x99724C, 0x7F3F00, 0x7F5F3F, 0x4C2600, 0x4C3926, 0xFFBF00,
    0xFFDF7F, 0xCC9900, 0xCCB266, 0x997200, 0x99854C, 0x7F5F00, 0x7F6F3F, 0x4C3900,
    0x4C4226, 0xFFFF00, 0xFFFF7F, 0xCCCC00, 0xCCCC66, 0x989800, 0x98984C, 0x7F7F00,
    0x7F7F3F, 0x4C4C00, 0x4C4C26, 0xBFFF00, 0xDFFF7F, 0x99CC00, 0xB2CC66, 0x729900,
    0x85994C, 0x5F7F00, 0x6F7F3F, 0x394C00, 0x424C26, 0x7FFF00, 0xBFFF7F, 0x66CC00,
    0x99CC66, 0x4C9900, 0x72994C, 0x3F7F00, 0x5F7F3F, 0x264C00, 0x394C26, 0x3FFF00,
    0x9FFF7F, 0x33CC00, 0x7FCC66, 0x269900, 0x5F994C, 0x1F7F00, 0x4F7F3F, 0x134C00,
    0x2F4C26, 0x00FF00, 0x7FFF7F, 0x00CC00, 0x66CC66, 0x009900, 0x4C994C, 0x007F00,
    0x3F7F3F, 0x004C00, 0x264C26, 0x00FF3F, 0x7FFF9F, 0x00CC33, 0x66CC7F, 0x009926,
    0x4C995F, 0x007F1F, 0x3F7F4F, 0x004C13, 0x264C2F, 0x00FF7F, 0x7FFFBF, 0x00CC66,
    0x66CC99, 0x00994C, 0x4C9972, 0x007F3F, 0x3F7F5F, 0x004C26, 0x264C39, 0x00FFBF,
    0x7FFFDF, 0x00CC99, 0x66CCB2, 0x009972, 0x4C9985, 0x007F5F, 0x3F7F6F, 0x004C39,
    0x264C42, 0x00FFFF, 0x7FFFFF, 0x00CCCC, 0x66CCCC, 0x009999, 0x4C9999, 0x007F7F,
    0x3F7F7F, 0x004C4C, 0x264C4C, 0x00BFFF, 0x7FDFFF, 0x0099CC, 0x66B2CC, 0x007299,
    0x4C8599, 0x005F7F, 0x3F6F7F, 0x00394C, 0x26424C, 0x007FFF, 0x7FBFFF, 0x0066CC,
    0x6699CC, 0x004C99, 0x4C7299, 0x003F7F, 0x3F5F7F, 0x00264C, 0x26394C, 0x003FFF,
    0x7F9FFF, 0x0033CC, 0x667FCC, 0x002699, 0x4C5F99, 0x001F7F, 0x3F4F7F, 0x00134C,
    0x262F4C, 0x0000FF, 0x7F7FFF, 0x0000CC, 0x6666CC, 0x000099, 0x4C4C99, 0x00007F,
    0x3F3F7F, 0x00004C, 0x26264C, 0x3F00FF, 0x9F7FFF, 0x3300CC, 0x7F66CC, 0x260099,
    0x5F4C99, 0x1F007F, 0x4F3F7F, 0x13004C, 0x2F264C, 0x7F00FF, 0xBF7FFF, 0x6600CC,
    0x9966CC, 0x4C0099, 0x724C99, 0x3F007F, 0x5F3F7F, 0x26004C, 0x39264C, 0xBF00FF,
    0xDF7FFF, 0x9900CC, 0xB266CC, 0x720099, 0x854C99, 0x5F007F, 0x6F3F7F, 0x39004C,
    0x42264C, 0xFF00FF, 0xFF7FFF, 0xCC00CC, 0xCC66CC, 0x980098, 0x984C98, 0x7F007F,
    0x7F3F7F, 0x4C004C, 0x4C264C, 0xFF00BF, 0xFF7FDF, 0xCC0099, 0xCC66B2, 0x980072,
    0x984C85, 0x7F005F, 0x7F3F6F, 0x4C0039, 0x4C2642, 0xFF007F, 0xFF7FBF, 0xCC0066,
    0xCC6699, 0x98004C, 0x984C72, 0x7F003F, 0x7F3F5F, 0x4C0026, 0x4C2639, 0xFF003F,
    0xFF7F9F, 0xCC0033, 0xCC667F, 0x980026, 0x984C5F, 0x7F001F, 0x7F3F4F, 0x4C0013,
    0x4C262F, 0x333333, 0x5B5B5B, 0x848484, 0xADADAD, 0xD6D6D6, 0x1E293B, 0x000000
];

const STROKE_GLYPHS = {
    '0': [[[0.15, 0.15], [0.15, 0.85], [0.3, 1.0], [0.7, 1.0], [0.85, 0.85], [0.85, 0.15], [0.7, 0.0], [0.3, 0.0], [0.15, 0.15]]],
    '1': [[[0.3, 0.8], [0.5, 1.0], [0.5, 0.0]], [[0.25, 0.0], [0.75, 0.0]]],
    '2': [[[0.15, 0.8], [0.3, 1.0], [0.7, 1.0], [0.85, 0.8], [0.85, 0.6], [0.15, 0.0], [0.85, 0.0]]],
    '3': [[[0.15, 0.85], [0.3, 1.0], [0.7, 1.0], [0.85, 0.85], [0.85, 0.65], [0.7, 0.5], [0.4, 0.5]], [[0.7, 0.5], [0.85, 0.35], [0.85, 0.15], [0.7, 0.0], [0.3, 0.0], [0.15, 0.15]]],
    '4': [[[0.7, 0.0], [0.7, 1.0], [0.1, 0.35], [0.9, 0.35]]],
    '5': [[[0.85, 1.0], [0.15, 1.0], [0.15, 0.55], [0.7, 0.55], [0.85, 0.4], [0.85, 0.15], [0.7, 0.0], [0.3, 0.0], [0.15, 0.15]]],
    '6': [[[0.8, 0.85], [0.65, 1.0], [0.3, 1.0], [0.15, 0.85], [0.15, 0.15], [0.3, 0.0], [0.7, 0.0], [0.85, 0.15], [0.85, 0.4], [0.7, 0.55], [0.15, 0.55]]],
    '7': [[[0.15, 1.0], [0.85, 1.0], [0.35, 0.0]]],
    '8': [[[0.3, 0.5], [0.15, 0.65], [0.15, 0.85], [0.3, 1.0], [0.7, 1.0], [0.85, 0.85], [0.85, 0.65], [0.7, 0.5], [0.3, 0.5], [0.15, 0.35], [0.15, 0.15], [0.3, 0.0], [0.7, 0.0], [0.85, 0.15], [0.85, 0.35], [0.7, 0.5]]],
    '9': [[[0.85, 0.45], [0.3, 0.45], [0.15, 0.6], [0.15, 0.85], [0.3, 1.0], [0.7, 1.0], [0.85, 0.85], [0.85, 0.15], [0.7, 0.0], [0.35, 0.0], [0.2, 0.15]]],
    'A': [[[0.1, 0.0], [0.5, 1.0], [0.9, 0.0]], [[0.25, 0.35], [0.75, 0.35]]],
    'B': [[[0.15, 0.0], [0.15, 1.0], [0.65, 1.0], [0.8, 0.85], [0.8, 0.65], [0.65, 0.5], [0.15, 0.5]], [[0.65, 0.5], [0.85, 0.35], [0.85, 0.15], [0.65, 0.0], [0.15, 0.0]]],
    'C': [[[0.85, 0.8], [0.7, 1.0], [0.3, 1.0], [0.15, 0.8], [0.15, 0.2], [0.3, 0.0], [0.7, 0.0], [0.85, 0.2]]],
    'D': [[[0.15, 0.0], [0.15, 1.0], [0.6, 1.0], [0.85, 0.75], [0.85, 0.25], [0.6, 0.0], [0.15, 0.0]]],
    'E': [[[0.85, 1.0], [0.15, 1.0], [0.15, 0.0], [0.85, 0.0]], [[0.15, 0.5], [0.65, 0.5]]],
    'F': [[[0.85, 1.0], [0.15, 1.0], [0.15, 0.0]], [[0.15, 0.5], [0.65, 0.5]]],
    'G': [[[0.85, 0.8], [0.7, 1.0], [0.3, 1.0], [0.15, 0.8], [0.15, 0.2], [0.3, 0.0], [0.7, 0.0], [0.85, 0.2], [0.85, 0.45], [0.55, 0.45]]],
    'H': [[[0.15, 0.0], [0.15, 1.0]], [[0.85, 0.0], [0.85, 1.0]], [[0.15, 0.5], [0.85, 0.5]]],
    'I': [[[0.3, 1.0], [0.7, 1.0]], [[0.5, 1.0], [0.5, 0.0]], [[0.3, 0.0], [0.7, 0.0]]],
    'J': [[[0.75, 1.0], [0.75, 0.2], [0.6, 0.0], [0.3, 0.0], [0.15, 0.2]]],
    'K': [[[0.15, 0.0], [0.15, 1.0]], [[0.85, 1.0], [0.15, 0.45]], [[0.35, 0.6], [0.85, 0.0]]],
    'L': [[[0.15, 1.0], [0.15, 0.0], [0.85, 0.0]]],
    'M': [[[0.1, 0.0], [0.1, 1.0], [0.5, 0.3], [0.9, 1.0], [0.9, 0.0]]],
    'N': [[[0.15, 0.0], [0.15, 1.0], [0.85, 0.0], [0.85, 1.0]]],
    'O': [[[0.3, 0.0], [0.15, 0.2], [0.15, 0.8], [0.3, 1.0], [0.7, 1.0], [0.85, 0.8], [0.85, 0.2], [0.7, 0.0], [0.3, 0.0]]],
    'P': [[[0.15, 0.0], [0.15, 1.0], [0.7, 1.0], [0.85, 0.85], [0.85, 0.65], [0.7, 0.5], [0.15, 0.5]]],
    'Q': [[[0.3, 0.0], [0.15, 0.2], [0.15, 0.8], [0.3, 1.0], [0.7, 1.0], [0.85, 0.8], [0.85, 0.2], [0.7, 0.0], [0.3, 0.0]], [[0.55, 0.3], [0.9, 0.0]]],
    'R': [[[0.15, 0.0], [0.15, 1.0], [0.7, 1.0], [0.85, 0.85], [0.85, 0.65], [0.7, 0.5], [0.15, 0.5]], [[0.5, 0.5], [0.85, 0.0]]],
    'S': [[[0.85, 0.85], [0.7, 1.0], [0.3, 1.0], [0.15, 0.85], [0.15, 0.65], [0.3, 0.5], [0.7, 0.5], [0.85, 0.35], [0.85, 0.15], [0.7, 0.0], [0.3, 0.0], [0.15, 0.15]]],
    'T': [[[0.1, 1.0], [0.9, 1.0]], [[0.5, 1.0], [0.5, 0.0]]],
    'U': [[[0.15, 1.0], [0.15, 0.2], [0.3, 0.0], [0.7, 0.0], [0.85, 0.2], [0.85, 1.0]]],
    'V': [[[0.1, 1.0], [0.5, 0.0], [0.9, 1.0]]],
    'W': [[[0.05, 1.0], [0.25, 0.0], [0.5, 0.7], [0.75, 0.0], [0.95, 1.0]]],
    'X': [[[0.15, 1.0], [0.85, 0.0]], [[0.85, 1.0], [0.15, 0.0]]],
    'Y': [[[0.15, 1.0], [0.5, 0.5], [0.5, 0.0]], [[0.85, 1.0], [0.5, 0.5]]],
    'Z': [[[0.15, 1.0], [0.85, 1.0], [0.15, 0.0], [0.85, 0.0]]],
    '.': [[[0.45, 0.0], [0.55, 0.0], [0.55, 0.1], [0.45, 0.1], [0.45, 0.0]]],
    ',': [[[0.5, 0.1], [0.4, -0.15]]],
    '-': [[[0.2, 0.5], [0.8, 0.5]]],
    '+': [[[0.2, 0.5], [0.8, 0.5]], [[0.5, 0.2], [0.5, 0.8]]],
    '=': [[[0.2, 0.65], [0.8, 0.65]], [[0.2, 0.35], [0.8, 0.35]]],
    '/': [[[0.2, 0.0], [0.8, 1.0]]],
    '\\': [[[0.2, 1.0], [0.8, 0.0]]],
    ':': [[[0.45, 0.7], [0.55, 0.7], [0.55, 0.8], [0.45, 0.8], [0.45, 0.7]], [[0.45, 0.1], [0.55, 0.1], [0.55, 0.2], [0.45, 0.2], [0.45, 0.1]]],
    '(': [[[0.65, 1.0], [0.4, 0.7], [0.4, 0.3], [0.65, 0.0]]],
    ')': [[[0.35, 1.0], [0.6, 0.7], [0.6, 0.3], [0.35, 0.0]]],
    '[': [[[0.65, 1.0], [0.35, 1.0], [0.35, 0.0], [0.65, 0.0]]],
    ']': [[[0.35, 1.0], [0.65, 1.0], [0.65, 0.0], [0.35, 0.0]]],
    '*': [[[0.2, 0.2], [0.8, 0.8]], [[0.2, 0.8], [0.8, 0.2]], [[0.5, 0.15], [0.5, 0.85]]],
    '%': [[[0.2, 0.0], [0.8, 1.0]], [[0.2, 0.8], [0.35, 0.8], [0.35, 0.95], [0.2, 0.95], [0.2, 0.8]], [[0.65, 0.05], [0.8, 0.05], [0.8, 0.2], [0.65, 0.2], [0.65, 0.05]]],
    '°': [[[0.35, 0.8], [0.5, 0.95], [0.65, 0.8], [0.5, 0.65], [0.35, 0.8]]],
    '±': [[[0.2, 0.65], [0.8, 0.65]], [[0.5, 0.4], [0.5, 0.9]], [[0.2, 0.15], [0.8, 0.15]]],
    'Ø': [[[0.3, 0.1], [0.15, 0.25], [0.15, 0.75], [0.3, 0.9], [0.7, 0.9], [0.85, 0.75], [0.85, 0.25], [0.7, 0.1], [0.3, 0.1]], [[0.15, 0.0], [0.85, 1.0]]],
    '⌀': [[[0.3, 0.1], [0.15, 0.25], [0.15, 0.75], [0.3, 0.9], [0.7, 0.9], [0.85, 0.75], [0.85, 0.25], [0.7, 0.1], [0.3, 0.1]], [[0.15, 0.0], [0.85, 1.0]]],
    '_': [[[0.1, 0.0], [0.9, 0.0]]],
    '<': [[[0.75, 0.85], [0.25, 0.5], [0.75, 0.15]]],
    '>': [[[0.25, 0.85], [0.75, 0.5], [0.25, 0.15]]]
};

let libreDwgInstancePromise = null;
const canvasGlyphCache = new Map ();

function GetCanvasGlyphStrokes (ch)
{
    if (canvasGlyphCache.has (ch)) {
        return canvasGlyphCache.get (ch);
    }
    if (typeof document === 'undefined') {
        const fallback = [[[0.15, 0.15], [0.85, 0.15], [0.85, 0.85], [0.15, 0.85], [0.15, 0.15]]];
        canvasGlyphCache.set (ch, fallback);
        return fallback;
    }
    try {
        const size = 24;
        const canvas = document.createElement ('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext ('2d');
        ctx.fillStyle = '#000';
        ctx.font = `bold ${size - 4}px "Microsoft YaHei", "SimHei", sans-serif`;
        ctx.textBaseline = 'bottom';
        ctx.fillText (ch, 1, size - 2);
        const img = ctx.getImageData (0, 0, size, size).data;
        const strokes = [];
        const visited = new Uint8Array (size * size);
        const isSet = (x, y) => {
            if (x < 0 || x >= size || y < 0 || y >= size) {
                return false;
            }
            return img[(y * size + x) * 4 + 3] > 96;
        };
        // Horizontal and vertical run-length / skeleton extraction
        for (let y = 0; y < size; y += 2) {
            let startX = -1;
            for (let x = 0; x <= size; x++) {
                if (x < size && isSet (x, y)) {
                    if (startX === -1) {
                        startX = x;
                    }
                } else if (startX !== -1) {
                    const endX = x - 1;
                    if (endX > startX) {
                        strokes.push ([
                            [startX / size, 1.0 - y / size],
                            [endX / size, 1.0 - y / size]
                        ]);
                    }
                    startX = -1;
                }
            }
        }
        for (let x = 0; x < size; x += 2) {
            let startY = -1;
            for (let y = 0; y <= size; y++) {
                if (y < size && isSet (x, y)) {
                    if (startY === -1) {
                        startY = y;
                    }
                } else if (startY !== -1) {
                    const endY = y - 1;
                    if (endY > startY) {
                        strokes.push ([
                            [x / size, 1.0 - startY / size],
                            [x / size, 1.0 - endY / size]
                        ]);
                    }
                    startY = -1;
                }
            }
        }
        if (strokes.length === 0) {
            strokes.push ([[0.15, 0.15], [0.85, 0.15], [0.85, 0.85], [0.15, 0.85], [0.15, 0.15]]);
        }
        canvasGlyphCache.set (ch, strokes);
        return strokes;
    } catch (e) {
        const fallback = [[[0.15, 0.15], [0.85, 0.15], [0.85, 0.85], [0.15, 0.85], [0.15, 0.15]]];
        canvasGlyphCache.set (ch, fallback);
        return fallback;
    }
}

export class ImporterCad extends ImporterBase
{
    constructor ()
    {
        super ();
    }

    CanImportExtension (extension)
    {
        return extension === 'dxf' || extension === 'dwg';
    }

    GetUpDirection ()
    {
        return Direction.Y;
    }

    ClearContent ()
    {
        this.layerMeshes = null;
        this.colorToMaterialIndex = null;
        this.layersMap = null;
        this.blocksMap = null;
        this.isDwg = false;
    }

    ResetContent ()
    {
        this.layerMeshes = new Map ();
        this.colorToMaterialIndex = new Map ();
        this.layersMap = new Map ();
        this.blocksMap = new Map ();
        this.isDwg = false;
    }

    ImportContent (fileContent, onFinish)
    {
        if (this.extension === 'dxf') {
            this.isDwg = false;
            this.ImportDxfContent (fileContent, onFinish);
        } else if (this.extension === 'dwg') {
            this.isDwg = true;
            this.ImportDwgContent (fileContent, onFinish);
        } else {
            this.SetError ('Unsupported CAD format.');
            onFinish ();
        }
    }

    ImportDxfContent (fileContent, onFinish)
    {
        try {
            const parser = new DxfParser ();
            let parsed = null;
            try {
                parsed = parser.parseBuffer (new Uint8Array (fileContent));
            } catch (err) {
                const text = ArrayBufferToUtf8String (fileContent);
                parsed = parser.parseSync (text);
            }
            if (!parsed) {
                this.SetError ('Failed to parse DXF file.');
                onFinish ();
                return;
            }
            this.BuildModelFromDatabase (parsed, false);
            onFinish ();
        } catch (err) {
            this.SetError (err && err.message ? err.message : 'Failed to import DXF file.');
            onFinish ();
        }
    }

    ImportDwgContent (fileContent, onFinish)
    {
        this.GetLibreDwgInstance ().then ((libredwg) => {
            let dwgData = null;
            try {
                dwgData = libredwg.dwg_read_data (fileContent, Dwg_File_Type.DWG);
                if (!dwgData) {
                    this.SetError ('Failed to read DWG data.');
                    onFinish ();
                    return;
                }
                const db = libredwg.convert (dwgData);
                libredwg.dwg_free (dwgData);
                dwgData = null;
                this.BuildModelFromDatabase (db, true);
                onFinish ();
            } catch (err) {
                if (dwgData !== null) {
                    try {
                        libredwg.dwg_free (dwgData);
                    } catch (e) {
                        // ignore cleanup error
                    }
                }
                this.SetError (err && err.message ? err.message : 'Failed to import DWG file.');
                onFinish ();
            }
        }).catch ((err) => {
            this.SetError (err && err.message ? err.message : 'Failed to load DWG WebAssembly module.');
            onFinish ();
        });
    }

    GetLibreDwgInstance ()
    {
        if (libreDwgInstancePromise === null) {
            const isFileProtocol = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
            const loadFromBase64Script = () => {
                let scriptUrl = 'assets/libs/libredwg-wasm-base64.js';
                try {
                    scriptUrl = new URL ('assets/libs/libredwg-wasm-base64.js', window.location.href).href;
                } catch (e) {
                    // keep relative fallback
                }
                return LoadExternalLibraryFromUrl (scriptUrl).then (() => {
                    const b64 = (typeof window !== 'undefined') ? window.__LIBREDWG_WASM_BASE64__ : null;
                    if (!b64) {
                        throw new Error ('Missing embedded DWG WASM payload.');
                    }
                    const binaryStr = atob (b64);
                    const len = binaryStr.length;
                    const bytes = new Uint8Array (len);
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binaryStr.charCodeAt (i);
                    }
                    window.__LIBREDWG_WASM_BASE64__ = null;
                    return createModule ({
                        wasmBinary: bytes.buffer,
                        locateFile: (filename) => filename
                    }).then ((wasmInstance) => {
                        return LibreDwg.createByWasmInstance (wasmInstance);
                    });
                });
            };

            if (isFileProtocol) {
                libreDwgInstancePromise = loadFromBase64Script ().catch ((err) => {
                    libreDwgInstancePromise = null;
                    throw err;
                });
            } else {
                libreDwgInstancePromise = LibreDwg.create ('./assets/libs').catch (() => {
                    return loadFromBase64Script ();
                }).catch ((err) => {
                    libreDwgInstancePromise = null;
                    throw err;
                });
            }
        }
        return libreDwgInstancePromise;
    }

    BuildModelFromDatabase (db, isDwg)
    {
        // 1. Collect Layers
        const layerEntries = (db.tables && db.tables.LAYER && Array.isArray (db.tables.LAYER.entries))
            ? db.tables.LAYER.entries
            : (db.tables && db.tables.layer && db.tables.layer.layers ? Object.values (db.tables.layer.layers) : []);
        for (const layer of layerEntries) {
            if (layer && layer.name) {
                this.layersMap.set (layer.name, layer);
            }
        }

        // 2. Collect Blocks
        if (db.blocks && typeof db.blocks === 'object' && !Array.isArray (db.blocks)) {
            for (const [blockName, blockObj] of Object.entries (db.blocks)) {
                if (blockObj) {
                    this.blocksMap.set (blockName, blockObj);
                    if (blockObj.name) {
                        this.blocksMap.set (blockObj.name, blockObj);
                    }
                }
            }
        }
        if (db.tables && db.tables.BLOCK_RECORD && Array.isArray (db.tables.BLOCK_RECORD.entries)) {
            for (const blockRec of db.tables.BLOCK_RECORD.entries) {
                if (blockRec && blockRec.name) {
                    this.blocksMap.set (blockRec.name, blockRec);
                }
            }
        }

        // 3. Collect Model Space Entities
        let entities = [];
        for (const [name, blk] of this.blocksMap.entries ()) {
            if (name.toLowerCase () === '*model_space' && Array.isArray (blk.entities) && blk.entities.length > 0) {
                entities = blk.entities;
                break;
            }
        }
        if (entities.length === 0 && Array.isArray (db.entities)) {
            entities = db.entities;
        }

        const identityTransform = {
            tx: 0,
            ty: 0,
            tz: 0,
            sx: 1,
            sy: 1,
            sz: 1,
            rotation: 0,
            parentLayer: '0',
            parentColorRgb: null
        };

        for (const entity of entities) {
            if (!entity || entity.visible === false || entity.isVisible === false) {
                continue;
            }
            if (entity.inPaperSpace === true) {
                continue;
            }
            this.ProcessEntity (entity, identityTransform, 0);
        }

        // If all entities were in paper space or blocks, fallback to all entities
        if (this.model.MeshCount () === 0 && entities.length > 0) {
            for (const entity of entities) {
                if (!entity) {
                    continue;
                }
                this.ProcessEntity (entity, identityTransform, 0);
            }
        }
    }

    GetLayerMesh (layerName)
    {
        const cleanName = (layerName && String (layerName).trim ().length > 0) ? String (layerName).trim () : '0';
        if (this.layerMeshes.has (cleanName)) {
            return this.layerMeshes.get (cleanName);
        }
        const mesh = new Mesh ();
        mesh.SetName (cleanName);
        this.model.AddMeshToRootNode (mesh);
        this.layerMeshes.set (cleanName, mesh);
        return mesh;
    }

    ResolveColorRgb (entity, transform)
    {
        const layerName = (entity.layer && entity.layer !== '0') ? entity.layer : (transform.parentLayer || entity.layer || '0');
        const layer = this.layersMap.get (layerName) || this.layersMap.get (entity.layer);

        let rgbInt = null;
        let aci = null;

        // Check true color on entity
        if (typeof entity.color === 'number' && entity.color > 256 && entity.color <= 0xFFFFFF) {
            rgbInt = entity.color;
        } else if (typeof entity.trueColor === 'number' && entity.trueColor > 0) {
            rgbInt = entity.trueColor & 0xFFFFFF;
        }

        // Check ACI on entity
        if (typeof entity.colorIndex === 'number') {
            aci = Math.abs (entity.colorIndex);
        } else if (typeof entity.color === 'number' && entity.color >= 0 && entity.color <= 256) {
            aci = entity.color;
        }

        // ByBlock (0)
        if (aci === 0 && transform.parentColorRgb !== null) {
            return transform.parentColorRgb;
        }

        if (rgbInt === null || rgbInt === 0xFFFFFF) {
            if (aci !== null && aci >= 1 && aci < 256) {
                rgbInt = AUTO_CAD_COLOR_INDEX[aci];
            } else if (layer) {
                if (typeof layer.colorIndex === 'number' && layer.colorIndex >= 1 && layer.colorIndex < 256) {
                    rgbInt = AUTO_CAD_COLOR_INDEX[Math.abs (layer.colorIndex)];
                } else if (typeof layer.color === 'number') {
                    if (layer.color >= 1 && layer.color < 256) {
                        rgbInt = AUTO_CAD_COLOR_INDEX[layer.color];
                    } else if (layer.color > 256 && layer.color <= 0xFFFFFF) {
                        rgbInt = layer.color;
                    }
                }
            }
        }

        if (rgbInt === null || rgbInt === undefined || isNaN (rgbInt)) {
            rgbInt = 0x1E293B;
        }

        let r = (rgbInt >> 16) & 0xFF;
        let g = (rgbInt >> 8) & 0xFF;
        let b = rgbInt & 0xFF;

        // Map white / very bright gray to dark slate so lines are crisp on white background
        if (r > 235 && g > 235 && b > 235) {
            r = 30;
            g = 41;
            b = 59;
        } else if (r > 220 && g > 220 && b < 80) {
            // Map bright yellow (ACI 2) to warm dark amber for crisp visibility on white background
            r = 217;
            g = 119;
            b = 6;
        }

        return (r << 16) | (g << 8) | b;
    }

    GetMaterialIndex (rgbInt)
    {
        if (this.colorToMaterialIndex.has (rgbInt)) {
            return this.colorToMaterialIndex.get (rgbInt);
        }
        const r = (rgbInt >> 16) & 0xFF;
        const g = (rgbInt >> 8) & 0xFF;
        const b = rgbInt & 0xFF;
        const mat = new PhongMaterial ();
        mat.color = new RGBColor (r, g, b);
        mat.ambient = new RGBColor (r, g, b);
        const index = this.model.AddMaterial (mat);
        this.colorToMaterialIndex.set (rgbInt, index);
        return index;
    }

    TransformPoint (pt, entity, transform)
    {
        let x = Number (pt.x) || 0;
        let y = Number (pt.y) || 0;
        let z = 0; // Flatten to 2D XY plane for clean 2D drawing view

        if (entity && entity.extrusionDirection && entity.extrusionDirection.z < -0.5) {
            x = -x;
        }

        const sx = transform.sx !== undefined ? transform.sx : 1;
        const sy = transform.sy !== undefined ? transform.sy : 1;
        const rot = transform.rotation || 0;

        const rx = x * sx;
        const ry = y * sy;

        const cos = Math.cos (rot);
        const sin = Math.sin (rot);

        const tx = (rx * cos - ry * sin) + (transform.tx || 0);
        const ty = (rx * sin + ry * cos) + (transform.ty || 0);

        return new Coord3D (tx, ty, z);
    }

    AddPolylinePoints (mesh, matIndex, points, closed, entity, transform)
    {
        if (!points || points.length < 2) {
            return;
        }
        const vertexIndices = [];
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (p === null || p === undefined || isNaN (p.x) || isNaN (p.y)) {
                continue;
            }
            const coord = this.TransformPoint (p, entity, transform);
            const vIdx = mesh.AddVertex (coord);
            vertexIndices.push (vIdx);
        }
        if (vertexIndices.length < 2) {
            return;
        }
        if (closed && vertexIndices.length > 2) {
            vertexIndices.push (vertexIndices[0]);
        }
        const line = new Line (vertexIndices);
        line.SetMaterial (matIndex);
        mesh.AddLine (line);
    }

    AddTrianglePoints (mesh, matIndex, p0, p1, p2, entity, transform)
    {
        const v0 = mesh.AddVertex (this.TransformPoint (p0, entity, transform));
        const v1 = mesh.AddVertex (this.TransformPoint (p1, entity, transform));
        const v2 = mesh.AddVertex (this.TransformPoint (p2, entity, transform));
        const tri = new Triangle (v0, v1, v2);
        tri.SetMaterial (matIndex);
        mesh.AddTriangle (tri);
    }

    ProcessEntity (entity, transform, depth)
    {
        if (!entity || !entity.type || depth > 12) {
            return;
        }

        const layerInfo = this.layersMap.get (entity.layer);
        if (layerInfo && (layerInfo.frozen === true || layerInfo.off === true || (typeof layerInfo.colorIndex === 'number' && layerInfo.colorIndex < 0))) {
            return;
        }

        const effectiveLayer = (entity.layer && entity.layer !== '0') ? entity.layer : (transform.parentLayer || entity.layer || '0');
        const rgbInt = this.ResolveColorRgb (entity, transform);
        const matIndex = this.GetMaterialIndex (rgbInt);
        const mesh = this.GetLayerMesh (effectiveLayer);

        const type = String (entity.type).toUpperCase ();

        switch (type) {
            case 'LINE':
                this.ImportLine (entity, mesh, matIndex, transform);
                break;
            case 'LWPOLYLINE':
            case 'POLYLINE':
            case 'POLYLINE2D':
            case 'POLYLINE3D':
                this.ImportPolyline (entity, mesh, matIndex, transform);
                break;
            case 'CIRCLE':
                this.ImportCircle (entity, mesh, matIndex, transform);
                break;
            case 'ARC':
                this.ImportArc (entity, mesh, matIndex, transform);
                break;
            case 'ELLIPSE':
                this.ImportEllipse (entity, mesh, matIndex, transform);
                break;
            case 'SPLINE':
                this.ImportSpline (entity, mesh, matIndex, transform);
                break;
            case 'SOLID':
            case 'TRACE':
            case '3DFACE':
                this.ImportSolidOrFace (entity, mesh, matIndex, transform);
                break;
            case 'POINT':
                this.ImportPoint (entity, mesh, matIndex, transform);
                break;
            case 'RAY':
            case 'XLINE':
                this.ImportRayOrXline (entity, mesh, matIndex, transform, type === 'XLINE');
                break;
            case 'LEADER':
                this.ImportLeader (entity, mesh, matIndex, transform);
                break;
            case 'HATCH':
                this.ImportHatch (entity, mesh, matIndex, transform);
                break;
            case 'TEXT':
            case 'ATTRIB':
            case 'ATTDEF':
                this.ImportText (entity, mesh, matIndex, transform);
                break;
            case 'MTEXT':
                this.ImportMText (entity, mesh, matIndex, transform);
                break;
            case 'INSERT':
                this.ImportInsert (entity, transform, effectiveLayer, rgbInt, depth);
                break;
            case 'DIMENSION':
                this.ImportDimension (entity, mesh, matIndex, transform, effectiveLayer, rgbInt, depth);
                break;
            default:
                break;
        }
    }

    ImportLine (entity, mesh, matIndex, transform)
    {
        let p0 = entity.startPoint || entity.start || (Array.isArray (entity.vertices) ? entity.vertices[0] : null);
        let p1 = entity.endPoint || entity.end || (Array.isArray (entity.vertices) ? entity.vertices[1] : null);
        if (!p0 || !p1) {
            return;
        }
        this.AddPolylinePoints (mesh, matIndex, [p0, p1], false, entity, transform);
    }

    InterpolateBulgeSegment (p0, p1, bulge, segments = 16)
    {
        if (!bulge || Math.abs (bulge) < 1e-6) {
            return [p0, p1];
        }
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const chord = Math.hypot (dx, dy);
        if (chord < 1e-9) {
            return [p0];
        }
        const theta = 4.0 * Math.atan (bulge);
        const radius = chord / (2.0 * Math.sin (Math.abs (theta) / 2.0));
        const midX = (p0.x + p1.x) * 0.5;
        const midY = (p0.y + p1.y) * 0.5;
        const distToCenter = radius * Math.cos (theta * 0.5);
        const perpX = -dy / chord;
        const perpY = dx / chord;
        const sign = bulge >= 0 ? 1.0 : -1.0;
        const cx = midX + perpX * distToCenter * sign;
        const cy = midY + perpY * distToCenter * sign;

        const startAngle = Math.atan2 (p0.y - cy, p0.x - cx);
        const numSteps = Math.max (6, Math.min (48, Math.ceil ((Math.abs (theta) / (Math.PI * 0.5)) * segments)));
        const pts = [];
        const absRadius = Math.abs (radius);
        for (let i = 0; i <= numSteps; i++) {
            const a = startAngle + (theta * i) / numSteps;
            pts.push ({
                x: cx + absRadius * Math.cos (a),
                y: cy + absRadius * Math.sin (a)
            });
        }
        return pts;
    }

    ImportPolyline (entity, mesh, matIndex, transform)
    {
        const rawVertices = entity.vertices || entity.points || [];
        if (rawVertices.length < 2) {
            return;
        }
        const isClosed = Boolean (
            entity.shape === true ||
            entity.closed === true ||
            (typeof entity.flag === 'number' && (entity.flag & 1) !== 0) ||
            (typeof entity.flags === 'number' && (entity.flags & 1) !== 0)
        );

        const pts = [];
        const count = rawVertices.length;
        const segCount = isClosed ? count : count - 1;

        for (let i = 0; i < segCount; i++) {
            const v0 = rawVertices[i];
            const v1 = rawVertices[(i + 1) % count];
            if (!v0 || !v1) {
                continue;
            }
            const p0 = { x: v0.x !== undefined ? v0.x : (v0.point ? v0.point.x : 0), y: v0.y !== undefined ? v0.y : (v0.point ? v0.point.y : 0) };
            const p1 = { x: v1.x !== undefined ? v1.x : (v1.point ? v1.point.x : 0), y: v1.y !== undefined ? v1.y : (v1.point ? v1.point.y : 0) };
            const bulge = v0.bulge || 0;
            if (Math.abs (bulge) > 1e-6) {
                const arcPts = this.InterpolateBulgeSegment (p0, p1, bulge);
                if (pts.length > 0) {
                    arcPts.shift ();
                }
                pts.push (...arcPts);
            } else {
                if (pts.length === 0) {
                    pts.push (p0);
                }
                pts.push (p1);
            }
        }

        this.AddPolylinePoints (mesh, matIndex, pts, false, entity, transform);
    }

    ImportCircle (entity, mesh, matIndex, transform)
    {
        const center = entity.center;
        const radius = Number (entity.radius);
        if (!center || !radius || radius <= 0) {
            return;
        }
        const segments = 64;
        const pts = [];
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2.0;
            pts.push ({
                x: center.x + radius * Math.cos (angle),
                y: center.y + radius * Math.sin (angle)
            });
        }
        this.AddPolylinePoints (mesh, matIndex, pts, false, entity, transform);
    }

    NormalizeArcAngles (startAngle, endAngle, isDwg)
    {
        let s = Number (startAngle) || 0;
        let e = Number (endAngle) || 0;
        // DXF ARC angles are in degrees; DWG ARC angles are in radians.
        // Also detect degrees if > 2*PI + 0.01
        if (!isDwg || Math.abs (s) > Math.PI * 2.0 + 0.01 || Math.abs (e) > Math.PI * 2.0 + 0.01) {
            s = (s * Math.PI) / 180.0;
            e = (e * Math.PI) / 180.0;
        }
        while (e < s) {
            e += Math.PI * 2.0;
        }
        if (Math.abs (e - s) < 1e-9) {
            e = s + Math.PI * 2.0;
        }
        return { start: s, end: e };
    }

    ImportArc (entity, mesh, matIndex, transform)
    {
        const center = entity.center;
        const radius = Number (entity.radius);
        if (!center || !radius || radius <= 0) {
            return;
        }
        const { start, end } = this.NormalizeArcAngles (entity.startAngle, entity.endAngle, this.isDwg);
        const sweep = end - start;
        const segments = Math.max (12, Math.ceil ((sweep / (Math.PI * 2.0)) * 64));
        const pts = [];
        for (let i = 0; i <= segments; i++) {
            const a = start + (sweep * i) / segments;
            pts.push ({
                x: center.x + radius * Math.cos (a),
                y: center.y + radius * Math.sin (a)
            });
        }
        this.AddPolylinePoints (mesh, matIndex, pts, false, entity, transform);
    }

    ImportEllipse (entity, mesh, matIndex, transform)
    {
        const center = entity.center;
        const major = entity.majorAxisEndPoint;
        const ratio = Number (entity.axisRatio) || 1.0;
        if (!center || !major) {
            return;
        }
        const rx = Math.hypot (major.x, major.y);
        const ry = rx * ratio;
        const rot = Math.atan2 (major.y, major.x);

        let start = entity.startAngle !== undefined ? Number (entity.startAngle) : 0;
        let end = entity.endAngle !== undefined ? Number (entity.endAngle) : Math.PI * 2.0;
        if (Math.abs (start) > Math.PI * 2.0 + 0.01 || Math.abs (end) > Math.PI * 2.0 + 0.01) {
            start = (start * Math.PI) / 180.0;
            end = (end * Math.PI) / 180.0;
        }
        while (end <= start + 1e-6) {
            end += Math.PI * 2.0;
        }
        const sweep = end - start;
        const segments = Math.max (24, Math.ceil ((sweep / (Math.PI * 2.0)) * 64));
        const cosR = Math.cos (rot);
        const sinR = Math.sin (rot);
        const pts = [];

        for (let i = 0; i <= segments; i++) {
            const a = start + (sweep * i) / segments;
            const lx = rx * Math.cos (a);
            const ly = ry * Math.sin (a);
            pts.push ({
                x: center.x + lx * cosR - ly * sinR,
                y: center.y + lx * sinR + ly * cosR
            });
        }
        this.AddPolylinePoints (mesh, matIndex, pts, false, entity, transform);
    }

    EvaluateBSplinePoint (t, degree, points, knots, weights)
    {
        const n = points.length;
        const d = 2;
        if (degree < 1 || n === 0) {
            return points[0] || { x: 0, y: 0 };
        }
        const v = [];
        for (let i = 0; i < n; i++) {
            const w = (weights && weights[i] !== undefined && weights[i] > 0) ? weights[i] : 1.0;
            v[i] = [points[i].x * w, points[i].y * w, w];
        }
        const low = knots[degree];
        const high = knots[knots.length - 1 - degree];
        const u = low + t * (high - low);
        let s = degree;
        for (let k = degree; k < knots.length - 1 - degree; k++) {
            if (u >= knots[k] && u <= knots[k + 1]) {
                s = k;
                break;
            }
        }
        for (let l = 1; l <= degree + 1; l++) {
            for (let i = s; i > s - degree - 1 + l; i--) {
                const denom = knots[i + degree + 1 - l] - knots[i];
                const alpha = denom === 0 ? 0 : (u - knots[i]) / denom;
                for (let j = 0; j < d + 1; j++) {
                    v[i][j] = (1.0 - alpha) * v[i - 1][j] + alpha * v[i][j];
                }
            }
        }
        const wFinal = v[s][2] || 1.0;
        return {
            x: v[s][0] / wFinal,
            y: v[s][1] / wFinal
        };
    }

    ImportSpline (entity, mesh, matIndex, transform)
    {
        const ctrlPts = entity.controlPoints || [];
        const fitPts = entity.fitPoints || [];
        if (ctrlPts.length >= 2) {
            const degree = Number (entity.degreeOfSplineCurve || entity.degree || 3);
            let knots = entity.knotValues || entity.knots || [];
            if (!Array.isArray (knots) || knots.length < ctrlPts.length + degree + 1) {
                knots = [];
                const total = ctrlPts.length + degree + 1;
                for (let i = 0; i < total; i++) {
                    if (i <= degree) {
                        knots.push (0);
                    } else if (i >= total - degree - 1) {
                        knots.push (1);
                    } else {
                        knots.push ((i - degree) / (total - 2 * degree - 1));
                    }
                }
            }
            const steps = Math.max (32, ctrlPts.length * 12);
            const pts = [];
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                pts.push (this.EvaluateBSplinePoint (t, degree, ctrlPts, knots, entity.weights));
            }
            this.AddPolylinePoints (mesh, matIndex, pts, false, entity, transform);
        } else if (fitPts.length >= 2) {
            this.AddPolylinePoints (mesh, matIndex, fitPts, false, entity, transform);
        }
    }

    ImportSolidOrFace (entity, mesh, matIndex, transform)
    {
        const pts = [];
        if (Array.isArray (entity.points) && entity.points.length >= 3) {
            pts.push (...entity.points);
        } else if (Array.isArray (entity.vertices) && entity.vertices.length >= 3) {
            pts.push (...entity.vertices);
        } else {
            const c1 = entity.corner1 || entity.firstCorner;
            const c2 = entity.corner2 || entity.secondCorner;
            const c3 = entity.corner3 || entity.thirdCorner;
            const c4 = entity.corner4 || entity.fourthCorner;
            if (c1) pts.push (c1);
            if (c2) pts.push (c2);
            if (c4) pts.push (c4);
            if (c3) pts.push (c3);
        }
        if (pts.length >= 3) {
            this.AddPolylinePoints (mesh, matIndex, pts, true, entity, transform);
            this.AddTrianglePoints (mesh, matIndex, pts[0], pts[1], pts[2], entity, transform);
            if (pts.length >= 4 && (pts[3].x !== pts[2].x || pts[3].y !== pts[2].y)) {
                this.AddTrianglePoints (mesh, matIndex, pts[0], pts[2], pts[3], entity, transform);
            }
        }
    }

    ImportPoint (entity, mesh, matIndex, transform)
    {
        const p = entity.position || entity.location || entity.point;
        if (!p) {
            return;
        }
        const s = 0.25;
        this.AddPolylinePoints (mesh, matIndex, [{ x: p.x - s, y: p.y }, { x: p.x + s, y: p.y }], false, entity, transform);
        this.AddPolylinePoints (mesh, matIndex, [{ x: p.x, y: p.y - s }, { x: p.x, y: p.y + s }], false, entity, transform);
    }

    ImportRayOrXline (entity, mesh, matIndex, transform, isXline)
    {
        const base = entity.firstPoint || entity.basePoint || entity.position;
        const dir = entity.unitDirection || entity.direction;
        if (!base || !dir) {
            return;
        }
        const len = 100.0;
        const p0 = isXline ? { x: base.x - dir.x * len, y: base.y - dir.y * len } : { x: base.x, y: base.y };
        const p1 = { x: base.x + dir.x * len, y: base.y + dir.y * len };
        this.AddPolylinePoints (mesh, matIndex, [p0, p1], false, entity, transform);
    }

    ImportLeader (entity, mesh, matIndex, transform)
    {
        const verts = entity.vertices || entity.points || [];
        if (verts.length < 2) {
            return;
        }
        this.AddPolylinePoints (mesh, matIndex, verts, false, entity, transform);
        // Add arrowhead at first vertex
        const p0 = verts[0];
        const p1 = verts[1];
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const len = Math.hypot (dx, dy);
        if (len > 1e-5) {
            const arrowLen = Math.min (len * 0.25, 2.5);
            const arrowWidth = arrowLen * 0.35;
            const ux = dx / len;
            const uy = dy / len;
            const px = -uy;
            const py = ux;
            const a1 = { x: p0.x + ux * arrowLen + px * arrowWidth, y: p0.y + uy * arrowLen + py * arrowWidth };
            const a2 = { x: p0.x + ux * arrowLen - px * arrowWidth, y: p0.y + uy * arrowLen - py * arrowWidth };
            this.AddTrianglePoints (mesh, matIndex, p0, a1, a2, entity, transform);
        }
    }

    ImportHatch (entity, mesh, matIndex, transform)
    {
        const paths = entity.boundaryPaths || entity.paths || entity.loops || [];
        for (const path of paths) {
            if (!path) {
                continue;
            }
            const loopPts = [];
            if (Array.isArray (path.vertices) && path.vertices.length >= 2) {
                for (let i = 0; i < path.vertices.length; i++) {
                    const v0 = path.vertices[i];
                    const v1 = path.vertices[(i + 1) % path.vertices.length];
                    if (v0.bulge && Math.abs (v0.bulge) > 1e-6) {
                        const arcPts = this.InterpolateBulgeSegment (v0, v1, v0.bulge);
                        if (loopPts.length > 0) arcPts.shift ();
                        loopPts.push (...arcPts);
                    } else {
                        loopPts.push ({ x: v0.x, y: v0.y });
                    }
                }
            } else if (path.polyline && Array.isArray (path.polyline.vertices)) {
                const verts = path.polyline.vertices;
                for (let i = 0; i < verts.length; i++) {
                    const v0 = verts[i];
                    const v1 = verts[(i + 1) % verts.length];
                    if (v0.bulge && Math.abs (v0.bulge) > 1e-6) {
                        const arcPts = this.InterpolateBulgeSegment (v0, v1, v0.bulge);
                        if (loopPts.length > 0) arcPts.shift ();
                        loopPts.push (...arcPts);
                    } else {
                        loopPts.push ({ x: v0.x, y: v0.y });
                    }
                }
            } else if (Array.isArray (path.edges)) {
                for (const edge of path.edges) {
                    if (!edge) continue;
                    if (edge.start && edge.end) {
                        loopPts.push ({ x: edge.start.x, y: edge.start.y });
                        loopPts.push ({ x: edge.end.x, y: edge.end.y });
                    } else if (edge.center && edge.radius) {
                        const { start, end } = this.NormalizeArcAngles (edge.startAngle || 0, edge.endAngle || 360, this.isDwg);
                        const steps = 24;
                        for (let i = 0; i <= steps; i++) {
                            const a = start + ((end - start) * i) / steps;
                            loopPts.push ({
                                x: edge.center.x + edge.radius * Math.cos (a),
                                y: edge.center.y + edge.radius * Math.sin (a)
                            });
                        }
                    }
                }
            }

            if (loopPts.length >= 2) {
                this.AddPolylinePoints (mesh, matIndex, loopPts, true, entity, transform);
            }
        }
    }

    CleanCadText (rawText)
    {
        if (rawText === null || rawText === undefined) {
            return '';
        }
        return String (rawText)
            .replace (/\\U\+([0-9A-Fa-f]{4})/gi, (_, hex) => String.fromCharCode (parseInt (hex, 16)))
            .replace (/%%[dD]/g, '°')
            .replace (/%%[pP]/g, '±')
            .replace (/%%[cC]/g, 'Ø')
            .replace (/%%%/g, '%')
            .replace (/%%[uUoO]/g, '')
            .replace (/\\P/g, '\n')
            .replace (/\\[LOlo]/g, '')
            .replace (/\\[Ff][^;\\]*?(?:\|[^;\\]*)*;/g, '')
            .replace (/\\[KkCcHhWwTtAaQq][^;\\]*;/g, '')
            .replace (/\\S([^;\\]*?)[\^/#]([^;\\]*?);/g, '$1/$2')
            .replace (/\\[a-zA-Z]+;/g, '')
            .replace (/\\~/g, ' ')
            .replace (/[{}]/g, '');
    }

    RenderVectorText (textStr, position, height, rotationRad, halign, mesh, matIndex, entity, transform)
    {
        const cleaned = this.CleanCadText (textStr);
        if (!cleaned || cleaned.trim ().length === 0) {
            return;
        }
        const h = Math.max (0.1, Number (height) || 2.5);
        const charWidth = h * 0.72;
        const charAdvance = h * 0.92;
        const lineAdvance = h * 1.45;
        const cosR = Math.cos (rotationRad || 0);
        const sinR = Math.sin (rotationRad || 0);

        const lines = cleaned.split ('\n');
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            if (!line) continue;

            // Calculate total advance for horizontal alignment
            let totalWidth = 0;
            for (let i = 0; i < line.length; i++) {
                const code = line.charCodeAt (i);
                totalWidth += code > 255 ? h * 1.05 : charAdvance;
            }

            let offsetX = 0;
            if (halign === 1 || halign === 4 || halign === 'center' || halign === 'middle') {
                offsetX = -totalWidth * 0.5;
            } else if (halign === 2 || halign === 'right' || halign === 'end') {
                offsetX = -totalWidth;
            }

            const baseY = -lineIdx * lineAdvance;
            let cursorX = offsetX;

            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                const upper = ch.toUpperCase ();
                const isWide = ch.charCodeAt (0) > 255;
                const w = isWide ? h * 0.95 : charWidth;
                const adv = isWide ? h * 1.05 : charAdvance;

                if (ch !== ' ' && ch !== '\t') {
                    const strokes = STROKE_GLYPHS[upper] || STROKE_GLYPHS[ch] || GetCanvasGlyphStrokes (ch);
                    for (const stroke of strokes) {
                        const pts = [];
                        for (const [gx, gy] of stroke) {
                            const lx = cursorX + gx * w;
                            const ly = baseY + gy * h;
                            const wx = position.x + (lx * cosR - ly * sinR);
                            const wy = position.y + (lx * sinR + ly * cosR);
                            pts.push ({ x: wx, y: wy });
                        }
                        this.AddPolylinePoints (mesh, matIndex, pts, false, entity, transform);
                    }
                }
                cursorX += adv;
            }
        }
    }

    ImportText (entity, mesh, matIndex, transform)
    {
        const text = entity.text || entity.value || entity.string || '';
        const pos = entity.startPoint || entity.insertionPoint || entity.position || entity.firstAlignmentPoint;
        if (!text || !pos) {
            return;
        }
        const height = Number (entity.textHeight || entity.height || 2.5);
        let rot = Number (entity.rotation || 0);
        if (!this.isDwg && Math.abs (rot) > 0) {
            rot = (rot * Math.PI) / 180.0;
        }
        const halign = entity.halign || entity.horizontalJustification || 0;
        const alignPt = (halign !== 0 && entity.endPoint && (entity.endPoint.x !== 0 || entity.endPoint.y !== 0))
            ? entity.endPoint
            : pos;
        this.RenderVectorText (text, alignPt, height, rot, halign, mesh, matIndex, entity, transform);
    }

    ImportMText (entity, mesh, matIndex, transform)
    {
        const text = entity.text || entity.value || entity.string || '';
        const pos = entity.insertionPoint || entity.position || entity.startPoint;
        if (!text || !pos) {
            return;
        }
        const height = Number (entity.textHeight || entity.height || 2.5);
        let rot = Number (entity.rotation || 0);
        if (entity.directionVector && (entity.directionVector.x || entity.directionVector.y)) {
            rot = Math.atan2 (entity.directionVector.y, entity.directionVector.x);
        } else if (!this.isDwg && Math.abs (rot) > 0) {
            rot = (rot * Math.PI) / 180.0;
        }
        let halign = 0;
        const ap = entity.attachmentPoint;
        if (ap === 2 || ap === 5 || ap === 8) {
            halign = 1;
        } else if (ap === 3 || ap === 6 || ap === 9) {
            halign = 2;
        }
        this.RenderVectorText (text, pos, height, rot, halign, mesh, matIndex, entity, transform);
    }

    ImportInsert (entity, parentTransform, effectiveLayer, rgbInt, depth)
    {
        const blockName = entity.name || entity.block;
        if (!blockName) {
            return;
        }
        const block = this.blocksMap.get (blockName);
        if (!block || !Array.isArray (block.entities) || block.entities.length === 0) {
            return;
        }

        const insPt = entity.insertionPoint || entity.position || { x: 0, y: 0 };
        const basePt = block.basePoint || block.position || { x: 0, y: 0 };
        let sx = entity.xScale !== undefined ? Number (entity.xScale) : (entity.scaleX !== undefined ? Number (entity.scaleX) : 1.0);
        let sy = entity.yScale !== undefined ? Number (entity.yScale) : (entity.scaleY !== undefined ? Number (entity.scaleY) : 1.0);
        if (!isFinite (sx) || Math.abs (sx) < 1e-6 || Math.abs (sx) > 500) {
            sx = 1.0;
        }
        if (!isFinite (sy) || Math.abs (sy) < 1e-6 || Math.abs (sy) > 500) {
            sy = 1.0;
        }
        let rot = Number (entity.rotation || 0);
        if (!this.isDwg && Math.abs (rot) > 0) {
            rot = (rot * Math.PI) / 180.0;
        }

        const colCount = Math.max (1, Number (entity.columnCount || 1));
        const rowCount = Math.max (1, Number (entity.rowCount || 1));
        const colSpacing = Number (entity.columnSpacing || 0);
        const rowSpacing = Number (entity.rowSpacing || 0);

        for (let r = 0; r < rowCount; r++) {
            for (let c = 0; c < colCount; c++) {
                const localX = insPt.x + c * colSpacing - basePt.x * sx;
                const localY = insPt.y + r * rowSpacing - basePt.y * sy;
                const transformedInsert = this.TransformPoint ({ x: localX, y: localY }, entity, parentTransform);

                const childTransform = {
                    tx: transformedInsert.x,
                    ty: transformedInsert.y,
                    tz: 0,
                    sx: parentTransform.sx * sx,
                    sy: parentTransform.sy * sy,
                    sz: 1,
                    rotation: (parentTransform.rotation || 0) + rot,
                    parentLayer: effectiveLayer,
                    parentColorRgb: rgbInt
                };

                for (const childEntity of block.entities) {
                    this.ProcessEntity (childEntity, childTransform, depth + 1);
                }
            }
        }
    }

    ImportDimension (entity, mesh, matIndex, transform, effectiveLayer, rgbInt, depth)
    {
        const blockName = entity.block || entity.name;
        if (blockName && this.blocksMap.has (blockName)) {
            const block = this.blocksMap.get (blockName);
            if (block && Array.isArray (block.entities) && block.entities.length > 0) {
                const childTransform = {
                    ...transform,
                    parentLayer: effectiveLayer,
                    parentColorRgb: rgbInt
                };
                for (const childEntity of block.entities) {
                    this.ProcessEntity (childEntity, childTransform, depth + 1);
                }
                return;
            }
        }

        // Fallback if dimension anonymous block is not populated
        const p1 = entity.subDefinitionPoint1 || entity.extLine1Point || entity.definitionPoint;
        const p2 = entity.subDefinitionPoint2 || entity.extLine2Point || entity.textMidpoint;
        const defPt = entity.definitionPoint || p2;
        if (p1 && p2) {
            this.AddPolylinePoints (mesh, matIndex, [p1, p2], false, entity, transform);
            if (defPt && (defPt.x !== p2.x || defPt.y !== p2.y)) {
                this.AddPolylinePoints (mesh, matIndex, [p1, defPt], false, entity, transform);
                this.AddPolylinePoints (mesh, matIndex, [p2, defPt], false, entity, transform);
            }
        }
        const midPt = entity.textMidpoint || entity.middleOfText;
        let dimText = entity.text;
        if (!dimText || dimText === '<>') {
            if (typeof entity.actualMeasurement === 'number' && entity.actualMeasurement > 0) {
                dimText = Number (entity.actualMeasurement.toFixed (2)).toString ();
            } else if (p1 && p2) {
                dimText = Number (Math.hypot (p2.x - p1.x, p2.y - p1.y).toFixed (2)).toString ();
            }
        }
        if (dimText && midPt) {
            this.RenderVectorText (dimText, midPt, 2.5, 0, 1, mesh, matIndex, entity, transform);
        }
    }
}
