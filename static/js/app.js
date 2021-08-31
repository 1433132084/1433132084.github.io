//地图容器
var chart = echarts.init(document.getElementById('main'));
//34个省、市、自治区的名字拼音映射数组
var provinces = {
    //23个省
    "台湾-不发": "taiwan",
    "河北-直达10-20元_中转15-20": "hebei",
    "山西-直达10-20元_中转15-20": "shanxi",
    "辽宁-直达20元_中转30": "liaoning",
    "吉林-直达20元_中转30": "jilin",
    "黑龙江-直达30元_中转35-40": "heilongjiang",
    "江苏-直达10-20元_中转15-20": "jiangsu",
    "浙江-直达20元_中转30-40": "zhejiang",
    "安徽-直达10-20元_中转15-20": "anhui",
    "福建-直达30元_中转35-40": "fujian",
    "江西-直达20元_中转30-40": "jiangxi",
    "山东*5-10元几乎直达全部县区": "shandong",
    "河南-直达10-20元_中转15-20": "henan",
    "湖北-直达20元_中转30-40": "hubei",
    "湖南-直达20元_中转30": "hunan",
    "广东-直达30元_中转35-40": "guangdong",
    "海南-直达40元_中转50-60": "hainan",
    "四川-直达30元_中转40-50": "sichuan",
    "贵州-直达30元_中转40-50": "guizhou",
    "云南-直达40元_中转50-60": "yunnan",
    "陕西-直达20元_中转30-40": "shanxi1",
    "甘肃-直达30元_中转35-40": "gansu",
    "青海-直达40元_中转50-60": "qinghai",
    //5个自治区
    "新疆-直达40元_中转50-60": "xinjiang",
    "广西-直达30元_中转40-50": "guangxi",
    "内蒙古-直达20元_中转30-40": "neimenggu",
    "宁夏-直达20元_中转30": "ningxia",
    "西藏-不发": "xizang",
    //4个直辖市
    "北京-直达10-20元_中转15-20": "beijing",
    "天津-直达10-20元_中转15-20": "tianjin",
    "上海-直达10-20元_中转15-20": "shanghai",
    "重庆-直达30元_中转40-50": "chongqing",
    //2个特别行政区
    "香港": "xianggang",
    "澳门": "aomen"
};

//直辖市和特别行政区-只有二级地图，没有三级地图
var special = ["北京","天津","上海","重庆","香港","澳门"];
var mapdata = [];
//绘制全国地图
$.getJSON('static/map/china.json', function(data){
	d = [];
	for( var i=0;i<data.features.length;i++ ){
		d.push({
			name:data.features[i].properties.name
		})
	}
	mapdata = d;
	//注册地图
	echarts.registerMap('china', data);
	//绘制地图
	renderMap('china',d);
});

//地图点击事件
chart.on('click', function (params) {
	console.log( params );
	if( params.name in provinces ){
		//如果点击的是34个省、市、自治区，绘制选中地区的二级地图
		$.getJSON('static/map/province/'+ provinces[params.name] +'.json', function(data){
			echarts.registerMap( params.name, data);
			var d = [];
			for( var i=0;i<data.features.length;i++ ){
				d.push({
					name:data.features[i].properties.name
				})
			}
			renderMap(params.name,d);
		});
	}else if( params.seriesName in provinces ){
		//如果是【直辖市/特别行政区】只有二级下钻
		if(  special.indexOf( params.seriesName ) >=0  ){
			renderMap('china',mapdata);
		}else{
			//显示县级地图
			$.getJSON('static/map/city/'+ cityMap[params.name] +'.json', function(data){
				echarts.registerMap( params.name, data);
				var d = [];
				for( var i=0;i<data.features.length;i++ ){
					d.push({
						name:data.features[i].properties.name
					})
				}
				renderMap(params.name,d);
			});	
		}	
	}else{
		renderMap('china',mapdata);
	}
});

//初始化绘制全国地图配置
var option = {
	backgroundColor: '#000',
    title : {
        text: 'Echarts3 中国地图下钻至县级',
        subtext: '三级下钻',
        link:'http://www.ldsun.com',
        left: 'center',
        textStyle:{
            color: '#fff',
            fontSize:16,
            fontWeight:'normal',
            fontFamily:"Microsoft YaHei"
        },
        subtextStyle:{
        	color: '#ccc',
            fontSize:13,
            fontWeight:'normal',
            fontFamily:"Microsoft YaHei"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b}'
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        },
        iconStyle:{
        	normal:{
        		color:'#fff'
        	}
        }
    },
    animationDuration:1000,
	animationEasing:'cubicOut',
	animationDurationUpdate:1000
     
};
function renderMap(map,data){
	option.title.subtext = map;
    option.series = [ 
		{
            name: map,
            type: 'map',
            mapType: map,
            roam: false,
            nameMap:{
			    'china':'中国'
			},
            label: {
	            normal:{
					show:true,
					textStyle:{
						color:'#999',
						fontSize:13
					}  
	            },
	            emphasis: {
	                show: true,
	                textStyle:{
						color:'#fff',
						fontSize:13
					}
	            }
	        },
	        itemStyle: {
	            normal: {
	                areaColor: '#323c48',
	                borderColor: 'dodgerblue'
	            },
	            emphasis: {
	                areaColor: 'darkorange'
	            }
	        },
            data:data
        }	
    ];
    //渲染地图
    chart.setOption(option);
}
