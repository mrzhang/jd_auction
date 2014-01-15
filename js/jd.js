
var aboutme = "***京东夺宝岛抢拍-谁与争锋***\n" 
		+ "提供自动报价(半自动)和自动抢拍（全自动）两种功能\n"
		+ "六折价（原价6折值，为抢拍出价提供参考）\n"
		+ "最高出价（自己愿接受的最高价，程序会自动在当前商品报价+1，到达最高价放弃出价，放弃此商品。)\n";
console.log(aboutme);
console.log("有任何问题 %c QQ 244320233", "color:red");
console.log("个人主页：http://zhanghang.org");
var priceLimit = parseInt(/\d+/.exec($(".fore4 del").html())*1*0.6);
var addr = document.location.href;
var uid = /[\d]{4,8}/.exec(addr)[0];
var code = "<div id='qp_div'>"
		+ "商品6折价：<input type='text' id='qp_price_limit' readonly />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "最高出价<input type='text' id='qp_max_price' />&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "<input type='button' value='后台开抢' id='qp_btn_begin' class='qp_btn'/>&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "<input type='button' value='仅刷价格' id='qp_btn_refresh' class='qp_btn' />&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "【开启控制台可查看抢拍提示】</div>";
$('body').prepend(code);
$('#qp_price_limit').val(priceLimit);
$('#qp_max_price').val(priceLimit);

$('#qp_btn_refresh').on('click', function(){queryPrice(uid, priceLimit)});
$('#qp_btn_begin').on('click', function(){crazyBuying(uid, priceLimit)});

function queryPrice(uid, priceLimit) {
	console.info("自动报价，"+uid+"自动输入价格。");
	var price;
	var priceMax = $('#qp_max_price').val();
	var time = new Date().getTime();
	var queryIt = "http://auction.jd.com/json/paimai/bid_records?t="
			+ time + "&pageNo=1&pageSize=1&dealId=" + uid;
	$.get(queryIt, function(data){
		price = data.datas[0].price*1+1;
		if (price<=priceMax) {
			$(".quantity-text:last").val(price);
		} else {
			console.info("超出限制价格，不自动输入抢拍价！");
		}
	});
}

function crazyBuying(uid, priceLimit) {
	console.info("抢拍商品"+uid+"自动提交抢拍价。");
	var price;
	var priceMax = $('#qp_max_price').val();
	var time = new Date().getTime();
	var queryIt = "http://auction.jd.com/json/paimai/bid_records?t="
			+ time + "&pageNo=1&pageSize=1&dealId=" + uid;
	$.get(queryIt, function(data){
		price = data.datas[0].price*1+1;
		if (price<=priceMax) {
			var buyIt = "http://auction.jd.com/json/paimai/bid?t="
				+ time + "&dealId=" + uid + "&price=" + price;
			$.get(buyIt, function(data){
				sayMsg(data);
			}, 'json');
		} else {
			console.info("超出限制价格，停止抢购！");
		}
	});
}

function sayMsg(response) {
	if (response.code == "200") {
    	doErrorMsg("恭喜您！","出价成功");
    } else {
        if (response.code == "453") {
            doErrorMsg("哎呀！出价失败~","请您不要连续出价~");
        }
        if (response.code == "451") {
            doErrorMsg("哎呀！出价失败~","出价不得低于当前价格~");
        }
        if (response.code == "452") {
        	doErrorMsg("哎呀！出价失败~","拍卖尚未开始，暂不能出价~");
        }
        if (response.code == "450") {
            doErrorMsg("哎呀！出价失败~","拍卖已经结束，您略晚了一步~");
        }
/*            if (response.code == "455") {
            alert("您的京豆不足或三次试拍机会已用完！");
        }*/
        if (response.code == "457") {
        	doErrorMsg("哎呀！出价失败~","您暂无参拍资格~");
        }
/*           if (response.code == "467") {
            alert("银牌及以上会员京豆小于等于0，不能出价!");
        }*/
        if (response.code == "459") {
            doErrorMsg("哎呀！出价失败~","出价不能低于商品起拍价~");
        }
        if (response.code == "460") {
            doErrorMsg("哎呀！出价失败~","每次加价不得低于最低加价~");
        }
        if (response.code == "461") {
            doErrorMsg("哎呀！出价失败~","每次加价不得高于最高加价~");
        }
        if (response.code == "462") {
            doErrorMsg("哎呀！出价失败~","您所出的价格不能超过该商品的京东价~");
        }
        if (response.code == "463") {
            doErrorMsg("哎呀！出价失败~","出价格式不对！所出价格必须为正整数~");
        }
        if (response.code == "464") {
            doErrorMsg("哎呀！出价失败~","您来晚了一步，本次拍卖已关闭~");
        }
        if (response.code == "465") {
            doErrorMsg("哎呀！出价失败~","您来晚了一步，本次拍卖已删除~");
        }
        if (response.code == "466") {
            doErrorMsg("哎呀！出价失败~","您的账户异常，请稍后再试~");
        }
        if (response.code == "468") {
        	doErrorMsg("哎呀！出价失败~","出价异常，请稍后再试~");
        }
        if (response.code == "469") {
            doErrorMsg("哎呀！出价失败~","尊敬的京东会员,您的京豆需要大于0才可参与拍卖！");
        }
        if (response.code == "470") {
        	doErrorMsg("哎呀！出价失败~","尊敬的京东会员,您的京豆需要大于等于0才可参与拍卖！");
        }
        if (response.code == "471") {
        	doErrorMsg("尊敬的京东会员,为了保障您的账户安全,请先设置京东支付密码!","<a href='http://safe.jd.com/user/paymentpassword/safetyCenter.action' target='blank'>【点我设置支付密码】</a>");
        }
        if (response.code == "4201") {
            doErrorMsg("哎呀！出价失败~","您同时在拍的商品不得超过5个！");
        }
        if (response.code == "4202") {
            doErrorMsg("哎呀！出价失败~","您在夺宝岛获拍且未支付的拍卖不得超过5个!");
        }
        if (response.code == "4203") {
            doErrorMsg("哎呀！出价失败~","您于夺宝岛在拍或未支付的商品总数不得超过5个!");
        }

        if (response.code == "400") {
        	doErrorMsg("哎呀！出价失败~","系统异常，请稍后再试~");
        }
        if (response.code == "403") {
        	 doErrorMsg("哎呀！出价失败~","你还没登录~");
        	 return ;
        }
        if (response.code == "402") {
        	doErrorMsg("哎呀！出价失败~","系统响应异常，请稍后再试~");
        }
    }
}

function doErrorMsg(title, msg) {
	console.log(title + " %c "+msg, "color:red;" )
}






