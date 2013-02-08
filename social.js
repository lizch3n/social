
function encodeURIComponentRFC3986(str) {
    return encodeURIComponent(str).
        replace(/[!*'()]/g, function(p){
            return "%" + p.charCodeAt(0).toString(16);
        });}

(function ($, window, document, undefined) {
    $.multiSocialService = {
        url:encodeURIComponentRFC3986(location.href),
        useService:['twitter', 'facebook', 'pinterest', 'email'],
        bubble:['false'],
        orientation: ['horizontal'],
        count: ['horizontal'],
        lightbox: [],
        twitter: {
            url: '',
            tweet:{
                type:'horizontal',
                lang:'',
                text:'',
                show_count: 'none',
                via: '',
                url : 'http://www.pronto.com',
                width: '20px'
            },
            count: {
                type:'horizontal',
                lang:'',
                text:'',
                show_count: 'true',
                via:'',
                url : 'http://www.pronto.com'
            }
        },
        facebook: {
            share: {
                count: 'false',
                url : 'http://www.pronto.com'
            }
        },
        pinterest: {
            product: '',
            pin: {},
            count: 'horizontal',
            url: 'http://www.pronto.com',
            info: {
                img: ''
            }

        },
//    pinterestNoCount: {
//
//    },
        facebookAllJS : {
           async: true
        },
        email: {
            type: '',
            url: 'http://localhost:8080',
            page: '',
            price: '1million',
            title: ''
        }
    };

    $.fn.setMultiSocialService = function(option){

        var sInsertHtml = "<ul class='share-list'>";
        for(var i=0,len=$.multiSocialService.useService.length; i<len; i++){
            switch($.multiSocialService.useService[i]){
                case "twitter":
                    sInsertHtml += '<li class="share-twit">'+$("<li />").setTwitter($.multiSocialService.twitter.tweet).html()+'</li>';
                    break;
                case "facebook" :
                    sInsertHtml += '<li class="share-fb">'+$('<li />').setFb($.multiSocialService.facebook.share).html()+'</li>';
                    $(this).click(function(e){
                        var centerH = (screen.height/2)-130;
                        var centerW = (screen.width/2)-200;
                        if((e.srcElement.className == 'share-fb') || (e.srcElement.className == 'share-fbspan') ){
                            window.open("http://www.facebook.com/sharer.php?u="+$.multiSocialService.url+"", "", "toolbar=0, status=0, width=400, height=260, scrollbars=no, top="+centerH+",left="+centerW);
                        }
                    });
                    break;
                case "pinterest":
                    sInsertHtml += '<li class="share-pin">'+$("<li />").setPinterest($.multiSocialService.pinterest.pin).html()+'</li>';
                    break;
//            case "pinterestNoCount":
//                sInsertHtml += '<li class="share-pin">'+$("<li />").setPinterestNoCount($.multiSocialService.pinterestNoCount).html()+'</li>';
//                break;
                case "facebookAllJS" :
                    var fbAllBodyTop = '';
                    fbAllBodyTop +='<div id="fb-root"></div>';
                    fbAllBodyTop +='<script>(function(d, s, id) {';
                    fbAllBodyTop +='  var js, fjs = d.getElementsByTagName(s)[0];';
                    fbAllBodyTop +='  if (d.getElementById(id)) {return;}';
                    fbAllBodyTop +='  js = d.createElement(s); js.id = id;';
                    fbAllBodyTop +='  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId='+option.app_id+'";';
                    fbAllBodyTop +='  fjs.parentNode.insertBefore(js, fjs);';
                    fbAllBodyTop +='}(document, "script", "facebook-jssdk"));</script>';
                             $('body').append(fbAllBodyTop);
                    break;
                case 'email':
                    sInsertHtml += '<li class="share-email">test</li>' ;
                    break;
            }
            switch($.multiSocialService.orientation[i]){
                case 'horizontal':
                    $(this).addClass('share-horiz');
                    break;
                case 'vertical':
                    $(this).addClass('share-vert');
                    break;
            }
            switch($.multiSocialService.bubble[i]){
                case 'true':
                    $(this).addClass('share-bubble');
//                    console.log('hihi');
                    break;
                case 'false':
//                    $(this).addClass('share-nobubble');
                    break;
            }
            switch($.multiSocialService.lightbox[i]){
                case 'quickDetails-right':
                    $(this).addClass('share-qDRight');
                    break;
            }


        }
        sInsertHtml += '</ul>';
        $(this).html($(sInsertHtml));
        return this;
    };

    /**
     *
     * common initialize process
     * (ex.xss countermeasure)
     **/
    $.multiSocialService.initialize = function(option){
        //xss countermeasure(url sanitize)
        if(typeof option === 'string'){
            option = encodeURIComponentRFC3986(decodeURIComponent(option));
        }else{
            option.url = encodeURIComponentRFC3986(decodeURIComponent(option.url));
        }
        return option;
    };

    /**
     * set Twitter tweet button
     */
    $.fn.setTwitter = function(option){

        option = $.extend(true,{},$.multiSocialService.twitter.tweet,option);
        // set url
        if(!($.type(option.url) === 'string' && option.url.length > 0)){
            option.url = $.multiSocialService.url;
        }else{
            option.url = encodeURIComponentRFC3986(option.url);
        }
        var htmlTweetButton = '\
						<a href="http://twitter.com/share" data-url="'+option.url+'" \
						class="twitter-share-button" data-count="'+option.show_count+'" data-via="'+option.via+'" \
						data-text="'+option.text+'" data-lang="'+option.lang+'">Tweet</a> ';
        var asynctwit = '';
        asynctwit += '<script type="text/javascript">';
        asynctwit += '(function() {';
        asynctwit += 'var twitterScriptTag = document.createElement("script");';
        asynctwit += 'twitterScriptTag.type = "text/javascript";';
        asynctwit += 'twitterScriptTag.async = true;';
        asynctwit += 'twitterScriptTag.src = "http://platform.twitter.com/widgets.js";';
        asynctwit += 'var s = document.getElementsByTagName("script")[0];';
        asynctwit += 's.parentNode.insertBefore(twitterScriptTag, s);';
        asynctwit += '})();</script>';
        $('body').append(asynctwit);

        if ($.multiSocialService.twitter.count == 'vertical') {
            var twitCount = '<div class="share-twtcount">&nbsp;</div>';
            var customTwit = '<span>&nbsp;</span>';
            $(this).append(twitCount+htmlTweetButton+customTwit);
            $.ajax({url:'http://urls.api.twitter.com/1/urls/count.json?url='+$.multiSocialService.twitter.url, dataType:'jsonp', success: function(data){
                $('.share-twtcount').html(data.count+'<div class="share-arrow1">&nbsp;</div><div class="share-arrow2">&nbsp;</div>');
            }})
        }
        else{
            $(this).append(htmlTweetButton);
        }
        setTimeout(function(e) {
            var fh = $('.twitter-share-button').height();
            var fw = $('.twitter-share-button').width();
            $('.twitter-share-button').attr({'id':'iframe', 'wmode':'transparent', 'allowtransparency':'true'});
            $('#addSocialServiceTwitterTweet').css('width',option.width);
//        var hr = $('#iframe')[0].src;
//        $('#iframe')[0].src = hr+'wmode=transparent';
        },20);
        setTimeout(function() {
            $('.twitter-share-button').css({'width': option.width, 'background-color':'transparent'});

        }, 100);
        return this;
    };

    $.fn.setPinterest = function(option){
        option =
//        $.multiSocialService.initialize(
            $.extend(true,{},$.multiSocialService.pinterest.pin,option);
//    );
        if($.multiSocialService.pinterest.product){
            var img = $('#zoom1').attr('href');   //if is product details page use this image
        }else{
            if ($('.active .product').size() > 0) {
                var img = $('.active .product').find('.quickDeets-pin').siblings('a').attr('href'); // if is quick details use this image
            }
            else {
                var img = null;
            }
        }
        if (img != null){
            var removedThumb = img.replace(/http:\/\/cache-images.pronto.com.*\.php\?src\=/g, "");
        }
        else{
            if ($.multiSocialService.pinterest.info.img != ''){
                var removedThumb = $.multiSocialService.pinterest.info.img;
            } else{
            var removedThumb = $.multiSocialService.pinterest.url;
            }
        }
        var url = encodeURIComponentRFC3986($.multiSocialService.pinterest.url);
        var htmlPinButton = '\
		<a href="http://pinterest.com/pin/create/button/?url='+url+'&media='+removedThumb+'" class="pin-it-button" \
		count-layout="'+ 'none' +'" data-pin-config="none"><img border="0" src="" title="Pin It" alt="Pin it" class="share-pinButton"/></a>' +
            '';
       var asyncpin = '';
        asyncpin += '<script type="text/javascript">';
        asyncpin += '(function() {';
        asyncpin += 'var pinScriptTag = document.createElement("script");';
        asyncpin += 'pinScriptTag.type = "text/javascript";';
        asyncpin += 'pinScriptTag.async = true;';
        asyncpin += 'pinScriptTag.src = "../../resources/pronto/js/libraries/pinit.js";';
//        asyncpin += 'pinScriptTag.src = "//assets.pinterest.com/js/pinit.js";';
        asyncpin += 'var s = document.getElementsByTagName("div")[0];';
        asyncpin += 's.parentNode.insertBefore(pinScriptTag, s);';
        asyncpin += '})();</script>';
        
        var asyncpiniframe = '\
        <iframe src="http://assets.pinterest.com/pidget.html?r='+Math.random()*999999+'#via='+window.location.href+'type=pidget" height="0" width="0" frameborder="0" style="position: absolute; bottom: -1px; left: -1px;"></iframe>'
            +'';

        $('body').append(asyncpin);

        if ($.multiSocialService.pinterest.count == 'vertical') {
            var pinBubble = '<div class="share-pinCount">&nbsp;</div>';
            $(this).html(pinBubble+htmlPinButton);
            $.ajax( {url: 'http://api.pinterest.com/v1/urls/count.json?url='+$.multiSocialService.pinterest.url, dataType: 'jsonp', success: function(data){
                $('.share-pinCount').html(data.count+'<div class="share-arrow1">&nbsp;</div><div class="share-arrow2">&nbsp;</div>');

            }})
        }else {
            $(this).html(htmlPinButton);
        }

        return this;
    };

    $.fn.fbAllJS = function(option) {
            var fbAllBodyTop = '';
            fbAllBodyTop +='<div id="fb-root"></div>';
            fbAllBodyTop +='<script>(function(d, s, id) {';
            fbAllBodyTop +='  var js, fjs = d.getElementsByTagName(s)[0];';
            fbAllBodyTop +='  if (d.getElementById(id)) {return;}';
            fbAllBodyTop +='  js = d.createElement(s); js.id = id;';
            fbAllBodyTop +='  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";';
            fbAllBodyTop +='  fjs.parentNode.insertBefore(js, fjs);';
            fbAllBodyTop +='}(document, "script", "facebook-jssdk"));</script>';
            $('body').append(fbAllBodyTop);
            return this;
    };
//    $.fn.setPinterestNoCount = function(option){
//        option = $.multiSocialService.initialize($.extend(true,{},$.multiSocialService.pinterest.noCount,option));
//        var img = $('#zoom1').attr('href');
//        var removedThumb = img.replace(/http:\/\/cache-images.pronto.com.*\.php\?src\=/g, "");
//        var url = escape(window.location.href);
//        var htmlPinButton = '\
//		<a href="http://pinterest.com/pin/create/button/?url='+url+'&media='+removedThumb+'" class="pin-it-button" \
//		count-layout="none"><img border="0" src="" title="Pin It" alt="Pin it"/></a>' +
//            '';
//        var asyncpin = '';
//        asyncpin += '<script type="text/javascript">';
//        asyncpin += '(function() {';
//        asyncpin += 'var pinScriptTag = document.createElement("script");';
//        asyncpin += 'pinScriptTag.type = "text/javascript";';
//        asyncpin += 'pinScriptTag.async = true;';
//        asyncpin += 'pinScriptTag.src = "http://assets.pinterest.com/js/pinit.js";';
//        asyncpin += 'var s = document.getElementsByTagName("script")[0];';
//        asyncpin += 's.parentNode.insertBefore(pinScriptTag, s);';
//        asyncpin += '})();</script>';
//        $('body').append(asyncpin);
//        $(this).html(htmlPinButton);
//        return this;
//    };

    /**
     * set facebook sharer.php event
     * (this is deprecated method.)
     */
    $.fn.setFb = function(option){

        option = $.multiSocialService.initialize($.extend(true,{},$.multiSocialService.facebook.share,option));
        if(!($.type(option.url) === 'string' && option.url.length > 0)){
            option.url = $.multiSocialService.url;
        }else{
            option.url = encodeURIComponentRFC3986(option.url);
        }
        if(option.count == 'true'){
            var fbcount = '\
            <div class="share-fbcount"></div>\
            <span class="share-fbspan" \
		    >FACEBK</span>' +
                '';
            $(this).html(fbcount);
            $.ajax({
                url: 'https://graph.facebook.com/?id='+$.multiSocialService.facebook.share.url,
                success: function(data){
                    $('.share-fbcount').html(data.shares+'<div class="share-arrow1">&nbsp;</div><div class="share-arrow2">&nbsp;</div>');
                },
                dataType: 'json'
            });
        }
        else {
            var fb = '\
		<span class="share-fbspan" \
		>FACEBK</span>' +
                '';
            $(this).html(fb);
        }

        return this;
    };

    $.fn.setEmail = function(option) {
//        option = $.extend(true,{},$.multiSocialService.email,option);
        option = $.multiSocialService.initialize($.extend(true,{},$.multiSocialService.email,option));
        switch(option.type){
            case "infographic":
                $.ajax({
                    url: '/emailShareFormInfographic?seoTitle='+option.page,
                    success: function(data){
                        $('.share-email').click(function(){
                            emailWin = window.open('/emailShareFormInfographic?seoTitle='+$.multiSocialService.email.page, "emailWin","toolbar=1,titlebar=1,location=1,directories=1,menubar=1,resizable=no,width=535,height=660");
                            emailWin.moveTo((screen.width-580)/2, (screen.height-580)/2);
                        });
                    }
                });
                break;
            case "product":
                break;
            case "quicklook":
                break;
        }


    } ;


///**
// * set Facebook Dialog Share
// */
//$.fn.setFacebookShare = function(option){
//    option = $.extend(true,{},$.multiSocialService.facebook.share1,option);
//
//    if($("meta").filter(function(){return $(this).attr("property") === "fb:app_id";}).attr("content") !== undefined){
//        option.app_id = $("meta").filter(function(){return $(this).attr("property") === "fb:app_id";}).attr("content");
//    }
//    //set tag app_id
//    if(!option.app_id){
//        return false;
//    }
//
//    var sHtmlBodyTop = '';
//    sHtmlBodyTop +='<div id="fb-root"></div>';
//    sHtmlBodyTop +='<script>(function(d, s, id) {';
//    sHtmlBodyTop +='  var js, fjs = d.getElementsByTagName(s)[0];';
//    sHtmlBodyTop +='  if (d.getElementById(id)) {return;}';
//    sHtmlBodyTop +='  js = d.createElement(s); js.id = id;';
//    sHtmlBodyTop +='  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId='+option.app_id+'";';
//    sHtmlBodyTop +='  fjs.parentNode.insertBefore(js, fjs);';
//    sHtmlBodyTop +='}(document, "script", "facebook-jssdk"));</script>';
//
//    $('body').append(sHtmlBodyTop);
//    $('html').attr("xmlns:fb","http://ogp.me/ns/fb#");
//
//    var sHtmlFacebookShare = '';
//    $(this).html(sHtmlFacebookShare);
//
//    function postToFeed() {
//    function callback(response) {
//        document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
//    }
//
//    document.ready = FB.ui($.multiSocialService.facebook.share, callback);
////        $.get("http://www.facebook.com/plugins/like.php?api_key=383018998414453&channel_url=http%3A%2F%2Fstatic.ak.facebook.com%2Fconnect%2Fxd_arbiter.php%3Fversion%3D8%23cb%3Dfb4eec3%26origin%3Dhttp%253A%252F%252Flocalhost%253A8080%252Ff2c19cca58%26domain%3Dlocalhost%26relation%3Dparent.parent&extended_social_context=false&href=http%3A%2F%2Flocalhost%3A8080%2Fproduct%2FiPod%2520nano%25206th%2520Generation%25208GB%2520Flash%2520MP3%2520Player%2520-%2520Green-g_11502116285&layout=standard&locale=en_US&node_type=link&sdk=joey&show_faces=true&width=450#");
//      }
//
//    $('.facebookButton2').click(function(){postToFeed()});
//    return this;
//} ;


})(jQuery, window, document);
