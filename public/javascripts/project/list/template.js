(function (exports) {
    'use strict';

    function Template() {
        console.log('Template created');

        this.defaultSpinner = '' +
            '<div class="spiner-example animated fadeInDown">' +
            '   <div class="sk-spinner sk-spinner-fading-circle">' +
            '       <div class="sk-circle1 sk-circle"></div>' +
            '       <div class="sk-circle2 sk-circle"></div>' +
            '       <div class="sk-circle3 sk-circle"></div>' +
            '       <div class="sk-circle4 sk-circle"></div>' +
            '       <div class="sk-circle5 sk-circle"></div>' +
            '       <div class="sk-circle6 sk-circle"></div>' +
            '       <div class="sk-circle7 sk-circle"></div>' +
            '       <div class="sk-circle8 sk-circle"></div>' +
            '       <div class="sk-circle9 sk-circle"></div>' +
            '       <div class="sk-circle10 sk-circle"></div>' +
            '       <div class="sk-circle11 sk-circle"></div>' +
            '       <div class="sk-circle12 sk-circle"></div>' +
            '   </div>' +
            '</div>';

        this.defaultNoProject = '' +
            '<div class="jumbotron no-prjects animated fadeInRight">' +
            '    <h1><i class="fa fa-unlink"></i> 진행중인 프로젝트가 없습니다.</h1>' +
            '</div>';
        this.defaultProjectDeveloper = '' +
            '<button class="btn btn-info btn-outline btn-xs">서재민</button>';
        this.defaultProjectItem = '' +
            '<div class="col-lg-4 col-md-6">' +
            '    <div class="ibox" data-projectid={{ID}} data-projectindex={{INDEX}}>' +
            '        <div class="ibox-title">' +
            '            <h5>({{프로젝트ID}}){{프로젝트명}}</h5>' +
            '            <div class="ibox-tools"><a style="color:#FFF;" class="btn btn-xs btn-primary" href="prject/{{ID}}">상세보기</a></div>' +
            '        </div>' +
            '        <div class="ibox-content"><small class="pull-right text-muted">마지막 수정일자 : {{수정일자}}</small>' +
            '            <div class="team-members">{{개발자}}</div>' +
            '            <p>{{상세내용}}</p>' +
            '            <div><span class="font-bold">프로젝트 진행 상태</span>' +
            '                <div class="stat-percent">{{상태}}</div>' +
            '                <div class="progress progress-mini">' +
            '                    <div style="width: {{상태%}}%;" class="progress-bar"></div>' +
            '                </div>' +
            '            </div>' +
            '            <div class="row m-t-sm">' +
            '                <div class="col-xs-4">' +
            '                    <div class="font-bold">프로그램</div><small>{{프로그램}}</small>' +
            '                </div>' +
            '                <div class="col-xs-4">' +
            '                    <div class="font-bold">등록자</div><small>{{등록자}}</small>' +
            '                </div>' +
            '                <div class="col-xs-4">' +
            '                    <div class="font-bold">등록일자</div><small>{{등록일자}}</small>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>';

    }

    Template.prototype.insertProjectItem = function (data) {
        var view = '';
        if (data.err === 'NODATA'){
            return this.defaultNoProject;
        }else{

        }
    };

    exports.project = exports.project || {};
    exports.project.Template = Template;

})(window);