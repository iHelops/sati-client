export function checkFileExtension(file: File, extensions: string[]) {
    const fileExt = file.type.split('/')[1]
    return extensions.filter(ext => ext === fileExt).length > 0
}