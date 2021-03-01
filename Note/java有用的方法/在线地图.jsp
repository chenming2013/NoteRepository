<!DOCTYPE>
<html>
	<head>
		<meta http-equiv="charset=utf-8;" />
	</head>
	<body>
		<div class="zl_p">
			<span class="zl_left">地图坐标:</span>
			经度: <input type="text" id="longitude" name="longitude" class="zl_input" style="width: 160px;" value="${userBean.region.lng }" />
			纬度: <input type="text" id="latitude" name="latitude" class="zl_input" style="width: 160px;" value="${userBean.region.lat }" />
			<div class="control-group" style="margin-left: 90px;">
				<div class="controls">
					<script charset="utf-8" src="//map.qq.com/api/js?v=2.exp"></script>
					<script>
						var geocoder,map, marker,position = null, center,citylocation,tlat,tlng,ttlatLng,areaCode;	//	
						areaCode='';
						 
						var lng = $("#longitude").val();
						var lat = $("#latitude").val();
						tlat = parseFloat(lat);
						tlng = parseFloat(lng);
						console.log("haha: lng: "+lng);
						console.log("gaga: lat: "+lat);
						tlatLng = new qq.maps.LatLng(tlat, tlng);
						position=tlatLng; //position是定位的位置
						
						var initLng = '${userBean.region.lng}';
						var initLat = '${userBean.region.lat}';
						function init(){
							center=new qq.maps.LatLng(initLat, initLng);//  39.982163, 116.306070
							var map=new qq.maps.Map(document.getElementById("container111"),{
								center:center,
								zoom:15
							});
							 marker = new qq.maps.Marker({
								   map:map,
								   position: position
								});
							var callbacks={
							//若服务请求成功，则运行以下函数，并将结果传入
							complete:function(results){
								   map.setCenter(results.detail.latLng);
								   if(tlatLng!=null){
									   map.panTo(tlatLng);
									   marker.setPosition(tlatLng);
								   }
							 }
							}
							var cs=new qq.maps.CityService(callbacks);
							if(tlat!=null && tlat>0 && tlng!=null && tlng>0){
								cs.searchCityByLatLng(new qq.maps.LatLng(tlat.toFixed(4),tlng.toFixed(4))); 
							}else if(areaCode!=""){
								cs.searchCityByAreaCode(areaCode);
							}
						   geocoder = new qq.maps.Geocoder(callbacks);
							var listener=qq.maps.event.addListener(map, 'click', function(e) {
								//alert('您点击了地图.');
								var latLng = e.latLng;
								position = latLng;
									lat = latLng.getLat().toFixed(5);
									lng = latLng.getLng().toFixed(5);
									$("#latitude").val(lat);
									$("#longitude").val(lng);
									marker.setPosition(e.latLng);
							});
						}
						
						window.onload=function(){
							init();
							
							//城市改变,为经纬度赋值
							$('#regionId').change(function(){
								var regionId = $("#regionId").val();
								//查询城市的所有信息
								var url = '/front/yyzj/pc/region/front-region/findByRegionId.do';
								$.post(url,{
									regionId: regionId
								},function(result){
									if(result && result.success){
										var bean = result.data;
										console.log("bean: "+bean);
										$("#longitude").val(bean.lng);
										$("#latitude").val(bean.lat);
									
										//选择地区之后,需要重新为地图定位赋值
										lng = bean.lng;
										lat = bean.lat;
										tlat = parseFloat(lat);
										tlng = parseFloat(lng);
										tlatLng = new qq.maps.LatLng(tlat, tlng);
										position=tlatLng; //position是定位的位置
										console.log("haha: position: "+position);
										init();
									}
								},'json');
							});
						};
						
					</script>
					<div id="container111" style="width: 500px; height: 500px;"></div>
					<span class="help-inline"></span>
				</div>
			</div>
		</div>
	</body>
</html