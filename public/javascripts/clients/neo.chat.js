var $captureImages;
$(document).ready(function () {
    $captureImages = document.getElementById('captureImages');
    if ($captureImages.addEventListener) {
        $captureImages.addEventListener('paste', onPasteCaptureImage, false);
    }
    // IE <= 8
    else {
        $captureImages.attachEvent('onpaste', onPasteCaptureImage);
    }

    $('input[type=file]').bootstrapFileInput();

    $("input#exe").bind("click", function () {
        onChangePlaceHolder($(this).val());
    });

    $('.btn-astype').bind('click', function () {
        var $this = $(this);
        $this.toggleClass('active').siblings().removeClass('active');
        if ($this.hasClass('active')) {
            $this.prepend('<i class="fa fa-check"></i> ');
            $this.siblings().find('i').remove();
            $('input#astype').val($(this).data('astype'));
        } else {
            $this.find('i').remove();
            $('input#astype').val(0);
        }
    });

    $(document).on('submit', 'form', function (event) {
        var browser = parseInt(sessionStorage.getItem('browser'));

        var tel = $('#client_contact').val().trim();
        var tel2 = $('#client_contact2').val().trim();
        if (tel2.length > 0) {
            tel = tel + ":" + $('#client_contact2').val().trim();
        }
        if (tel.length > 20) {
            alert('연락처가 너무 깁니다. \n연락처+내선번호 19자 이하로 입력해주세요.');
            $('#client_contact').focus();
            return event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        }


        if (!$('button.btn-astype').hasClass('active')) {
            alert('AS접수 구분을 선택해주세요.');
            return event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        }

        if (browser > 9) {
            event.preventDefault();
            $('body').addClass('animated slideOutLeft');
            $('body').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                function (e) {
                    event.target.submit();
                });
        }
    });

});
$(document).on('click', '#capture', function (event) {

    // $('title').html("LOCALCAPTURE");
  
        //     $('title').html("LOCALCAPTURE");
    if(!window.onCapture || window.onCapture == 0){
        document.title = "LOCALCAPTURE";
        window.onCapture = 1;
    }else{

        var event = document.createEvent('KeyboardEvent');
        event.initKeyboardEvent("keypress",       // typeArg,                                                           
                   true,             // canBubbleArg,                                                        
                   true,             // cancelableArg,                                                       
                   null,             // viewArg,  Specifies UIEvent.view. This value may be null.     
                   true,            // ctrlKeyArg,                                                               
                   false,            // altKeyArg,                                                        
                   false,            // shiftKeyArg,                                                      
                   false,            // metaKeyArg,                                                       
                    86,               // keyCodeArg,                                                      
                    0);              // charCodeArg);
        $captureImages.dispatchEvent(event);
        window.onCapture = 0;
    }
  
});


function onPasteCaptureImage(event) {
    alert('onPaste');
    // console.log('paste');
    // var items = (event.clipboardData || event.originalEvent.clipboardData || window.clipboardData).items;
    // console.log(JSON.stringify(items)); // will give you the mime types
    // for (index in items) {
    //     var item = items[index];
    //     if (item.kind === 'file') {
    //         var blob = item.getAsFile();
    //         var reader = new FileReader();
    //         reader.onload = function (event) {
    //             // console.log(event.target.result)
    //             var $target = $('#captureImages');
    //             $target.append(
    //                 '<div class="col-xs-3">' +
    //                 '<button type="button" class="close capture-image" style="color:#FF0000;opacity:1;" data-dismiss="modal">&times;</button>' +
    //                 '<img class="img-responsive"  src="' + event.target.result + '"/>' +
    //                 '</div>'
    //             )
    //         }; // data url!
    //         reader.readAsDataURL(blob);
    //     }
    // }
};

$(document).bind('keydown', function (event) {
    console.log(event);
});

$(document).on('click', 'button', function (event) {
    if ($(this).hasClass('capture-image')) {
        if (confirm('해당 이미지를 삭제하겠습니까?')) {
            $(this).parent().remove();
        }
    }
});

function onChangePlaceHolder(exe) {
    var $placeholder = $('#comment-placeholder');
    var $comment = $('#comment');
    var comment = $comment.val().trim();

    var placeholder = "";
    switch (exe) {
        case "데스크":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>초진챠트/명세서/영수증은 어떻게 보나요?</p>';
            placeholder += '<br>';
            placeholder += '<p>챠트번호 111번 김센스 환자를 부를 때 런타임 오류가 뜹니다.</p>';
            break;
        case "진료실":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>퇴원약은 어떻게 처리하나요?</p>';
            placeholder += '<br>';
            placeholder += '<p>챠트번호 111번 김센스 환자를 부를 때 런타임 오류가 뜹니다.</p>';
            break;
        case "진료지원":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>01월 01일 검사실에서 챠트번호 111번 김센스환자 동일한 오더가 두개가 나타납니다.</p>';
            placeholder += '<br>';
            placeholder += '<p>01월 01일 검사 진료가 있는데 검사실에서 챠트번호 111번 김센스환자가 없습니다.</p>';
            break;
        case "문서관리":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>건강진단서 내용에 오탈자가 있습니다.</p>';
            placeholder += '<br>';
            placeholder += '<p>01월 01일 챠트번호 111번 김센스환자 건강진단서 출력시 두 장이 나옵니다.</p>';
            break;
        case "입원수납":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>챠트번호 111번 김센스환자 가져오기도중 에러가 발생합니다.</p>';
            placeholder += '<br>';
            placeholder += '<p>챠트번호 111번 김센스환자 계산수납상 금액계산이 실제 계산과 다릅니다.</p>';
            break;
        case "청구심사":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>환자의 청구집계가 안되고 있습니다.</p>';
            placeholder += '<br>';
            placeholder += '<p>명세서 점검중에 수기료 에러메세지가 나타납니다.</p>';
            break;
        case "경영관리":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>통계기간을 지정하고 조회했는데 챠트번호 111번 김센스환자가 나타나지 않습니다.</p>';
            placeholder += '<br>';
            placeholder += '<p>미수금통계의 미수금금액이 실제 데이터와 맞지 않습니다.</p>';
            break;
        case "외래간호":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>외래간호에서 달력이 사라졌습니다,</p>';
            placeholder += '<br>';
            placeholder += '<p>챠트번호 111번 김센스 환자를 부를 때 런타임 오류가 뜹니다.</p>';
            break;
        case "병원관리":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>처방코드 생성은 어떻게 하나요?</p>';
            placeholder += '<br>';
            placeholder += '<p>사용자에게 권한을 갖게 하려면 어떻게 하나요?</p>';
            break;
        case "병동":
            placeholder += "<h5>[ 예 시 ]</h5>";
            placeholder += '<p>픽업, 액팅은 어떻게 하나요?</p>';
            placeholder += '<br>';
            placeholder += '<p>챠트번호 111번 김센스환자 액팅되지 않았는데 시행자에 이름이 들어가요.</p>';
            break;
    }

    $placeholder.empty().append(placeholder).css({
        'width': '100%',
        'height': '214px',
        'border': '1px solid #C0C0C0',
        'padding': '6px 12px'
    }).removeClass('hidden');
    $placeholder.bind('click', function () {
        $placeholder.addClass('hidden');
        $comment.removeClass('hidden');
        $comment.val('').focus();
    })
    $comment.bind('focusout', function () {
        if (!$(this).val().trim()) {
            $placeholder.removeClass('hidden');
            $comment.addClass('hidden');
        }
    });
    $comment.addClass('hidden');

}