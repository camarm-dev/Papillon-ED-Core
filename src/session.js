const getHomeworks = require("./fetch/getHomeworks");
const getGrades = require("./fetch/getGrades");
const getTimetable = require("./fetch/getTimetable");
const getSchoollife = require("./fetch/getSchoollife");

const Request = require("./Request")
const Auth = require("./auth");



class Session {
    constructor() {
        this._token = null; //Le token
        this.isLoggedIn = false;
        this.settings = {}; //Les paramètres de l'utilisateur
        this.student = {}; //Info de l'étudiant
        this.school = {}; //Info de l'etab
        this.modules = []; //Les modules

        this.homeworks = new getHomeworks(this);
        this.grades = new getGrades(this);
        this.timetable = new getTimetable(this);
        this.schoollife = new getSchoollife(this);

        this.auth = new Auth(this);
        this.request = new Request(this);
    }



}

module.exports = Session