/**
 * vid2bmap(김영훈 · 최성희, KAIST · MIT) 추출 결과 zip 읽기 — 브라우저 · Node 공통, 새 의존성 없이.
 * zip 은 중앙 디렉터리만 읽고(ZIP64 · 암호화 없음), 압축은 내장 DecompressionStream("deflate-raw") 로 푼다.
 * .npy 는 NumPy 고정 형식(v1~v3, C 순서) 중 vid2bmap 이 쓰는 정수 · 불리언 · 실수만 읽는다.
 */

export interface NpyArray {
    shape: number[];
    values: number[];
}

export interface Vid2bmapResult {
    /** 영상 fps 와 추출 시작 시각(초) — meta JSON 이 없으면 null */
    fps: number | null;
    startSec: number | null;
    /** 박자선이 있는 줄(y). 붙어 있는 줄은 하나로 합친 가운데 값 */
    barRows: number[];
    /** [y, x1, x2] */
    simple: number[][];
    /** [y1, y2, x1, x2] */
    tenuto: number[][];
    /** [y1, y2, x1, x2] */
    trill: number[][];
    /** [y, x1, x2] — 대각선 노트를 조각으로 읽은 것 */
    glissando: number[][];
}

const NPY_MAGIC = [0x93, 0x4e, 0x55, 0x4d, 0x50, 0x59];

export function parseNpy(bytes: Uint8Array): NpyArray {
    if (NPY_MAGIC.some((value, index) => bytes[index] !== value)) {
        throw new Error("NumPy(.npy) 파일이 아닙니다.");
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const major = bytes[6];
    const headerLength =
        major === 1 ? view.getUint16(8, true) : view.getUint32(8, true);
    const headerStart = major === 1 ? 10 : 12;
    const header = new TextDecoder("latin1").decode(
        bytes.subarray(headerStart, headerStart + headerLength)
    );
    const descr = /'descr'\s*:\s*'([^']+)'/.exec(header)?.[1];
    const fortran = /'fortran_order'\s*:\s*(True|False)/.exec(header)?.[1];
    const shapeText = /'shape'\s*:\s*\(([^)]*)\)/.exec(header)?.[1];
    if (!descr || !fortran || shapeText === undefined) {
        throw new Error("NumPy 헤더를 읽을 수 없습니다.");
    }
    if (fortran === "True") {
        throw new Error("Fortran 순서 배열은 지원하지 않습니다.");
    }
    const shape = shapeText
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map(Number);
    const count = shape.reduce((product, size) => product * size, 1);
    const dataStart = headerStart + headerLength;
    // 형식별 읽기 — 정렬이 맞지 않을 수 있어 필요한 만큼 새 버퍼로 복사한다
    const data = bytes.slice(dataStart);
    const dataView = new DataView(data.buffer);
    const values: number[] = new Array(count);
    const readers: Record<string, [number, (offset: number) => number]> = {
        "<i8": [8, (offset) => Number(dataView.getBigInt64(offset, true))],
        "<u8": [8, (offset) => Number(dataView.getBigUint64(offset, true))],
        "<i4": [4, (offset) => dataView.getInt32(offset, true)],
        "<u4": [4, (offset) => dataView.getUint32(offset, true)],
        "<i2": [2, (offset) => dataView.getInt16(offset, true)],
        "<u2": [2, (offset) => dataView.getUint16(offset, true)],
        "|i1": [1, (offset) => dataView.getInt8(offset)],
        "|u1": [1, (offset) => dataView.getUint8(offset)],
        "|b1": [1, (offset) => (dataView.getUint8(offset) ? 1 : 0)],
        "<f4": [4, (offset) => dataView.getFloat32(offset, true)],
        "<f8": [8, (offset) => dataView.getFloat64(offset, true)],
    };
    const reader = readers[descr];
    if (!reader) throw new Error(`지원하지 않는 NumPy 형식입니다: ${descr}`);
    const [size, read] = reader;
    if (data.byteLength < count * size) {
        throw new Error("NumPy 데이터가 잘려 있습니다.");
    }
    for (let index = 0; index < count; index += 1) {
        values[index] = read(index * size);
    }
    return { shape, values };
}

/** 2차원 배열을 줄 목록으로. np.empty((0, n)) 이 (0,) 으로 저장된 경우도 빈 목록 */
export function npyRows(array: NpyArray, columns: number): number[][] {
    if (array.values.length === 0) return [];
    const width = array.shape[1] ?? columns;
    if (array.shape.length !== 2 || width !== columns) {
        throw new Error(
            `열 ${columns}개짜리 배열이어야 합니다(지금 ${array.shape.join("×")}).`
        );
    }
    const rows: number[][] = [];
    for (let index = 0; index < array.values.length; index += width) {
        rows.push(array.values.slice(index, index + width));
    }
    return rows;
}

interface ZipEntry {
    name: string;
    method: number;
    compressedSize: number;
    localOffset: number;
}

