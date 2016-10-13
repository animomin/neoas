(function() {

    var NeoClient = function(){
      //this.elem.init(this);
      var elem = this.elem;
      elem.$acceptor = $('input#client_name');
      elem.$phone1 = $('input#client_contact');
      elem.$phone2 = $('input#client_contact2');
      elem.$acceptKind = $('button.client_acceptKind');
      elem.$comment = $('textarea#comment');
      elem.$uploadImage = $('input#capture');
      elem.$captureImage = $('button#captureImage');
      elem.$form = $('form#accept');

      //tinymce.init({ selector:'textarea#comment' });
      tinymce.init({
        selector: 'textarea#comment',
        height: 250,
        toolbar: 'undo redo | acceptKind | uploadImage | captureImage',
        menubar: false,
        statusbar: false,
        setup: function (editor) {
          editor.addButton('acceptKind', {
            type: 'listbox',
            text: '접수구분',
            icon: false,
            onselect: function (e) {
              //editor.insertContent(this.value());
              $('input#astype').val(this.value());
            },
            values: [
              { text: '프로그램 장애', value: '1' },
              { text: '프로그램 사용법', value: '2' }
            ]
          });

          editor.addButton('uploadImage', {
            text : '사진첨부',
            onclick : function(e){
              elem.$uploadImage.trigger('click');
            }
          });

          editor.addButton('captureImage', {
            text : '화면캡쳐',
            onclick : function(e){
              alert('capture');
            }
          })
        }
      })

      elem.$form.bind('submit', this.events.onSubmit);
      elem.$uploadImage.bind('change', this.events.onUploadImage);

    }

    NeoClient.prototype = {
      elem : {
        $aceeptor : null,
        $phone1 : null,
        $phone2 : null,
        $acceptKind : null,
        $comment : null,
        $uploadImage : null,
        $captureImage : null,

        $form : null
      },
      events : {
        onSubmit : function(event){
          alert('submit');
        },
        onUploadImage : function(event){
          var editor = tinymce.activeEditor;
          var selFile = $(this).val();

          if(!selFile.match(/jpg|bmp|gif|png/gi)){
            return editor.notificationManager.open({
              text: '이미지 파일만 첨부하실 수 있습니다.',
              type: 'error',
              timeout : 5000
            });
          }else{
            $('form#uploadImage').ajaxForm({
              success : function(res){
                if(parseInt(res)===200){
                  var temp = selFile.split('\\');

                  editor.insertContent('<img src="uploads/' + temp[temp.length-1] + '" />');
                }
              }
            }).submit();
          }

        }
      }
    };


    // NeoAS();
    $.neoClient = NeoClient;

})(window);
