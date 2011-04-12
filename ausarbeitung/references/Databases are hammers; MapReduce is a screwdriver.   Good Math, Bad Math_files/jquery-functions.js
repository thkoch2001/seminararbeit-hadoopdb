//sidebar tabs
$(document).ready(function(){
	$("#tab1").click(function(){
		$("li#tab1").addClass("active");
		$("li#tab2").removeClass("active");
		$("li#tab3").removeClass("active");
		$("ol#readersPicksList").show();
		$("ol#mostActiveList").hide();
		$("ol#mostGermanList").hide();
	
		return false;
	});
	
	$("#tab2").click(function(){
		$("li#tab1").removeClass("active");
		$("li#tab2").addClass("active");
		$("li#tab3").removeClass("active");
		$("ol#readersPicksList").hide();
		$("ol#mostActiveList").show();
		$("ol#mostGermanList").hide();
	
		return false;
	});
	
	$("#tab3").click(function(){
		$("li#tab1").removeClass("active");
		$("li#tab2").removeClass("active");
		$("li#tab3").addClass("active");
		$("ol#readersPicksList").hide();
		$("ol#mostActiveList").hide();
		$("ol#mostGermanList").show();
	
		return false;
	});

	$("#nextQuote").click(function(){
		$("#daQuotes").animate( { left:"-=321px" }, { queue:true, duration:1000 } );
	});
	
	$("#previousQuote").click(function(){
		$("#daQuotes").animate( { left:"+=321px" }, { queue:true, duration:1000 } );
	});
	
	$("#channelsLink").click(function(){
		$("#rssList").hide("normal");
		$("#moreList").hide("normal");
		$("#rssLink").removeClass();
		$("#moreLink").removeClass();
		
		$("#channelsList").toggle("normal");
		$("#channelsLink").toggleClass("active");
	});
	
	$("#rssLink").click(function(){
		$("#channelsList").hide("normal");
		$("#moreList").hide("normal");
		$("#channelsLink").removeClass();
		$("#moreLink").removeClass();
		
		$("#rssList").toggle("normal");
		$("#rssLink").toggleClass("active");
	});
	
	$("#moreLink").click(function(){
		$("#channelsList").hide("normal");
		$("#rssList").hide("normal");
		$("#channelsLink").removeClass();
		$("#rssLink").removeClass();
		
		$("#moreList").toggle("normal");
		$("#moreLink").toggleClass("active");
	});
	
});