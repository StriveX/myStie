import MySQLdb as mysql
import numpy as np
import sys

host = 'localhost'
usr = 'root'
password = 'zx0228033018'
db = 'mysite'

def loadDataFromDB(table):
    '''
    loadDataFromDB loads data of the given table (name),
    and convert them into numpy.matrix for further use
    '''
    try:
        con = mysql.connect(host, usr, password, db);
        cur = con.cursor()
        cur.execute("SELECT * FROM " + table)
        rows = cur.fetchall()
        x = map(list, list(rows))
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]  
        print field_names
        if ("cid" in field_names):
            idIndex = field_names.index("cid")
            print idIndex
            for row in x:
                del row[idIndex]
        if ("id" in field_names):
            nameIndex = field_names.index("id")
            for row in x:
                row.append(row[nameIndex])
                del row[nameIndex]
        return np.mat(x), field_names
    except mysql.Error, e:
        print "Error %d: %s" % (e.args[0],e.args[1])
        sys.exit(1)    
    finally:    
        if con:    
            con.close() 