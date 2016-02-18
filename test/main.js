'use strict';

(function (win) { 

    /*
     * 文件依赖
     */
    var config = {
        paths: {
            jquery: '../src/scripts/lib/jquery-2.2.0.min' ,
            formdata: "../src/scripts/formdata",
        } 
    };

    require.config(config);

    require(['formdata'], function (form) {
        $("#btnGetData").on("click", function () {
            alert(JSON.stringify(form.getData("temp")));
        });
        $("#btnInitData").on("click", function () {
            var data = { "name": "123", "sex": "0", "interest": "2", "detail": { "name": "test" }, "headerImage": "http://developer.baidu.com/resources/online/errors/img/img_404.png", "a": {"b":"123123"},"brithday":"2015-02-11" };
            form.initData("temp", data); 
        });
    });

})(window);
 