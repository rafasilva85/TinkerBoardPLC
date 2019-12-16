(function(window){

	var Tools = {};
	Tools.addEvent = (function(){
		if(window.addEventListener){
			return function(elem, type, handler){
				elem.addEventListener(type, handler, false);
			};
		}else{
			return function(elem, type, handler){
				elem.attachEvent("on"+ type, handler);
			};
		}
	})();
	var templates = "<div class='d-content'>Date</div>" +
	    "<div class='d-con'>"+
	        "<div class='d-time'>"+
	            "<span>Days</span>"+
	            "<div class='d-days'>"+
	                "<input type='text' maxlength='2'>"+
	                "<span class='d-up'></span>"+
	                "<span class='d-down'></span>"+
	            "</div>"+
	        "</div>"+
	        "<div class='d-time'>"+
	            "<span>Month</span>"+
	            "<div class='d-month'>"+
	                "<input type='text' maxlength='2'>"+
	                "<span class='d-up'></span>"+
	                "<span class='d-down'></span>"+
	            "</div>"+
	        "</div>"+
	        "<div class='d-time'>"+
	            "<span>Year</span>"+
	            "<div class='d-year'>"+
	                "<input type='text' maxlength='4'>"+
	                "<span class='d-up'></span>"+
	                "<span class='d-down'></span>"+
	            "</div>"+
	        "</div>"+  
	    "</div>"+
	    "<div class='d-content'>Time</div>" +
	    "<div class='d-con'>"+
	        "<div class='d-time'>"+
	            "<span>Hour</span>"+
	            "<div class='d-hour'>"+
	                "<input type='text' maxlength='2'>"+
	                "<span class='d-up'></span>"+
	                "<span class='d-down'></span>"+
	            "</div>"+
	        "</div>"+
	        "<div class='d-time'>"+
	            "<span>Minute</span>"+
	            "<div class='d-minute'>"+
	                "<input type='text' maxlength='2'>"+
	                "<span class='d-up'></span>"+
	                "<span class='d-down'></span>"+
	            "</div>"+
	        "</div>"+
	        "<div class='d-time'>"+
	            "<span>Seconds</span>"+
	            "<div class='d-seconds'>"+
	                "<input type='text' maxlength='2'>"+
	                "<span class='d-up'></span>"+
	                "<span class='d-down'></span>"+
	            "</div>"+
	        "</div>"+  
	    "</div>";

	var sepDateTime = function(container){
		this.container = container;
		this.container.innerHTML = templates;

		this.init();
	};

	sepDateTime.prototype.init = function(){
		
		this.bindDays();

		this.bindMonth();

		this.bindYear();

		this.bindHour();

		this.bindMinuteSeconds();
	};

	sepDateTime.prototype.bindDays = function(){
		var _this = this;

		Tools.addEvent(this.container.querySelector('.d-days .d-up'), 'click', function(){
			var month = _this.container.querySelector('.d-month input').value;
			if(month === ''){
				return;
			}			
			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){
				input.value = '01';
				return;
			}

			_this.judgeDays(month);
			if(parseInt(val) + 1 > _this.MAX_DAYS){
				input.value = '01';
			}else{
				input.value = parseInt(val) < 9 ? '0' + (parseInt(val) + 1) : parseInt(val) + 1;
			}
			
		});
		Tools.addEvent(this.container.querySelector('.d-days .d-down'), 'click', function(){
			var month = _this.container.querySelector('.d-month input').value;
			if(month === ''){return;}		
			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){
				input.value = '01';
				return;
			}

			_this.judgeDays(month);
			if(parseInt(val) - 1 <= 0){
				input.value = _this.MAX_DAYS;
			}else{
				input.value = parseInt(val) < 11 ? '0' + (parseInt(val) - 1) : parseInt(val) - 1;
			}
		});
	};
	sepDateTime.prototype.bindMonth = function(){
		var _this = this;
		Tools.addEvent(this.container.querySelector('.d-month .d-up'), 'click', function(){
			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){input.value = '01';return;}

			if(/^([1-9]{1}|[0][1-9]|[1][0-2])$/.test(val)){
				if(parseInt(val) + 1 > 12 ){
					input.value = '01';
				}else{
					input.value = parseInt(val) < 9 ? '0' + (parseInt(val) + 1) : parseInt(val) + 1;
				}
			}else{
			}
		});
		Tools.addEvent(this.container.querySelector('.d-month .d-down'), 'click', function(){
			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){input.value = '01';return;}

			if(/^([1-9]{1}|[0][1-9]|[1][0-2])$/.test(val)){
				if(parseInt(val) - 1 < 1 ){
					input.value = '12';
				}else{
					input.value = parseInt(val) < 11 ? '0' + (parseInt(val) - 1) : parseInt(val) - 1;
				}
			}else{
			}
		});
	};
	sepDateTime.prototype.bindYear = function(){
		var _this = this;
		Tools.addEvent(this.container.querySelector('.d-year .d-up'), 'click', function(){
			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){input.value = new Date().getFullYear();return;}

			if(/^[1-9]\d{3}$/.test(val)){
				input.value = parseInt(val) + 1;
			}else{
			}
		});
		Tools.addEvent(this.container.querySelector('.d-year .d-down'), 'click', function(){
			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){input.value = new Date().getFullYear();return;}

			if(/^[1-9]\d{3}$/.test(val)){
				input.value = parseInt(val) - 1;
			}else{
			}
		});
	};
	sepDateTime.prototype.bindHour = function(){
		var _this = this;

		Tools.addEvent(this.container.querySelector('.d-hour .d-up'), 'click', function(){
			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){input.value = '00'; return;}

			if(/^(1[0-9]|2[0-3]|0[0-9]|[0-9])$/.test(val)){

				if(parseInt(val) + 1 > 23){
					input.value = '00';
				}else{					
					input.value = parseInt(val) < 9 ? ('0' + (parseInt(val) + 1)) : (parseInt(val) + 1) ;
				}				
			}else{
			}
		});
		Tools.addEvent(this.container.querySelector('.d-hour .d-down'), 'click', function(){

			var input = _this.getInput(this);
			var val = input.value;
			if(val === ''){input.value = '00'; return;}

			if(/^(1[0-9]|2[0-3]|0[0-9]|[0-9])$/.test(val)){

				if(parseInt(val) - 1 < 0){
					input.value = '23';
				}else{
					
					input.value = parseInt(val) < 11 ? ('0' + (parseInt(val) - 1)) : (parseInt(val) - 1) ;
				}				
			}else{
			}
		});
	};
	sepDateTime.prototype.bindMinuteSeconds = function(){

		var _this = this;

		['.d-minute .d-up','.d-seconds .d-up'].forEach(function(elem){
			Tools.addEvent(_this.container.querySelector(elem), 'click', function(){
				var input = _this.getInput(this);
				var val = input.value;
				if(val === ''){input.value = '00';return;}
				if(/^([0-9]{1}|[0-5][0-9]|[6][0])$/.test(val)){
					if(parseInt(val) > 58){
						input.value = '00';
					}else{
						input.value = parseInt(val) < 9 ? ('0' + (parseInt(val) + 1)):(parseInt(val) + 1);
					}
				}else{
				}
			});
		});	

		['.d-minute .d-down','.d-seconds .d-down'].forEach(function(elem){
			Tools.addEvent(_this.container.querySelector(elem), 'click', function(){
				var input = _this.getInput(this);
				var val = input.value;
				if(val === ''){input.value = '00';return;}
				if(/^([0-9]{1}|[0-5][0-9]|[6][0])$/.test(val)){
					if(parseInt(val) - 1 < 0){
						input.value = '59';
					}else{
						input.value = parseInt(val) < 11 ? ('0' + (parseInt(val) - 1)):(parseInt(val) - 1);
					}
				}else{
				}
			});
		});	
	};

	sepDateTime.prototype.getInput = function(elem){
		return elem.parentNode.querySelector("input");
	};
	sepDateTime.prototype.judgeDays = function(month){

		if('01 03 05 07 08 10 12'.indexOf(month) > -1){
				this.MAX_DAYS = 31;
			}			
			else if('04 06 09 11'.indexOf(month) > -1){
				this.MAX_DAYS = 30;
			}
			else{
				var year = this.container.querySelector('.d-year input').value;
				if(year % 400 === 0 ||(year % 4 === 0 && year % 100 !== 0)){
					this.MAX_DAYS = 29;
				}else{
					this.MAX_DAYS = 28;
				}
			}
	};
	sepDateTime.prototype.setDefaultTime = function(time){
		var date = time.split(" "),
			t = date[0].split("-"),
			d = date[1].split(":");
		this.container.querySelector('.d-days input').value = t[2];
		this.container.querySelector('.d-month input').value = t[1];
		this.container.querySelector('.d-year input').value = t[0];

		this.container.querySelector('.d-hour input').value = d[0];
		this.container.querySelector('.d-minute input').value = d[1];
		this.container.querySelector('.d-seconds input').value = d[2];
	};


	window.sepDateTime  = sepDateTime;

})(window);