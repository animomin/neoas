/*!
 * FileInput <_LANG_> Translations
 *
 * This file must be loaded after 'fileinput.js'. Patterns in braces '{}', or
 * any HTML markup tags in the messages must not be converted or translated.
 *
 * @see http://github.com/kartik-v/bootstrap-fileinput
 *
 * NOTE: this file must be saved in UTF-8 encoding.
 */
(function ($) {
    "use strict";

    $.fn.fileinputLocales['ko'] = {
        fileSingle: 'file',
        filePlural: 'files',
        browseLabel: '찾아보기 &hellip;',
        removeLabel: '삭제',
        removeTitle: '선택파일 삭제',
        cancelLabel: '취소',
        cancelTitle: '진행중인 업로드 중단',
        uploadLabel: '업로드',
        uploadTitle: '선택파일 업로드',
        msgNo: '아니오',
        msgNoFilesSelected: '선택된 파일 없음',
        msgCancelled: '취소됨',
        msgZoomModalHeading: '상세보기',
        msgSizeTooLarge: '파일 "{name}" (<b>{size} KB</b>)이  제한된 크기(<b>{maxSize} KB</b>)보다 큽니다.',
        msgFilesTooLess: '업로드하려면 적어도 <b>{n}</b> {files}개의 파일을 선택해야합니다.',
        msgFilesTooMany: '선택하신 파일중 <b>({n})</b>개의 파일이 제한된 크기(<b>{m}</b>)보다 큽니다.',
        msgFileNotFound: '"{name}"라는 이름의 파일을 찾을 수 없습니다.',
        msgFileSecured: '보안 제한으로 인하여 파일("{name}")을 읽을 수 없습니다.',
        msgFileNotReadable: '파일("{name}")을 읽을 수 없습니다.',
        msgFilePreviewAborted: '"{name}"에 대한 파일 미리보기가 중단되었습니다.',
        msgFilePreviewError: '"{name}"파일을 읽는 중 오류가 발생했습니다.',
        msgInvalidFileType: '파일 "{name}"에 대한 유형이 잘못되었습니다. "{types}"파일 만 지원됩니다.',
        msgInvalidFileExtension: '"{name}"파일의 확장자가 잘못되었습니다. "{extensions}"파일 만 지원됩니다.',
        msgUploadAborted: '파일 업로드가 중단되었습니다.',
        msgUploadThreshold: '처리중...',
        msgValidationError: '유효성 검사 오류',
        msgLoading: 'Loading file {index} of {files} &hellip;',
        msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
        msgSelected: '{n} {files} 선택됨',
        msgFoldersNotAllowed: 'Drag & drop files only! Skipped {n} dropped folder(s).',
        msgImageWidthSmall: 'Width of image file "{name}" must be at least {size} px.',
        msgImageHeightSmall: 'Height of image file "{name}" must be at least {size} px.',
        msgImageWidthLarge: 'Width of image file "{name}" cannot exceed {size} px.',
        msgImageHeightLarge: 'Height of image file "{name}" cannot exceed {size} px.',
        msgImageResizeError: 'Could not get the image dimensions to resize.',
        msgImageResizeException: 'Error while resizing the image.<pre>{errors}</pre>',
        dropZoneTitle: 'Drag & drop files here &hellip;',
        dropZoneClickTitle: '<br>(or click to select {files})',
        fileActionSettings: {
            removeTitle: '파일 제거',
            uploadTitle: '파일 업로드',
            zoomTitle: '상세보기',
            dragTitle: '이동 / 재정렬',
            indicatorNewTitle: '업로드 준비',
            indicatorSuccessTitle: '업로드됨',
            indicatorErrorTitle: '업로드 오류',
            indicatorLoadingTitle: '업로드중...'
        },
        previewZoomButtonTitles: {
            prev: '이전파일',
            next: '다음파일',
            toggleheader: '해더보기',
            fullscreen: '전체보기',
            borderless: 'Toggle borderless mode',
            close: 'Close detailed preview'
        }
    };
})(window.jQuery);