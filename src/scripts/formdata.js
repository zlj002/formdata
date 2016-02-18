define(['jquery'], function ($) {
    'use strict';
    //添加h5 特殊选择器
    $.expr[':'].date = function (obj, index, meta, stack) {
        var $this = $(obj);

        return ($this.prop('type') == "date");
    };
    //合并对象
    String.prototype.toObjectAccessor = function (splitter, parentObject, value) {
        splitter = splitter || '.';

        var items = this.split(splitter),
            data = parentObject || {},
            accessor = data;

        for (var i = 0; i < items.length; i++) {
            if (i == items.length - 1) {
                if (accessor[items[i]]) {
                    accessor[items[i]] = accessor[items[i]] + "," + value;
                } else {
                    accessor[items[i]] = value;
                }
            }
            else {
                accessor[items[i]] = accessor[items[i]] || {};
                accessor = accessor[items[i]];
            }
        }

        return data;
    };
    //赋值
    var initData = function (domID, data) {
        var elems = ":password[name],:text[name],:hidden[name],textarea[name],select[name],:checkbox[name],:radio[name],span[name],img[name],div[name],:date";
        $("#" + domID).find(elems)
        .each(function () {
            var elem = $(this),
                        name = elem.attr('name'),
                        value = data[name];
            //清除上次数据
            if (elem.val() && !elem.is(":radio,:checkbox")) {
                elem.val('');
            } else if (elem.html()) {
                elem.html('');
            } else if (elem.is(":radio,:checkbox")) {
                elem.prop("checked", false);
            } else if (elem.is("img")) {
                elem.removeProp("src");
            }


            //是否有多层次对象
            var items = name.split('.');
            if (items.length > 1) {
                var tempData = {};
                $(items).each(function (index, item) {
                    if (index == 0 && data[item]) {
                        tempData = data[item];
                    } else if (index > 0 && tempData[item]) {
                        tempData = tempData[item];
                        value = tempData;
                    }
                });
            }
            if (!value) {
                return true;
            } else if (elem.is(':radio')) {
                elem.prop('checked', elem.val() == value.toString());
                return true;
            } else if (elem.is(":checkbox")) {
                elem.prop('checked', elem.val() == value.toString());
                var vals = value.split(",");
                if (vals.length > 1) {
                    $(vals).each(function (index, item) {
                        var ch = elem.val() == item.toString();
                        if (ch) {
                            elem.prop('checked', ch);
                            return true;
                        }
                    });
                }
                return true;
            }
            else if (elem.is("span") || elem.is("div")) {
                elem.html(value);
                //特殊情况，手机端添加特殊标签，比如拨打电话，和打开网页
                if (elem.prop("istel") == "true") {
                    elem.html("");
                    var telA = $("<a href='tel:" + value + "'>" + value + "</a>");
                    telA.css("color", elem.css("color"));
                    elem.append(telA);
                } else if (elem.prop("iswebsite") == "true") {
                    elem.off().on("click", function () {
                        if (value.indexOf('http://') < 0) {
                            value = 'http://' + value;
                        }
                        window.open(value, "_system");
                    });
                } else if (elem.prop("isemail") == "true") {
                    elem.html("");
                    var telA = $("<a href='mailto:" + value + "'>" + value + "</a>");
                    telA.css("color", elem.css("color"));
                    elem.append(telA);
                }
            } else if (elem.is("img")) {
                elem.prop("src", value);
            }
            else {
                elem.val(value);
            }


        });

    }
    //获取数据
    var getData = function (domID) {
        var elems = ":password[name],:text[name],:hidden[name],textarea[name],select[name],:checkbox[name],:radio[name],:date";

        var returnObj = {};
        $("#" + domID).find(elems)
            .each(function () {
                var elm = $(this),
                    value = elm.val();
                if (!value) {
                    return true;
                }
                else if (elm.is(":radio") || elm.is(":checkbox")) {
                    if (elm.prop('checked')) {
                        var val = (elm.val() == 'on') ? true : elm.val();
                        elm.attr('name').toObjectAccessor('', returnObj, val);
                    }
                } else {
                    elm.attr('name').toObjectAccessor('', returnObj, value);
                }
            });

        return returnObj;
    }

    return {
        initData: function (domID, data) {
            return initData(domID, data)
        },
        getData: function (domID) {
            return getData(domID)
        },
    }
})