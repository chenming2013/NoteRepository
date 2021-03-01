package com.web1.servletContext;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 该段代码是测试ServletContext读取配置资源文件
 * @author Lenovo
 *
 */

public class ReadProperties extends HttpServlet
{
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException
	{
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		
		//获取输入流
		InputStream inputStream = this.getServletContext().getResourceAsStream("DBInfo.properties");
		
		//创建Properties
		Properties properties = new Properties();
		
		//加载配置文件
		properties.load(inputStream);
		
		//读取配置文件的信息
		String user = properties.getProperty("user");
		String password = properties.getProperty("password");
		
		System.out.println("user="+user);
		System.out.println("password="+password);
		
		//关闭流
		inputStream.close();
		
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException
	{
		this.doGet(request, response);
	}
	
}
