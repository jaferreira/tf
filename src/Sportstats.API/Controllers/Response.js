
 var response = {
	successResponse: function () {
        return {
            success: true
        };
     },
     
     successResponse = function (resultObj) {
        return {
            success: true,
            resultObj: resultObj
        };
     },

     successResponse = function (resultObj, message) {
        return {
            success: true,
            resultObj: resultObj,
            message: message
        };
     },
    
     errorResponse = function (message) {
        return {
            success: false,
            message: message
        };
     }
};

module.exports = response;