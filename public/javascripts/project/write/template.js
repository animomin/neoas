(function (exports) {
    'use strict';

    function Template() {
        console.log('Template created');

        this.defaultUploadedFileChip = '' +
            '<div class="chip" data-filename="{{파일명}}">' +
            '    {{파일명}}' +
            '    <i class="fa fa-close chip-close"></i>' +
            '   <input type="hidden" value="{{파일명}}" name="project-uploaded-file"/>'            
            '</div>';

    }

    Template.prototype.insertUploadedFile = function (file) {
        var view = this.defaultUploadedFileChip;
        view = view.replace(/{{파일명}}/gim, file.originalFilename);

        return view;
    };

    exports.project = exports.project || {};
    exports.project.Template = Template;

})(window);