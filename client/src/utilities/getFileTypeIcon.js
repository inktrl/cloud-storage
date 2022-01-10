const type = (type) => {
    switch (type) {
        case 'dir':     return "fal fa-folder"

        case 'doc':     return "fal fa-file-word"
        case 'docx':    return "fal fa-file-word"
        case 'dot':    return "fal fa-file-word"
        case 'docm':    return "fal fa-file-word"
        case 'docb':    return "fal fa-file-word"
        case 'dotm':    return "fal fa-file-word"

        case 'pptx':    return "fal fa-file-powerpoint"
        case 'ppt':     return "fal fa-file-powerpoint"
        case 'pps':     return "fal fa-file-powerpoint"
        case 'ppam':    return "fal fa-file-powerpoint"
        case 'ppa':     return "fal fa-file-powerpoint"

        case 'pdf':     return "fal fa-file-pdf"
        case 'xlsx':    return "fal fa-file-excel"
        case 'csv':     return "fal fa-file-file-csv"

        case 'jsx':     return "fal fa-file-code"
        case 'html':    return "fal fa-file-code"
        case 'css':     return "fal fa-file-code"
        case 'js':      return "fal fa-file-code"

        case 'jpg':     return "fal fa-file-image"
        case 'png':     return "fal fa-file-image"
        case 'jpeg':    return "fal fa-file-image"

        case 'zip':     return "fal fa-file-archive"
        case 'rar':     return "fal fa-file-archive"
        case '7zip':    return "fal fa-file-archive"

        case 'mp3':     return "fal fa-file-audio"
        case 'flac':    return "fal fa-file-audio"
        case 'wav':     return "fal fa-file-audio"
        case 'm4a':     return "fal fa-file-audio"

        case 'mp4':     return "fal fa-file-video"
        case 'mkv':     return "fal fa-file-video"
        case 'avi':     return "fal fa-file-video"
        case 'wmv':     return "fal fa-file-video"

        default: return "fal fa-file"
    }
}

export default type