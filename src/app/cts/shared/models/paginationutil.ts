import { table } from 'console';
import { AppConstants } from '../../app-constants';

export class Paginationutil {
    static getDefaultFilter() {
        return JSON.stringify({
            "sort": "",
            "pageNo": 1,
            "pageSize": 10,
            "group": "",
            "filter": "",
            "queryType":0,
            "idValue":"",
            "tablecode":""
        })
    }

    static getGridFilters(Table: any, multiselectFilter: string, isReset = false) {
        
        let currentPage = Table.first + 1;
        let pageCount = (Table.first / Table.rows) + 1;
        let pageNumber = 1;
        if (Table.first != 0) {
            pageNumber = (Table.first / Table.rows) + 1;
        }
        let currentrows = Table.row * pageNumber;
        let sorts = (Table.sortField == undefined) ? '' : ((Table.sortField) + '' + (Table.sortOrder == -1 ? ' DESC' : ' ASC'));
        let pageSize = Table.rows;

       

        let columnLevelFilter = Object.keys(Table.filters).map((key) => {
            if((key != "dob" && key != "createddate"))    {     
            let comparison = `LIKE '%${Table.filters[key].value}%'`;
            return `(${key} ${comparison})`
            }
            else{
                let comparison = `< '${Table.filters[key].value}'`;
                return `(${key} ${comparison})`
            }
           
        }).join(' AND ')

        

        let finalFilterString = "";

        if (columnLevelFilter.trim() != "" && multiselectFilter.trim() != "") {
            finalFilterString = (columnLevelFilter + ' AND (' + '' + multiselectFilter + ')');
        }
        else if(multiselectFilter.trim() != ""){
            finalFilterString = multiselectFilter;
        }
        else if(columnLevelFilter.trim() != ""){
            finalFilterString = columnLevelFilter;
        }

        if (isReset) {
            Table.first = 0;
        }

        return {
            "currentPage": currentPage,
            "pageCount": pageCount,
            "sorts": sorts,
            "pageNo": (isReset ? 1 : pageNumber),
            "pageSize": pageSize,
            "group": "",
            "queryType":1,
            "idValue":"",
            "tablecode":"",
            "filter": (finalFilterString.trim() != "" ? `(${finalFilterString})` : "")
        };
    }

    static getDefaultFormat() {
        return AppConstants.DateTimeFormat.datetimeformat;
     }

    static getServerSideDateFormat(){
        return AppConstants.DateTimeFormat.serversidedateformat;
    }

    static getServerSideYearFormat(){
        return AppConstants.DateTimeFormat.serversideyearformat;
    }

    static getAngularDateFormat(){
        return AppConstants.DateTimeFormat.angulardateformat;
    }

    static getFilterDateFormat(){
        return AppConstants.DateTimeFormat.filterdateformat;
    }
}
