$(window).on("load", function() {
    "use strict";
    $('#planSubmit').submit(function() {
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                let status = response.status;
                if(status == 1)
                {
                    $(".post-popup.pst-pj").removeClass("active");
                    $(".wrapper").removeClass("overlay");
                    $("#planSubmit").trigger("reset");
                    $("#errText").html("Plan Published Successfully...")
                    return false;
                }
                else if(status == 0)
                {
                    $("#errText").html(response.message)
                }
                else if(status == 3){
                    let errorData = response.errors;
                    let html = ''
                    $.each(errorData, function (key, e) 
                    {
                        html += `<li> ${e} </li>`
                    })
                    $("#errText").html(html)
                }
            }
        });
        return false;
    });

    //  ============= POST PROJECT POPUP FUNCTION =========

    getip();
    getpinPost();
    $(".post_project").on("click", function(){
        $(".post-popup.pst-pj").addClass("active");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".post-project > a").on("click", function(){
        $(".post-popup.pst-pj").removeClass("active");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    $("#cancelPlan").on("click", function(){
        $(".post-popup.pst-pj").removeClass("active");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= SIGNIN CONTROL FUNCTION =========

    $('.sign-control li').on("click", function(){
        var tab_id = $(this).attr('data-tab');
        $('.sign-control li').removeClass('current');
        $('.sign_in_sec').removeClass('current');
        $(this).addClass('current animated fadeIn');
        $("#"+tab_id).addClass('current animated fadeIn');
        return false;
    });

    //  ============= SIGNIN TAB FUNCTIONALITY =========

    $('.signup-tab ul li').on("click", function(){
        var tab_id = $(this).attr('data-tab');
        $('.signup-tab ul li').removeClass('current');
        $('.dff-tab').removeClass('current');
        $(this).addClass('current animated fadeIn');
        $("#"+tab_id).addClass('current animated fadeIn');
        return false;
    });

    //  ============= SIGNIN SWITCH TAB FUNCTIONALITY =========

    $('.tab-feed ul li').on("click", function(){
        var tab_id = $(this).attr('data-tab');
        $('.tab-feed ul li').removeClass('active');
        $('.product-feed-tab').removeClass('current');
        $(this).addClass('active animated fadeIn');
        $("#"+tab_id).addClass('current animated fadeIn');
        return false;
    });

    //  ============= OVERVIEW EDIT FUNCTION =========

    $(".overview-open").on("click", function(){
        $("#overview-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#overview-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= EXPERIENCE EDIT FUNCTION =========

    $(".exp-bx-open").on("click", function(){
        $("#experience-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#experience-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= EDUCATION EDIT FUNCTION =========

    $(".ed-box-open").on("click", function(){
        $("#education-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#education-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= LOCATION EDIT FUNCTION =========

    $(".lct-box-open").on("click", function(){
        $("#location-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#location-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= SKILLS EDIT FUNCTION =========

    $(".skills-open").on("click", function(){
        $("#skills-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#skills-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= ESTABLISH EDIT FUNCTION =========

    $(".esp-bx-open").on("click", function(){
        $("#establish-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#establish-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= CREATE PORTFOLIO FUNCTION =========

    $(".portfolio-btn > a").on("click", function(){
        $("#create-portfolio").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#create-portfolio").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= EMPLOYEE EDIT FUNCTION =========

    $(".emp-open").on("click", function(){
        $("#total-employes").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#total-employes").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  =============== Ask a Question Popup ============

    $(".ask-question").on("click", function(){
        $("#question-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function(){
        $("#question-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });


    //  ============== ChatBox ============== 


    $(".chat-mg").on("click", function(){
        $(this).next(".conversation-box").toggleClass("active");
        return false;
    });
    $(".close-chat").on("click", function(){
        $(".conversation-box").removeClass("active");
        return false;
    });

    //  ================== Edit Options Function =================


    $(".ed-opts-open").on("click", function(){
        $(this).next(".ed-options").toggleClass("active");
        return false;
    });


    // ============== Menu Script =============

    $(".menu-btn > a").on("click", function(){
        $("nav").toggleClass("active");
        return false;
    });


    //  ============ Notifications Open =============

    $(".not-box-open").on("click", function(){$("#message").hide();
        $(".user-account-settingss").hide();
        $(this).next("#notification").toggle();
    });

     //  ============ Messages Open =============

    $(".not-box-openm").on("click", function(){$("#notification").hide();
        $(".user-account-settingss").hide();
        $(this).next("#message").toggle();
    });


    // ============= User Account Setting Open ===========
	/*
$(".user-info").on("click", function(){$("#users").hide();
        $(".user-account-settingss").hide();
        $(this).next("#notification").toggle();
    });
    
	*/
	$( ".user-info" ).click(function() {
  $( ".user-account-settingss" ).slideToggle( "fast");
	  $("#message").not($(this).next("#message")).slideUp();
	  $("#notification").not($(this).next("#notification")).slideUp();
    // Animation complete.
  });
 

    //  ============= FORUM LINKS MOBILE MENU FUNCTION =========

    $(".forum-links-btn > a").on("click", function(){
        $(".forum-links").toggleClass("active");
        return false;
    });
    $("html").on("click", function(){
        $(".forum-links").removeClass("active");
    });
    $(".forum-links-btn > a, .forum-links").on("click", function(){
        e.stopPropagation();
    });
});

function initilize(){
    $('.profiles-slider').slick({
            slidesToShow: 3,
            slck:true,
            slidesToScroll: 1,
            prevArrow:'<span class="slick-previous"></span>',
            nextArrow:'<span class="slick-nexti"></span>',
            autoplay: true,
            dots: false,
            autoplaySpeed: 2000,
            responsive: [
            {
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: false
            }
            },
            {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
            },
            {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
            }
        ]
        });
}

function getpinPost(){
    $.ajax({
        type: "post",
        url: "/newsFeed/getPinPost",
        success: function (response) {
            let postData = response.data;
            let html = ''
            postData.forEach(element => {
                html += `<a href="/plan/singlePlan/${element.post_id._id}"><div class="suggestion-usd">
                    <div class="sgt-text">
                        <h4>${element.post_id.title}</h4>
                        <span>${element.post_id.postedFrom}</span>
                    </div>
                </div></a>`
            });
            $("#pinnedPostDiv").html(html);
        },
        error: function (e) {
            alert("Contact Support Partner: " + JSON.stringify(e));
        }
    });
}

function pinPost(postId, timeStamp){
    $.ajax({
        type: "post",
        url: "/newsFeed/pinPost",
        data :{postId : postId, planStamp : timeStamp},
        success: function (response) {
            console.log(response)
            $(`#unPin${postId}`).remove()
            let postData = response.data;
            $("#pinnedPostDiv").prepend(`<a href="/plan/singlePlan/${postId}"><div class="suggestion-usd">
                <div class="sgt-text">
                    <h4>${postData.title}</h4>
                    <span>${postData.postedFrom}</span>
                </div>
            </div></a>`);
        },
        error: function (e) {
            alert("Contact Support Partner: " + JSON.stringify(e));
        }
    });
}

function getip(){
    $.ajax({
        type: "get",
        url: "https://api.ipify.org/?format=json",
        success: function (response) {
            const ip = response.ip;
            $("#ipAddress").val(ip)
        },
        error: function (e) {
            alert("Contact Support Partner: " + JSON.stringify(e));
        }
    });
}

function submitComment(postId)
{
    const comment = $(`#${postId}cmntData`).val();
    if(comment == ''){
        return false;
    }
    $("#btnSubmit").attr("disabled", true);
    $.ajax({
        type: "post",
        url: "/newsFeed/postComment",
        data :{postId : postId, comment : comment },
        success: function (response) {
            $(`#${postId}cmntData`).val('');
            $("#btnSubmit").attr("disabled", false);
        },
        error: function (e) {
            alert("Contact Support Partner: " + JSON.stringify(e));
        }
    });
}

function loadComment(postId){
    $(`#${postId}box`).css("display", "block");
    $(`#${postId}disp`).css("display", "block");
    $(`#${postId}loding`).css("display", "block");
    
    $.ajax({
        type: "post",
        url: "/newsFeed/getComment",
        data :{postId : postId},
        success: function (response) {
            $(`#${postId}loding`).css("display", "none");
            let data = response.data;
            let cmnts = '';
            data.forEach(element => {
                cmnts += `<li class="commentPadd">
                    <div class="comment-list">
                        <div class="comment">
                            <img src="/logoSmall.png" style="padding: 0px 10px 0px 0px;border-radius:100px" height='40' alt="userImg">
                            <h3>${element.commentee_id.name}</h3>
                            <span><img src="images/clock.png" alt="">${element.commentDate}, ${element.commentTime}</span>
                            <p style="padding: 0px 0px 0px 55px;">${element.commentDetail}</p>
                        </div>
                    </div>
                </li>`
            });
            $(`#${postId}list`).html(cmnts)
        },
        error: function (e) {
            alert("Contact Support Partner: " + JSON.stringify(e));
        }
    });
}

function likePost(postId, count){
    let totalCount = parseInt(count) + 1;
    $(`#${postId}cmnt`).html(`<a href="javascript:void(0);" onclick="tempUnlikePost('${postId}', '${totalCount}')" class="com likedColor" ><i class="fas fa-heart"></i> ${totalCount} Interested</a>`);
    $.ajax({
        type: "post",
        url: "/newsFeed/likeUnlike",
        data :{type : 1, postId : postId},
        success: function (response) {
            $(`#${postId}`).html(`<a href="javascript:void(0);" onclick="unlikePost('${postId}', '${totalCount}')" class="com likedColor" ><i class="fas fa-heart"></i> ${totalCount} Interested</a>`);
        },
        error: function (e) {
            alert("Contact Support Partner: " + JSON.stringify(e));
        }
    });
}

function unlikePost(postId, count){
    let totalCount = parseInt(count) - 1;
    let htmlData = `<a href="javascript:void(0);" onclick="tempLike('${postId}', '${totalCount}')" class="com"><i class="fas fa-heart"></i> ${totalCount} Interested</a>`
    $(`#${postId}cmnt`).html(htmlData);
    $.ajax({
        type: "post",
        url: "/newsFeed/likeUnlike",
        data :{type : 2, postId : postId},
        success: function (response) {
            $(`#${postId}`).html(`<a href="javascript:void(0);" onclick="likePost('${postId}', '${totalCount}')" class="com"><i class="fas fa-heart"></i> ${totalCount} Interested</a>`);
        },
        error: function (e) {
            alert("Contact Support Partner: " + JSON.stringify(e));
        }
    });
}

function tempUnlikePost(postId, count){
    let totalCount = parseInt(count) - 1;
    $(`#${postId}cmnt`).html(`<a href="javascript:void(0);" onclick="tempLike('${postId}', '${totalCount}')" class="com"><i class="fas fa-heart"></i> ${totalCount} Interested/a>`);
}

function tempLike(postId, count){
    let totalCount = parseInt(count) + 1;
    $(`#${postId}cmnt`).html(`<a href="javascript:void(0);" onclick="tempUnlikePost('${postId}', '${totalCount}')" class="com likedColor" ><i class="fas fa-heart"></i> ${totalCount} Interested</a>`);
}
