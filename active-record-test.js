const activeRecord = require('active-record');
const SqlModel = activeRecord.SqlModel;
const LdapModel = activeRecord.LdapModel;

activeRecord.setConfig({
  mysql: {
    logQuery: false
  },
  ldap: {
    ldapIgnoreSelfSignedCertificates: true,
    logQuery: false,
    manualLdapQueryTimeOut: 0 // 0 = No manual query timeout || milisec for the manual query timeoiut
  }
});

const mysqlConn = activeRecord.createMysqlConn({
    host: "localhost",
    user: "root",
    password: "asrkpvr7",
    database: "striggerControl",
    // port: null
});
const ldapConn = activeRecord.createLdapConn({
    url: 'ldap://url'
})

class Background extends ActiveRecord.SqlModel {
    constructor(data) {
      super(data);
  
      var fields = [SqlModel.createField({
        name: 'id'
      }), SqlModel.createField({
        name: 'user'
      }), SqlModel.createField({
        name: 'color'
      }), SqlModel.createField({
        name: 'pass'
      })];
  
      this.init({
        fields: fields,
        Model: Background,
        data: data
      });
    }
  }

Background.primaryKey = 'id';
Background.table = 'background';
Background.adapter = 'mysql';
Background.connection = mysqlConn;