(function (exports) {
    'use strict';

    function Template() {
        console.log('Template created');

        this.commentEditForm = '' +        
        '<form class="form-horizontal" method="post", action="/project/comment", role="form", data-toggle="validator">' +        
        '    <input type="hidden" name="_METHOD" value="PUT"/>' +
        '    <input type="hidden" name="projectid" value="{{인덱스}}"/>' +
        '    <input type="hidden" name="commentid" value="{{COMMENTID}}"/>' +
        '    <input type="hidden" name="commentType" value="0"/>' +
        '    <div class="form-group required">' +
        '        <div class="col-sm-12">' +
        '            <div class="input-group">' +
        '                <textarea class="form-control custom-control" id="project-comment" name="comment" style="resize:none;" required>{{내용}}</textarea>' +        
        '                <span class="input-group-addon btn btn-primary" id="project-comment-edit-save">수정</span>' +        
        '                <span class="input-group-addon btn btn-white" id="project-comment-cancel">취소</span>' +        
        '            </div>' +
        '            <div class="help-block with-error"></div>' +
        '        </div>' +
        '    </div>' +
        '</form>';

        this.historyEditForm = '' +
        '<form class="form-horizontal" method="post", action="/project/comment", role="form", data-toggle="validator">' +        
        '    <input type="hidden" name="_METHOD" value="PUT"/>' +
        '    <input type="hidden" name="projectid" value="{{인덱스}}"/>' +
        '    <input type="hidden" name="commentid" value="{{COMMENTID}}"/>' +        
        '    <div class="col-sm-2">' +
        '        <div class="form-group required">' +
        '            <div class="input-group">' +
        '                <select class="selectpicker" id="project-history-type" title="구분" data-width="fit" name="commentType" required>' +
        '                    <option value="1" {{COMMENTTYPE1}}>회의</option>' +
        '                    <option value="2" {{COMMENTTYPE2}}>진행상황</option>' +
        '                </select>                        ' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="col-sm-10">' +
        '        <div class="form-group required">' +
        '            <div class="input-group">' +
        '                <textarea class="form-control custom-control" id="project-history-comment" name="comment" style="resize:none;" rows="5" required>{{내용}}</textarea>' +        
        '                <span class="input-group-addon btn btn-primary" id="project-history-edit-save">수정</span>' +        
        '                <span class="input-group-addon btn btn-white" id="project-history-cancel">취소</span>' +        
        '            </div>' +
        '            <div class="help-block with-error"></div>' +
        '        </div>' +
        '    </div>' +        
        '</form>';
        
    }

   

    exports.project = exports.project || {};
    exports.project.Template = Template;

})(window);