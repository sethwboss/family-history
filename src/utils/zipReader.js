/**
 * Robust In-Browser ZIP Archive Unpacker (Zero Dependencies)
 * Implements the official PKWARE ZIP specification by reading the
 * End of Central Directory (EOCD) and Central Directory records.
 * Works seamlessly with Ancestry, FamilySearch, Windows Compressed Folders, and 7-Zip.
 */

export async function extractGedcomFromZip(file) {
  const arrayBuffer = await file.arrayBuffer()
  const totalLength = arrayBuffer.byteLength
  const view = new DataView(arrayBuffer)
  const bytes = new Uint8Array(arrayBuffer)

  if (totalLength < 22) {
    throw new Error('File too small to be a valid ZIP archive.')
  }

  // 1. Locate End of Central Directory Record (EOCD) by scanning backwards
  // EOCD signature is 0x06054b50 (little-endian)
  let eocdOffset = -1
  const maxScan = Math.min(totalLength, 65557) // Max comment length 65535 + 22

  for (let i = totalLength - 22; i >= totalLength - maxScan; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i
      break
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Could not find ZIP End of Central Directory record.')
  }

  // 2. Read Central Directory parameters from EOCD
  const totalEntries = view.getUint16(eocdOffset + 10, true)
  const centralDirSize = view.getUint32(eocdOffset + 12, true)
  const centralDirOffset = view.getUint32(eocdOffset + 16, true)

  let cdPtr = centralDirOffset

  // 3. Scan Central Directory entries for any .ged file
  for (let entry = 0; entry < totalEntries && cdPtr + 46 <= totalLength; entry++) {
    const cdSig = view.getUint32(cdPtr, true)
    if (cdSig !== 0x02014b50) {
      break // End of central directory records
    }

    const compressionMethod = view.getUint16(cdPtr + 10, true)
    const compressedSize = view.getUint32(cdPtr + 20, true)
    const uncompressedSize = view.getUint32(cdPtr + 24, true)
    const fileNameLength = view.getUint16(cdPtr + 28, true)
    const extraFieldLength = view.getUint16(cdPtr + 30, true)
    const fileCommentLength = view.getUint16(cdPtr + 32, true)
    const localHeaderOffset = view.getUint32(cdPtr + 42, true)

    const fileNameBytes = bytes.subarray(cdPtr + 46, cdPtr + 46 + fileNameLength)
    const fileName = new TextDecoder('utf-8').decode(fileNameBytes)

    // Check if entry is a .ged file
    if (fileName.toLowerCase().endsWith('.ged')) {
      // 4. Read Local File Header to determine exact data offset
      if (localHeaderOffset + 30 > totalLength) {
        throw new Error('Invalid local header offset in ZIP.')
      }

      const localSig = view.getUint32(localHeaderOffset, true)
      if (localSig !== 0x04034b50) {
        throw new Error('Invalid local file header signature in ZIP.')
      }

      const localNameLen = view.getUint16(localHeaderOffset + 26, true)
      const localExtraLen = view.getUint16(localHeaderOffset + 28, true)
      const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen

      if (dataStart + compressedSize > totalLength) {
        throw new Error('Corrupt or truncated compressed data in ZIP.')
      }

      const compressedData = bytes.subarray(dataStart, dataStart + compressedSize)

      // 5. Decompress
      if (compressionMethod === 0) {
        // Stored (no compression)
        const text = new TextDecoder('utf-8').decode(compressedData)
        return { fileName, content: text }
      } else if (compressionMethod === 8) {
        // Deflate
        const ds = new DecompressionStream('deflate-raw')
        const stream = new Blob([compressedData]).stream().pipeThrough(ds)
        const text = await new Response(stream).text()
        return { fileName, content: text }
      } else {
        throw new Error(`Unsupported ZIP compression method: ${compressionMethod}`)
      }
    }

    // Move to next Central Directory entry
    cdPtr += 46 + fileNameLength + extraFieldLength + fileCommentLength
  }

  throw new Error('No .ged file found inside this ZIP archive.')
}
