(function (exports) {
    'use strict';

    function Template() {
        console.log('Template created');
        this.projectStatus = {
            0 : '접수',
            1 : '검토',
            2 : '개발',
            3 : '개발테스트',
            4 : '개발완료',
            5 : '사용테스트',
            6 : '완료',
            7 : '보류',
            10 : '취소'
        };
        

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
            '<button class="btn btn-success btn-outline btn-xs">{{개발자}}</button>';
        this.defaultProjectItem = '' +
            '<div class="col-lg-3 col-md-4 col-sm-6">' +
            '    <div class="ibox" data-projectid={{프로젝트ID}} data-projectindex={{INDEX}}>' +
            '        <div class="ibox-title">' +
            '            <h5>(ID: {{INDEX}}) {{프로젝트명}}</h5>' +
            '            <div class="ibox-tools"><a style="color:#FFF;" class="btn btn-xs btn-primary" href="/project/detail/{{INDEX}}">상세보기</a></div>' +
            '        </div>' +
            '        <div class="ibox-content p-xs"><small class="pull-right text-muted">마지막 수정일자 : {{수정일자}}</small>' +            
            '            <div class="developers" style="display:none;">' +
            '                <p class="font-bold">개발자</p>{{개발자}}' +
            '            </div>' +
            '            <div class="ellipsis"><div><p><strong class="text-muted">DETAIL...</strong><br/>{{상세내용}}</p></div></div>' +
            '            <div class="hr-line-dashed"></div>' +
            '            <div class="ellipsis"><div><p><strong class="text-muted">EFFECT...</strong><br/>{{기대효과}}</p></div></div>' +
            '            <div>' +
            '               <span class="font-bold">프로젝트 진행 상태</span>' +
            '               <div class="stat-percent font-bold">{{상태명}}</div>'+
            '               <div class="progress progress-striped {{상태바}}">' +
            '                   <div class="progress-bar {{상태바상태}}" style="width: {{상태}}%;">{{상태명}}</div>' +
            '               </div>' +            
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

    Template.prototype.insertProjectItem = function (jsonData) {
        var self = this;
        var view = '';        
        if (jsonData.err === 'NODATA' || jsonData.err) {
            return this.defaultNoProject;
        } else if (!jsonData.data[0].length){
            return this.defaultNoProject;
        } else {
            var projects = jsonData.data[0];
            var developers = jsonData.data[1];
            projects.forEach(function(project){
                var template = self.defaultProjectItem;
                template = template.replace(/{{INDEX}}/gim, project['인덱스']);
                // template = template.replace(/{{프로젝트ID}}/gim, project['프로젝트ID']);                
                template = template.replace(/{{프로젝트명}}/gim, project['프로젝트명']);
                template = template.replace(/{{수정일자}}/gim, project['수정일자']);



                template = template.replace(/{{개발자}}/gim, self.insertProjectDevelopers(project['프로젝트ID'], developers));
                template = template.replace(/{{상세내용}}/gim, project['상세내용'].replace(/\r?\n/g, '<br />'));
                template = template.replace(/{{기대효과}}/gim, project['기대효과'].replace(/\r?\n/g, '<br />'));
                template = template.replace(/{{프로그램}}/gim, project['프로그램'] === 0 ? '공통' :  neo.emrs[project['프로그램']].name);
                template = template.replace(/{{등록자}}/gim, neo.users.GetUserName(project['등록자']).USER_NAME);
                template = template.replace(/{{등록일자}}/gim, project['등록일자']);
                var projectPercent = 0, barStatus = '', barActive = 'active';                
                if(project['상태'] == 1) { barStatus = 'progress-bar-primary';}
                if(project['상태'] == 2) { barStatus = 'progress-bar-primary';}
                if(project['상태'] == 3) { barStatus = 'progress-bar-primary';}
                if(project['상태'] == 4) { barStatus = 'progress-bar-primary';}
                if(project['상태'] == 5) { barStatus = 'progress-bar-primary';}
                if(project['상태'] == 6) { barStatus = 'progress-bar-success'; barActive = '';}
                if(project['상태'] == 7) { barStatus = 'progress-bar-warning'; barActive = '';}
                if(project['상태'] == 10) { barStatus = 'progress-bar-danger'; barActive = '';}
                if(project['상태'] > 0 && project['상태'] < 6) projectPercent = project['상태'] * 16.7;                
                else if(project['상태'] >= 6 ) projectPercent = 100;    
                template = template.replace(/{{상태바}}/gim, barActive);
                template = template.replace(/{{상태바상태}}/gim, barStatus);
                template = template.replace(/{{상태}}/gim, projectPercent);                
                template = template.replace(/{{상태명}}/gim, self.projectStatus[project['상태']]);


                view += template;
            });
            return view;
        }
    };

    Template.prototype.insertProjectDevelopers = function(projectid, developers){
        var self = this;
        var view = '';
        if(!developers.length) {
            view = self.defaultProjectDeveloper;
            view = view.replace('{{개발자}}', '미정');            
        }else{
            developers.forEach(function(developer){
                if(projectid === developer['프로젝트ID']) {
                    var template = self.defaultProjectDeveloper;
                    template = template.replace('{{개발자}}', neo.users.GetUserName(developer['개발자']).USER_NAME);
                    view += template;
                }
            });
            if(view === ''){
                view = self.defaultProjectDeveloper;
                view = view.replace('{{개발자}}', '미정');    
            }
        }

        return view;
    };

    exports.project = exports.project || {};
    exports.project.Template = Template;

})(window);