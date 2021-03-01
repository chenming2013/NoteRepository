public class CacheTest
{

	//禁止缓存,针对不同的浏览器
	response.setDateHeader("Expires",-1 );
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Param", "no-cache");
}