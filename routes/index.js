var express = require('express');
var router = express.Router();

// hard code excel data
var table_data = {
    name : "test",
    description : "sample table data for test",
    rows : 6,
    columns : 4,
    datas : ["data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data","data"],
    status : ["","","","","","","","","","","","","","","","","","","","","","","",""]
};

/* GET home page. */
router.get('/', function(req, res) {
    console.log("get index page");
    res.render('index', { "page_path" : req.url ,"title" : 'Etable Demo' ,"table" : table_data });
});

router.post('/',function(req,res){

    console.log("enter post"+req.body);
    var req_obj = req.body;

    if(req_obj.req_type === "cell-modify")
    {
        console.log("start reponse cell-modify"+req_obj.req_data.id);

        var id = parseInt(req_obj.req_data.id.substring(4));
        console.log(id);

        table_data.datas[id] = req_obj.req_data.content;
        table_data.status[id] = "";

        var response_obj = {
            "result" : "success",
            "data" : {"table_data" : table_data }
        };

        res.json(response_obj);
    }else if(req_obj.req_type === "refresh"){
        var response_obj = {
            "result" : "success",
            "data" : {"table_data" : table_data }
        };

        res.json(response_obj);
    } else if(req_obj.req_type === "cell-lock"){
        var ua =  req.headers['user-agent'];
        console.log(ua);

        var id = parseInt(req_obj.req_data.id.substring(4));
        console.log(id);

        if(table_data.status[id] === ""){
            
            table_data.status[id] = ua;

            var response_obj = {
                "result" : "success",
                "data" : {
                    "table_data" : table_data 
                }
            };

            res.json(response_obj);

        }else if(table_data.status[id] !== ua){



            var response_obj = {
                "result" : "failed",
                "data" : {
                    "error_message" : "don't support this req_type", 
                    "table_data" : table_data 
                }
            };

            res.json(response_obj);

        }else if(table_data.status[id] === ua)
        {

            var response_obj = {
                "result" : "success",
                "data" : {
                    "table_data" : table_data 
                }
            };

            res.json(response_obj);

        }

    }else if(req_obj.req_type === "release-lock"){

        var id = parseInt(req_obj.req_data.id.substring(4));
        console.log(id);

        var ua =  req.headers['user-agent'];
        console.log(ua);

        if( table_data.status[id] === ua ){

            table_data.status[id] = "";            
            
        }else{

            
        }

        var response_obj = {
            "result" : "success",
            "data" : {
                "table_data" : table_data 
            }
        };

        res.json(response_obj);
        
    }else{
        var response_obj = {
            "result" : "failed",
            "data" : {"error_message" : "don't support this req_type", 
                      "table_data" : table_data 
                     }
        };

        res.json(response_obj);
    }

});

module.exports = router;
