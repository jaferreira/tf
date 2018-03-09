exports.successResponse = function () {
    return {
        success: true
    };
 };
exports.successResponse = function (resultObj) {
    return {
        success: true,
        resultObj: resultObj
    };
 };

exports.successResponse = function (resultObj, message) {
    return {
        success: true,
        resultObj: resultObj,
        message: message
    };
 };

exports.errorResponse = function (message) {
    return {
        success: false,
        message: message
    };
 };