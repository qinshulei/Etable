// ajax api
var refresh_table_data = function(table_data){
    $('#etable td').each(function(index){
        var id = parseInt($(this).attr("id").substring(4));
        $(this).html(table_data.datas[id]);
        if(table_data.status[id] !== ""){
            $(this).addClass("text-primary");
        }else{
            $(this).removeClass("text-primary");
        }
    });
};

var get_host_url = function(){
    console.log(window.location.hostname + ":" + window.location.port);
    return "http://"+window.location.hostname + ":" + window.location.port;
}

function startRefresh() 
{ 
    var req_obj = {
        "req_type" : "refresh",
    };

    var refresh_done = function(data, textStatus, jqXHR){
        refresh_table_data(data.data.table_data);
    }

    var refresh_fail = function(data, textStatus, jqXHR){
        console.log("response failed");
        refresh_table_data(data.data.table_data);
    }
    
    $.ajax({
        type : "POST",
        url : get_host_url(),
        data : JSON.stringify(req_obj),
        contentType : "application/json",
        dataType : "json",
    }).done(refresh_done).fail(refresh_fail);
} 

$('.cell').dblclick(function(){
    var self = this;
    console.log("modify cell : "+$(self).attr("id"));
    $('#myModal_content').val($.trim($(self).html()));
    $('#myModal').modal('show');
    $('#myModal_confirm').unbind("click");
    $('#myModal_close').unbind("click");
    
    $('myModal_content').val("Loading").attr("readonly","readonly");
    
    var req_obj = {
        "req_type" : "cell-lock",
        "req_data" : {
            "id" : $(self).attr("id"),
        }
    };

    var lock_done = function(data, textStatus, jqXHR){
        console.log("start response post request");

        refresh_table_data(data.data.table_data);

        if(data.result !== "success"){
            console.log("response failed");  
            $('myModal_content').val("Loading").attr("readonly","readonly");
            $('#myModal').modal('hide');
            
            return;
        }

        $('myModal_content').removeAttr("readonly");

        $('#myModal_close').bind("click",function(){

            var req_obj = {
                "req_type" : "release-lock",
                "req_data" : {
                    "id" : $(self).attr("id")
                }
            };

            var release_done = function(data, textStatus, jqXHR){

                refresh_table_data(data.data.table_data);
            }

            var release_fail = function(data, textStatus, jqXHR){
                console.log("response failed");
                refresh_table_data(data.data.table_data);
            }
            
            $.ajax({
                type : "POST",
                url : get_host_url(),
                data : JSON.stringify(req_obj),
                contentType : "application/json",
                dataType : "json",
            }).done(release_done).fail(release_fail);

            $('#myModal').modal('hide');
        });

        
        $('#myModal_confirm').bind("click",function(){
            //ajax post
            $(self).html($('#myModal_content').val());

            var req_obj = {
                "req_type" : "cell-modify",
                "req_data" : {
                    "id" : $(self).attr("id"),
                    "content" : $('#myModal_content').val() 
                }
            };

            var modify_done = function(data, textStatus, jqXHR){
                console.log("start response post request");
                if(data.result === "success"){
                    console.log("response success");  
                }else{
                    console.log("response failed");  
                }
                refresh_table_data(data.data.table_data);
            }

            var modify_fail = function(data, textStatus, jqXHR){
                console.log("response failed");
                refresh_table_data(data.data.table_data);
            }
            
            $.ajax({
                type : "POST",
                url : get_host_url(),
                data : JSON.stringify(req_obj),
                contentType : "application/json",
                dataType : "json",
            }).done(modify_done).fail(modify_fail);

            $('#myModal').modal('hide');
        });
    }

    var lock_fail = function(data, textStatus, jqXHR){
        console.log("response failed");
        refresh_table_data(data.data.table_data);
    }
    
    $.ajax({
        type : "POST",
        url : get_host_url(),
        data : JSON.stringify(req_obj),
        contentType : "application/json",
        dataType : "json",
    }).done(lock_done).fail(lock_fail);

});

$(document).ready(function () { 
    setInterval("startRefresh()",2000); 
}); 

