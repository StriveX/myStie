function loadBlogs(url) {
	$.ajax({
        url : url,
        type : "GET",
        success : function(rst) {
            $("#blog_block").append($.parseHTML(rst));
        },
        error : function(xhr,errmsg,err) {
        }
    });
}