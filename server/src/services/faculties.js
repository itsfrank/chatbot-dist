"use strict";
exports.SCIENCE = 'sci';
exports.MANAGEMENT = 'mgmt';
exports.facultyList = [exports.SCIENCE, exports.MANAGEMENT];
exports.FacultyMap = {
    subdomains: {
        'science': exports.SCIENCE,
        'management': exports.MANAGEMENT
    },
    facebook: {
        ids: {
            '1397940820223215': exports.SCIENCE,
            '1582091102085150': exports.MANAGEMENT
        },
        tokens: {
            SCIENCE: 'EAAXBClPmZCXABAAE8MlaQeCViHwdth0s9jq3VMEOWTiOsxYQmAGlK0q1ZAv9xZAGFotnbMTw2a11WRHNqtCxl4cuTxq5uJonPCvrgBFHYHl7ZA2Q2eKzYciiifnZBEQA0nMybYrc0VhmTjOMEPmj003y79XFcSirF0xgd9MZCtNAZDZD',
            MANAGEMENT: 'EAAXBClPmZCXABAE0UAZBwkrJL0MtCVvDRaADfId0WH7bwKcjkp5t2xrxCKPaDcu7OcwWAcElrFiPSjMJ9GbX8erzkQmTbpUD84bjMAPc6PfZCNmf2Y6W3xbL6mxgRvkoKFkWRUBHoYmpprzs4weBsRAcwsMbFw6qMBAZAkAZB3QZDZD'
        }
    }
};
function requestFaculty(req) {
    if (req.subdomains.length != 1)
        return null;
    else
        return exports.FacultyMap.subdomains[req.subdomains[0]];
}
exports.requestFaculty = requestFaculty;
//# sourceMappingURL=faculties.js.map