function listZipEntries(bytes: Uint8Array): ZipEntry[] {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let end = -1;
    for (
        let offset = bytes.byteLength - 22;
        offset >= Math.max(0, bytes.byteLength - 22 - 0xffff);
        offset -= 1
    ) {
        if (view.getUint32(offset, true) === 0x06054b50) {
            end = offset;
            break;
        }
    }
    if (end < 0) throw new Error("zip 파일이 아닙니다.");
    const count = view.getUint16(end + 10, true);
    let offset = view.getUint32(end + 16, true);
    if (offset === 0xffffffff) throw new Error("ZIP64 는 지원하지 않습니다.");
    const decoder = new TextDecoder("utf-8");
    const entries: ZipEntry[] = [];
    for (let index = 0; index < count; index += 1) {
        if (view.getUint32(offset, true) !== 0x02014b50) {
            throw new Error("zip 목록이 손상되었습니다.");
        }
        const flags = view.getUint16(offset + 8, true);
        if (flags & 0x1)
            throw new Error("암호가 걸린 zip 은 읽을 수 없습니다.");
        const nameLength = view.getUint16(offset + 28, true);
        const extraLength = view.getUint16(offset + 30, true);
        const commentLength = view.getUint16(offset + 32, true);
        entries.push({
            // Windows 에서 만든 zip 은 경로 구분이 \ 일 수 있다
            name: decoder
                .decode(bytes.subarray(offset + 46, offset + 46 + nameLength))
                .replaceAll("\\", "/"),
            method: view.getUint16(offset + 10, true),
            compressedSize: view.getUint32(offset + 20, true),
            localOffset: view.getUint32(offset + 42, true),
        });
        offset += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
}

async function readZipEntry(bytes: Uint8Array, entry: ZipEntry) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const local = entry.localOffset;
    if (view.getUint32(local, true) !== 0x04034b50) {
        throw new Error(`zip 항목이 손상되었습니다: ${entry.name}`);
    }
    const start =
        local +
        30 +
        view.getUint16(local + 26, true) +
        view.getUint16(local + 28, true);
    const raw = bytes.subarray(start, start + entry.compressedSize);
    if (entry.method === 0) return raw.slice();
    if (entry.method !== 8) {
        throw new Error(`지원하지 않는 압축 방식입니다: ${entry.name}`);
    }
    const stream = new Blob([raw.slice()])
        .stream()
        .pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** 붙어 있는 true 줄(두꺼운 선)은 가운데 줄 하나로 */
export function barRowsFromMask(mask: number[]) {
    const rows: number[] = [];
    let runStart = -1;
    for (let index = 0; index <= mask.length; index += 1) {
        const on = index < mask.length && mask[index] !== 0;
        if (on && runStart < 0) runStart = index;
        if (!on && runStart >= 0) {
            rows.push((runStart + index - 1) / 2);
            runStart = -1;
        }
    }
    return rows;
}

const RESULT_FILES = {
    bar: "chart_bar.npy",
    simple: "chart_simple.npy",
    tenuto: "chart_tenuto.npy",
    trill: "chart_trill.npy",
    glissando: "chart_glissando.npy",
} as const;

/** 데스크탑 결과 zip(폴더 구조와 무관하게 파일 이름으로 찾음) → 추출 결과 */
export async function readVid2bmapZip(
    input: ArrayBuffer | Uint8Array
): Promise<Vid2bmapResult> {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    const entries = listZipEntries(bytes);
    const find = (fileName: string) =>
        entries.find(
            (entry) =>
                entry.name === fileName || entry.name.endsWith(`/${fileName}`)
        );
    const load = async (fileName: string, required: boolean) => {
        const entry = find(fileName);
        if (!entry) {
            if (required) {
                throw new Error(`zip 안에 ${fileName} 이 없습니다.`);
            }
            return null;
        }
        return parseNpy(await readZipEntry(bytes, entry));
    };

    const bar = await load(RESULT_FILES.bar, true);
    const simple = await load(RESULT_FILES.simple, true);
    const tenuto = await load(RESULT_FILES.tenuto, true);
    const trill = await load(RESULT_FILES.trill, false);
    const glissando = await load(RESULT_FILES.glissando, false);

    let fps: number | null = null;
    let startSec: number | null = null;
    const metaEntry = entries.find((entry) => entry.name.endsWith("meta.json"));
    if (metaEntry) {
        try {
            const meta = JSON.parse(
                new TextDecoder("utf-8").decode(
                    await readZipEntry(bytes, metaEntry)
                )
            ) as { start?: [number, number] };
            if (Array.isArray(meta.start) && meta.start.length === 2) {
                startSec = Number(meta.start[0]);
                fps = Number(meta.start[1]) || null;
            }
        } catch {
            // 메타가 깨져 있어도 노트 변환에는 필요 없다(BPM 추정만 빠짐)
        }
    }

    return {
        fps,
        startSec,
        barRows: barRowsFromMask(bar!.values),
        simple: npyRows(simple!, 3),
        tenuto: npyRows(tenuto!, 4),
        trill: trill ? npyRows(trill, 4) : [],
        glissando: glissando ? npyRows(glissando, 3) : [],
    };
}
