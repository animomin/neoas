(function (exports) {
    'use strict';

    /**   
     * Model
     */
    function Model(storage) {
        console.log('Model');
        this.storage = storage;
    }

    Model.prototype.getDailyReportsList = function (option, callback) {
        var self = this;
        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            beforeSend: function () {
                if (option.save && self.storage) {
                    self.storage.removeData('dailylist');
                }
            },
            success: function (result) {
                callback(result);
            },
            complete: function (result) {
                if (option.save) {
                    self.storage.setData('dailylist', result.responseJSON.data);
                }
            }
        })
    };

    Model.prototype.getTodayWorkList = function (option, callback) {
        var self = this;
        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            beforeSend: function () {
                if (option.save && self.storage) {
                    self.storage.removeData('worklist');
                }
            },
            success: function (result) {
                callback(result);
            },
            complete: function (result) {
                if (option.save) {
                    self.storage.setData('worklist', result.responseJSON.data);
                }
            }
        });
    };

    Model.prototype.getWorkDetail = function (option, callback) {
        // var dailylist = this.storage.getData('dailylist');
        // debugger;
        // callback(dailylist[param.kind].find(function (_item) {
        //     return _item.인덱스 === param.index;
        // }));
        var self = this;
        $.ajax({
            url : option.url,
            dataTpye : option.dataType,
            data : option.data,
            async : option.async,
            method : option.method,
            success : function(result){
                callback(result);
            }
        })
    };

    Model.prototype.saveDailyWork = function (option, callback) {

        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            beforeSend: function () {
                if (option.loader.length) {
                    if (!option.loader.find('i').length) {
                        option.loader.prepend('<i class="fa fa-spinner fa-spin"></i>').addClass('disabled').attr('disabled', true);
                    }
                }
            },
            success: function (result) {
                callback(result);
            },
            complete: function () {
                if (option.loader.length) {
                    if (option.loader.find('i').length) {
                        option.loader.find('i').remove();
                        option.loader.removeClass('disabled').removeAttr('disabled');
                    }
                }
            }
        });
    };

    Model.prototype.deleteDailyReport = function (option, callback) {
        $.ajax({
            url: option.url,
            dataType: option.dataType,
            data: option.data,
            method: option.method,
            async: option.async,
            success: function (result) {
                if (result.err) {
                    neoNotify.Show({
                        text: '보고서 삭제를 실패하였습니다. <br> ' + result.err.message,
                        type: 'error',
                        desktop: false
                    });
                } else if (result.data[0].Status != 0) {
                    neoNotify.Show({
                        text: '보고서 삭제를 실패하였습니다. <br> ' + result.data[0].Message,
                        type: 'error',
                        desktop: false
                    });
                } else {
                    neoNotify.Show({
                        text: '보고서를 삭제하였습니다.',
                        type: 'success',
                        desktop: false
                    });
                }
                callback(result);

            },
        });
    };

    Model.prototype.findEditData = function (option, callback) {
        var dailylist = this.storage.getData('dailylist');
        dailylist = dailylist[2];
        callback(dailylist.find(function (item) {
            return item.인덱스 === option.report_id;
        }));
    };

    exports.worklist = exports.worklist || {};    
    exports.worklist.Model = Model;
    
})(window);