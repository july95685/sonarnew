class Bar{

	constructor(){

		this.config = {
			//根据字数来判断开头的位置
			HLFactor:4,
			HRFactor:1
		}

		this.options={
			perRectHeight: 10,
			perRectMargin: 15,
			fontSize: 10,
			//标题头长度
			titleHeight:0,
			pagePadding: 16
		}

		this.ctxHeight = 0;
		this.screenCSSWidth = 0;
		this.touchHandler = [];
		this.bar = null;

	}

	draw( options ){
		this.options = Object.assign({}, this.options, options);
		this.touchHandler = [];

		console.log(this.options.series);
		console.log(this.config);
		if(this.options.series[0].HLFactor){
			this.config.HLFactor = this.options.series[0].HLFactor;
		}

		this.setScreenCSSWidth( windowWidth=>{
			this.screenCSSWidth = windowWidth - this.options.pagePadding;
		this.setCtxHeight( this.options.setCanvasSize ); //canvas 高度

		this.drawBar()
	})
	}

	drawBar(){
		let options = this.options;
		let series = options.series;
		console.log(options);
		let ctx = wx.createCanvasContext(options.renderTo);
		this.ctx = ctx;

		//获取最长tag的值
		let maxTag = series.reduce( (a,b)=>a.value>b.value?a:b )
		let maxTagValue = maxTag.value;

		let conf = this.config;
		this.pixelValRate = (this.screenCSSWidth - conf.HLFactor*options.fontSize - options.fontSize* conf.HRFactor )/maxTagValue;
		console.log(this.pixelValRate);

		// this.drawTitle()
		this.drawVAxis(); //纵坐标轴
		// series.forEach((t,index)=>this.drawTitle(t, index))
		series.forEach((t, index)=> this.drawTagRect(t, index) )
		ctx.setFillStyle('#999999')
		ctx.draw()
	}

	drawTagRect( serie, index ){
		console.log(serie);
		let options = this.options;
		let conf = this.config;
		let ctx = this.ctx;

		let series = options.series;

		var color = ['999999'];
		ctx.setFillStyle('#999999')

		var x = options.fontSize*conf.HLFactor+8;

		var y = (options.perRectHeight+options.perRectMargin)*index + options.titleHeight;

		var w = Math.floor(serie.value * this.pixelValRate);

		console.log(x);
		ctx.fillRect(x, y, w*0.8, options.perRectHeight)
		console.log(x, y, w*0.8, options.perRectHeight);

		ctx.setFontSize(options.fontSize);
		ctx.fillText(serie.tag, options.fontSize/2, y+ (options.perRectHeight*2)/3 + 2); //y坐标的2/3 perRectHeight的偏移量
		ctx.fillText(serie.title, w*0.8+conf.HLFactor*20, y+ (options.perRectHeight*2)/3 + 2);

		this.touchHandler.push({
			area: [x-options.fontSize*conf.HLFactor, y, x+w, y+options.perRectHeight],
			serie: serie
		})
	}

	drawVAxis(){
		let options = this.options;
		let conf = this.config;
		let ctx = this.ctx;

		let tags = options.series.map( t=>t.tag )

		var x = options.fontSize*conf.HLFactor + 8;

		ctx.beginPath()
		ctx.setFillStyle('#ffffff')
		//设置y斜线颜色
		ctx.setStrokeStyle('#CD853F');
		ctx.setLineWidth(2)
		ctx.moveTo( x, 0 )
		console.log(this.ctxHeight);
		// ctx.moveTo( x, options.titleHeight )
		ctx.lineTo(x, this.ctxHeight )
		ctx.stroke()
	}

	drawTitle(){
		let ctx = this.ctx;
		let title = this.options.title;
		title = "test"
		console.log(title);
		console.log(this.options.titleHeight);

		ctx.beginPath();
		ctx.setFontSize(12);
		ctx.setFillStyle('#666666');

		var titleHeight = this.options.titleHeight
		var fontSize = this.options.fontSize
		// ctx.setFontSize(titleHeight-4);
		console.log((this.options.perRectHeight*2)/3);
		ctx.fillText(title,120,26.67)
	}

	onTouch(e){
		var touchX = e.touches[0].x,
			touchY = e.touches[0].y;

		this.touchHandler.forEach( h=>{

			let inArea = touchX > h.area[0] && touchX < h.area[2]
				&& touchY > h.area[1] && touchY < h.area[3]

			// 在此区域
			if( inArea ){
				e.serie = h.serie;
				this.options.onTouch(e);
			}
		})
	}

	onTouchEnd(e){}

	setCtxHeight( handler ){
		let options = this.options

		var ctxHeight = options.series.length* (options.perRectHeight+ options.perRectMargin) - options.perRectMargin
		this.ctxHeight = ctxHeight+options.titleHeight;

		handler && handler({
			height: this.ctxHeight
		})
	}

	setScreenCSSWidth( cb ){
		wx.getSystemInfo({
				success: res=>{
				cb && cb(res.windowWidth);
	}
	});
	}
}

module.exports = Bar;